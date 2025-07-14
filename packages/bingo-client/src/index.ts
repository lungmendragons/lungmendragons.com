import {
  GameSession,
  type TilePlace,
  type ActiveBoard,
  type BoardDef,
  type TeamId,
  type TileId,
} from "bingo-logic";
import {
  ClientMessageSchema,
  ClientOpcode,
  ServerMessageSchema,
  ServerOpcode,
  type ServerMessage,
} from "bingo-server/protocol";
import {
  BinaryReader,
  BinaryWriter,
  s,
} from "binary-schema";
import { cfg, stateMachine, type EventCtx } from "./state-machine";
import { $fetch, FetchError } from "ofetch";

// TODO: probably only send relevant sync data.

interface BingoSyncData {
  state: string;
  active: ActiveBoard | undefined;
  def: BoardDef | undefined;
  users: User[] | undefined;
  teams: Team[] | undefined;
  start: number | undefined;
  timer: TimerState | undefined;
  log: string[] | undefined;
}

export interface Team {
  color: string;
  name: string;
}

type UserId = string;

interface User {
  id: UserId;
  name: string;
  teams: TeamId[];
}

export type TimerState = {
  kind: "paused";
  time: number;
} | {
  kind: "active";
  target: number;
} | {
  kind: "set";
  time: number;
} | {
  kind: "unset";
};
const TimerStateSchema: s.Schema<TimerState> = s.union("kind", {
  paused: {
    time: s.f64,
  },
  active: {
    target: s.f64,
  },
  set: {
    time: s.f64,
  },
  unset: {},
});

const TeamSchema: s.Schema<Team> = s.struct({
  color: s.string,
  name: s.string,
});

const UserSchema: s.Schema<User> = s.struct({
  id: s.string,
  name: s.string,
  teams: s.array(s.u8),
});

const ActiveBoardSchema: s.Schema<ActiveBoard> = s.struct({
  tiles: s.array(s.struct({
    claimed: s.array(s.u8),
  })),
});

const BoardDefSchema: s.Schema<BoardDef> = s.struct({
  width: s.u8,
  height: s.u8,
  extra: s.u8,
  tiles: s.array(s.struct({
    text: s.string,
    points: s.u8,
    stealable: s.boolean,
    exclusive: s.boolean,
  })),
});

const BingoSyncDataSchema: s.Schema<BingoSyncData> = s.struct({
  state: s.string,
  active: s.option(ActiveBoardSchema),
  def: s.option(BoardDefSchema),
  users: s.option(s.array(UserSchema)),
  teams: s.option(s.array(TeamSchema)),
  start: s.option(s.f64),
  timer: s.option(TimerStateSchema),
  log: s.option(s.array(s.string)),
});

export type BingoAction = {
  kind: "click_tile";
  tile: TileId;
  team: TeamId;
} | {
  kind: "clear_tile";
  tile: TileId;
} | {
  kind: "enter_room";
  name: string;
} | {
  kind: "join_team";
  team: TeamId;
} | {
  kind: "set_team_data";
  team: TeamId;
  color: string | undefined;
  name: string | undefined;
};

const BingoActionSchema: s.Schema<BingoAction> = s.union("kind", {
  click_tile: {
    tile: s.u8,
    team: s.u8,
  },
  clear_tile: {
    tile: s.u8,
  },
  enter_room: {
    name: s.string,
  },
  join_team: {
    team: s.u8,
  },
  set_team_data: {
    team: s.u8,
    color: s.option(s.string),
    name: s.option(s.string),
  },
});

interface Syncs {
  active?: boolean;
  board?: boolean;
  users?: boolean;
  teams?: boolean;
  timer?: boolean;
  to?: string;
};

export const bingoStateMachine = stateMachine(() => {
  type S = {
    boardUnset: { teams: Team[]; timer: TimerState };
    // waitForStart: {
    //   session: GameSession;
    //   teams: Team[];
    // };
    gameActive: {
      session: GameSession;
      teams: Team[];
      timer: TimerState;
    };
  };
  type E = {
    setBoard: { board: BoardDef };
    setTimer: { timer: TimerState };
    clickTile: { team: TeamId; tile: TileId };
    clearTile: { tile: TileId };
    setTeamData: { team: TeamId; color?: string; name?: string };
    sync: { data: BingoSyncData };
    logAction: string;
  };
  type H = object;

  async function setTeamData(s: { teams: Team[] }, e: E["setTeamData"], ctx: EventCtx<S, E, H>) {
    const teamData = s.teams[e.team];
    if (!teamData)
      return;

    if (e.name !== undefined) {
      teamData.name = e.name;
    }
    if (e.color !== undefined) {
      teamData.color = e.color;
    }
  }

  function syncSession(session: GameSession, sync: BingoSyncData) {
    if (sync.active)
      session.activeBoard = sync.active;
    if (sync.def)
      session.boardDef = sync.def;
    if (sync.start)
      session.start = sync.start;
  }

  return cfg<[teams: Team[]], S, E, H>({
    initial: teams => ({
      type: "boardUnset",
      data: {
        teams,
        timer: { kind: "unset" },
      },
    }),
    state: {
      boardUnset: {
        setBoard: async (s, { board }, ctx) => {
          ctx.next("gameActive", {
            session: new GameSession(board),
            teams: s.teams,
            timer: s.timer,
          });
        },
        setTeamData,
        setTimer: async (s, { timer }, ctx) => {
          s.timer = timer;
        },
        sync: async (s, { data }, ctx) => {
          switch (data.state as keyof S) {
            case "boardUnset":
              if (data.teams)
                s.teams = data.teams;
              if (data.timer)
                s.timer = data.timer;
              break;
            // case "waitForStart":
            //   if (data.def) {
            //     const session = new GameSession(data.def);
            //     syncSession(session, data);
            //     ctx.next("waitForStart", { session, teams: data.teams ?? s.teams });
            //   }
            //   break;
            case "gameActive":
              if (data.def) {
                const session = new GameSession(data.def);
                syncSession(session, data);
                ctx.next("gameActive", {
                  session,
                  teams: data.teams ?? s.teams,
                  timer: data.timer ?? { kind: "unset" },
                });
              }
              break;
            default:
              console.warn("invalid sync state");
              break;
          }
        },
      },
      // waitForStart: {
      //   setTeamData,
      //   sync: async (s, { data }, ctx) => {
      //     switch (data.state as keyof S) {
      //       // case "boardUnset":
      //       //   ctx.next("boardUnset", { teams: data.teams ?? s.teams });
      //       //   break;
      //       case "waitForStart":
      //         syncSession(s.session, data);
      //         if (data.teams)
      //           s.teams = data.teams;
      //         break;
      //       case "gameActive":
      //         syncSession(s.session, data);
      //         ctx.next("gameActive", {
      //           session: s.session,
      //           teams: data.teams ?? s.teams,
      //         });
      //         break;
      //       default:
      //         console.warn("invalid sync state");
      //         break;
      //     }
      //   },
      // },
      gameActive: {
        setTeamData,
        setTimer: async (s, { timer }, ctx) => {
          s.timer = timer;
        },
        clickTile: async (s, { team, tile }, ctx) => s.session.clickTile(team, tile),
        clearTile: async (s, { tile }, ctx) => s.session.clearTile(tile),
        sync: async (s, { data }, ctx) => {
          switch (data.state as keyof S) {
            // case "boardUnset":
            //   ctx.next("boardUnset", { teams: data.teams ?? s.teams });
            //   break;
            // case "waitForStart":
            //   syncSession(s.session, data);
            //   ctx.next("waitForStart", {
            //     session: s.session,
            //     teams: data.teams ?? s.teams,
            //   });
            //   break;
            case "gameActive":
              syncSession(s.session, data);
              if (data.teams)
                s.teams = data.teams;
              if (data.timer)
                s.timer = data.timer;
              break;
            default:
              console.warn("invalid sync state");
              break;
          }
        },
      },
    },
  });
});
export type BingoStateMachine = ReturnType<typeof bingoStateMachine>;
function bingoSession(machine: BingoStateMachine) {
  if (machine.state.type === "boardUnset")
    return undefined;
  return machine.state.data.session;
}

type LogState = {
  entries: string[];
  sent: number;
};

// eslint-disable-next-line antfu/top-level-function
export const networkStateMachine = (wsurl: string, fetchurl: string) => stateMachine(() => {
  function createBingoStateMachine(teams: Team[], ctx: EventCtx<S, E, H>) {
    const out = bingoStateMachine(teams);
    return out;
  }

  function renderTileName(tile: TilePlace) {
    switch (tile.kind) {
      case "main":
        return `${String.fromCharCode(0x41 + tile.row)}${tile.col + 1}`;
      case "extra":
        return `E${tile.idx}`;
    }
  }

  function renderTime(time: number) {
    const timeLeft = time ?? 0;
    const seconds = Math.floor((timeLeft / 1000) % 60).toString().padStart(2, "0");
    const minutes = Math.floor(timeLeft / 60000).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function renderTimer(timer: TimerState) {
    switch (timer.kind) {
      case "paused":
        return `paused timer at ${renderTime(timer.time)}`;
      case "active":
        return `started timer`;
      case "set":
        return `set timer for ${renderTime(timer.time)}`;
      case "unset":
        return `reset timer`;
    }
  }

  async function connectToRoom(
    token: string,
    username: string,
    ctx: EventCtx<S, E, H>,
    prev: keyof S,
    game?: BingoStateMachine,
  ) {
    const websocket = new WebSocket(wsurl, [ `token.${token}`, `bingo` ]);
    ctx.next("connecting", { username, websocket, game, prev });
    websocket.binaryType = "arraybuffer";

    const opened = { value: false };

    websocket.onopen = async () => {
      opened.value = true;
      await ctx.event("serverConnected");
    };
    websocket.onmessage = async ev => ev.data instanceof ArrayBuffer
      ? await ctx.event(
        "serverMessage",
        { message: BinaryReader.using(ev.data, ServerMessageSchema.decode) },
      )
      : undefined;
    websocket.onclose = async () => {
      if (!opened.value) {
        await ctx.event("error", { kind: "ws" });
      }
      await ctx.event("serverDisconnected");
    };
  }

  function runSync(syncs: Syncs, state: S["inRoom"]) {
    if (!state.isSync)
      return;

    let logSyncs: string[] | undefined;
    if (syncs.to === undefined) {
      logSyncs = state.log.entries.slice(state.log.sent);
      state.log.sent = state.log.entries.length;
    }

    const data = {
      state: state.game.state.type,
      active: syncs.active ? bingoSession(state.game)?.activeBoard : undefined,
      def: syncs.board ? bingoSession(state.game)?.boardDef : undefined,
      start: syncs.active ? bingoSession(state.game)?.start : undefined,
      teams: syncs.teams ? state.game.state.data.teams : undefined,
      users: syncs.users ? Object.values(state.users) : undefined,
      timer: syncs.timer ? state.game.state.data.timer : undefined,
      log: logSyncs,
    };

    state.websocket.send(BinaryWriter.using({
      opcode: ClientOpcode.SendSync,
      data: BinaryWriter.using(data, BingoSyncDataSchema.encode),
      to: syncs.to,
    }, ClientMessageSchema.encode));
  }

  function sendAction(action: BingoAction, state: S["inRoom"]) {
    if (state.isSync)
      return;

    state.websocket.send(BinaryWriter.using({
      opcode: ClientOpcode.SendAction,
      data: BinaryWriter.using(action, BingoActionSchema.encode),
    }, ClientMessageSchema.encode));
  }

  type ServerMessageHooks<S, C> = {
    [K in ServerOpcode]?: (state: S, message: Extract<ServerMessage, { opcode: K }>, ctx: C) => Promise<void>;
  };
  const handleServerMessage = <S, C>(
    hooks: ServerMessageHooks<S, C>,
  ) => async (s: S, { message }: E["serverMessage"], c: C) =>
    // yeah this sucks.
    hooks[message.opcode]?.(s, message as any as never, c);

  type S = {
    noLobby: undefined;
    gettingToken: { game?: BingoStateMachine };
    connecting: {
      username: string;
      websocket: WebSocket;
      game?: BingoStateMachine;
      prev: keyof S;
    };
    inServer: {
      username: string;
      websocket: WebSocket;
      game?: BingoStateMachine;
    };
    inRoom: {
      websocket: WebSocket;
      isSync: boolean;
      userId: UserId;
      roomId: string;
      users: Record<UserId, User>;
      game: BingoStateMachine;
      log: LogState;
    };
    offline: {
      game: BingoStateMachine;
    };
  };
  type E = {
    createRoom: { username: string };
    joinRoom: { username: string; room: string };
    offlineRoom: undefined;
    serverConnected: undefined;
    serverDisconnected: undefined;
    serverMessage: { message: ServerMessage };
    bingoAction: { user?: UserId; action: BingoAction };
    setBoard: { board: BoardDef };
    setTimer: { timer: TimerState };
    leaveGame: undefined;
    error: NetworkError;
    log: string;
  };
  type H = object;

  return cfg<[], S, E, H>({
    initial: () => ({ type: "noLobby", data: undefined }),
    state: {
      noLobby: {
        createRoom: async (s, { username }, ctx) => {
          ctx.next("gettingToken", { });
          let token: string;
          try {
            token = await $fetch<string>(`${fetchurl}/api/bingo/auth/create`, { method: "post" });
          } catch (e) {
            if (e instanceof FetchError) {
              await ctx.event("error", { kind: "token", inner: e });
            } else {
              await ctx.event("error", { kind: "token" });
            }
            ctx.next("noLobby");
            return;
          }
          return connectToRoom(token, username, ctx, "noLobby", undefined);
        },
        joinRoom: async (s, { username, room }, ctx) => {
          ctx.next("gettingToken", {});
          let token: string;
          try {
            token = await $fetch<string>(`${fetchurl}/api/bingo/auth/join/${room}`, { method: "post" });
          } catch (e) {
            if (e instanceof FetchError) {
              await ctx.event("error", { kind: "token", inner: e });
            } else {
              await ctx.event("error", { kind: "token" });
            }
            ctx.next("noLobby");
            return;
          }
          return connectToRoom(token, username, ctx, "noLobby", undefined);
        },
        offlineRoom: async (s, e, ctx) => {
          const game = createBingoStateMachine([
            {
              color: "#2080F0",
              name: "Blue",
            },
          ], ctx);
          ctx.next("offline", { game });
        },
      },
      connecting: {
        leaveGame: async (s, e, ctx) => {
          s.websocket.close();
          ctx.next("noLobby");
        },
        serverConnected: async (s, e, ctx) => {
          s.websocket.send(BinaryWriter.using({
            opcode: ClientOpcode.Init,
          }, ClientMessageSchema.encode));
          ctx.next("inServer", s);
        },
        serverDisconnected: async (s, e, ctx) => {
          switch (s.prev) {
            case "noLobby":
              ctx.next("noLobby");
              break;
            case "offline":
              ctx.next("offline", { game: s.game! });
          }
        },
      },
      inServer: {
        leaveGame: async (s, e, ctx) => {
          s.websocket.close();
          ctx.next("noLobby");
        },
        serverMessage: handleServerMessage({
          [ServerOpcode.Init]: async (s, { client }, ctx) => {
            const game = s.game ?? createBingoStateMachine([
              {
                color: "#2080F0",
                name: "Blue",
              },
              {
                color: "#D03050",
                name: "Red",
              },
            ], ctx);
            // game.hooks = ctx.hooks;
            ctx.next("inRoom", {
              websocket: s.websocket,
              isSync: client.sync,
              roomId: client.room,
              userId: client.id,
              users: {},
              game,
              log: { entries: [], sent: 0 },
            });
            await ctx.event("bingoAction", { action: { kind: "enter_room", name: s.username } });
          },
        }),
      },
      inRoom: {
        log: async (s, e, ctx) => {
          if (s.isSync) {
            const now = new Date(Date.now());
            const hour = now.getHours().toString().padStart(2, "0");
            const minute = now.getMinutes().toString().padStart(2, "0");
            s.log.entries.push(`${hour}:${minute} ${e}`);
          }
        },
        leaveGame: async (s, e, ctx) => {
          s.websocket.close();
          ctx.next("noLobby");
        },
        offlineRoom: async (s, e, ctx) => {
          s.websocket.close();
          ctx.next("offline", { game: s.game });
        },
        serverMessage: handleServerMessage({
          [ServerOpcode.SendAction]: async (s, { client, data }, ctx) => {
            const action = BinaryReader.using(data, BingoActionSchema.decode);
            await ctx.event("bingoAction", { user: client.id, action });
          },
          [ServerOpcode.SendSync]: async (s, { client, data }, ctx) => {
            if (client.sync) {
              const syncData = BinaryReader.using(data, BingoSyncDataSchema.decode);
              if (syncData.users) {
                const users: Record<UserId, User> = {};
                for (const user of syncData.users) {
                  users[user.id] = user;
                }
                s.users = users;
              }
              if (syncData.log) {
                s.log.entries.push(...syncData.log);
                s.log.sent = s.log.entries.length;
              }
              await s.game.event("sync", {
                data: syncData,
              });
            }
          },
          [ServerOpcode.Close]: async (s, { client }, ctx) => {
            if (s.isSync) {
              delete s.users[client.id];
            }
          },
        }),
        serverDisconnected: async (s, e, ctx) => {
          ctx.next("offline", { game: s.game });
        },
        bingoAction: async (s, { action, user: userId }, ctx) => {
          const user = userId ?? s.userId;
          const userName = s.users[user]?.name;
          switch (action.kind) {
            case "click_tile": {
              if (!s.users[user]?.teams.includes(action.team))
                break;
              if (await s.game.event("clickTile", { team: action.team, tile: action.tile })) {
                ctx.event("log", `${userName} clicked tile ${
                  renderTileName(bingoSession(s.game)!.tilePlace(action.tile))
                } for ${s.game.state.data.teams[action.team]?.name}`);
                runSync({ active: true }, s);
              }
              break;
            }
            case "clear_tile": {
              const active = s.game.tryGet("gameActive")?.session.getTile(action.tile)[1];
              const userTeams = s.users[user]?.teams;
              if (userTeams === undefined || active === undefined)
                break;

              const teamsMatch = active.claimed.every(v => userTeams.includes(v));
              if (!teamsMatch)
                break;

              if (await s.game.event("clearTile", { tile: action.tile })) {
                ctx.event("log", `${userName} cleared tile ${
                  renderTileName(bingoSession(s.game)!.tilePlace(action.tile))
                }`);
                runSync({ active: true }, s);
              }
              break;
            }
            case "enter_room": {
              s.users[user] = {
                id: user,
                name: action.name,
                teams: s.userId === user ? s.game.state.data.teams.map((_, i) => i) : [],
              };
              runSync({ board: true, teams: true, users: true, active: true, timer: true, to: user }, s);
              runSync({ users: true }, s);
              break;
            }
            case "join_team": {
              // only allow room hosts to add people to teams for now if needed.
              if (!s.isSync || user !== s.userId)
                break;
              const userData = s.users[user];
              if (!userData)
                break;
              if (action.team === 255) {
                userData.teams = [];
              } else {
                userData.teams = [ action.team ];
              }
              runSync({ users: true }, s);
              break;
            }
            case "set_team_data": {
              if (!s.users[user]?.teams.includes(action.team))
                break;
              await s.game.event("setTeamData", {
                team: action.team,
                color: action.color,
                name: action.name,
              });
              runSync({ teams: true }, s);
              break;
            }
          }
          sendAction(action, s);
        },
        setBoard: async (s, { board }, ctx) => {
          if (!s.isSync)
            return;
          if (await s.game.event("setBoard", { board })) {
            ctx.event("log", `${s.users[s.userId]?.name} set board`);
            runSync({ board: true }, s);
          }
        },
        setTimer: async (s, { timer }, ctx) => {
          if (!s.isSync)
            return;
          if (await s.game.event("setTimer", { timer })) {
            ctx.event("log", `${s.users[s.userId]?.name} ${renderTimer(timer)}`);
            runSync({ timer: true }, s);
          }
        },
      },
      offline: {
        leaveGame: async (s, e, ctx) => ctx.next("noLobby"),
        createRoom: async (s, { username }, ctx) => {
          const game = s.game;
          game.state.data.teams = [
            {
              color: "#2080F0",
              name: "Blue",
            },
            {
              color: "#D03050",
              name: "Red",
            },
          ];
          ctx.next("gettingToken", { game });
          let token: string;
          try {
            token = await $fetch<string>(`${fetchurl}/api/bingo/auth/create`, { method: "post" });
          } catch (e) {
            if (e instanceof FetchError) {
              await ctx.event("error", { kind: "token", inner: e });
            } else {
              await ctx.event("error", { kind: "token" });
            }
            ctx.next("offline", { game });
            return;
          }
          return connectToRoom(token, username, ctx, "offline", game);
        },
        bingoAction: async (s, { action }, ctx) => {
          switch (action.kind) {
            case "click_tile":
              await s.game.event("clickTile", { team: action.team, tile: action.tile });
              break;
            case "clear_tile":
              await s.game.event("clearTile", { tile: action.tile });
              break;
            case "set_team_data":
              await s.game.event("setTeamData", { team: action.team, color: action.color, name: action.name });
              break;
          }
        },
        setBoard: async (s, { board }, ctx) => {
          await s.game.event("setBoard", { board });
        },
        setTimer: async (s, { timer }, ctx) => {
          await s.game.event("setTimer", { timer });
        },
      },
    },
  });
});
export type NetworkStateMachine = ReturnType<ReturnType<typeof networkStateMachine>>;
export type NetworkError = {
  kind: "ws";
} | {
  kind: "token";
  inner?: FetchError;
};
