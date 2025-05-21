import {
  GameSession,
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

import { cfg, stateMachine, type EventCtx } from "./bingo/state-machine";

export type BingoAction = {
  kind: "click_tile";
  tile: TileId;
  team: TeamId;
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

// TODO: probably only send relevant sync data.

interface BingoSyncData {
  state: string;
  active: ActiveBoard | undefined;
  def: BoardDef | undefined;
  users: User[] | undefined;
  teams: Team[] | undefined;
  start: number | undefined;
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
});

interface Syncs {
  active?: boolean;
  board?: boolean;
  users?: boolean;
  teams?: boolean;
  to?: string;
};

const bingoStateMachine = stateMachine(() => {
  type S = {
    boardUnset: { teams: Team[] };
    waitForStart: {
      session: GameSession;
      teams: Team[];
    };
    gameActive: {
      session: GameSession;
      teams: Team[];
    };
  };
  type E = {
    setBoard: { board: BoardDef };
    clickTile: { team: TeamId; tile: TileId };
    setTeamData: { team: TeamId; color?: string; name?: string };
    sync: { data: BingoSyncData };
  };

  async function setTeamData(s: { teams: Team[] }, e: E["setTeamData"], ctx: EventCtx<S, E>) {
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

  return cfg<S, E>({
    initial: () => ({ type: "gameActive", data: {
      session: new GameSession({
        width: 5,
        height: 5,
        extra: 3,
        tiles: Array.from({ length: 5 * 5 + 3 }).fill(0).map(
          (v, i) => ({
            exclusive: true,
            points: 1,
            stealable: false,
            text: `idk ${i}`,
          }),
        ),
      }),
      teams: [
        {
          color: "#2080F0",
          name: "Team 1",
        },
        {
          color: "#D03050",
          name: "Team 2",
        },
      ],
    } }),
    state: {
      boardUnset: {
        setBoard: async (s, { board }, ctx) => {
          ctx.next("waitForStart", { session: new GameSession(board), teams: s.teams });
        },
        setTeamData,
        sync: async (s, { data }, ctx) => {
          switch (data.state as keyof S) {
            case "boardUnset":
              if (data.teams)
                s.teams = data.teams;
              break;
            case "waitForStart":
              if (data.def) {
                const session = new GameSession(data.def);
                syncSession(session, data);
                ctx.next("waitForStart", { session, teams: data.teams ?? s.teams });
              }
              break;
            case "gameActive":
              if (data.def) {
                const session = new GameSession(data.def);
                syncSession(session, data);
                ctx.next("gameActive", { session, teams: data.teams ?? s.teams });
              }
              break;
            default:
              console.warn("invalid sync state");
              break;
          }
        },
      },
      waitForStart: {
        setTeamData,
        sync: async (s, { data }, ctx) => {
          switch (data.state as keyof S) {
            case "boardUnset":
              ctx.next("boardUnset", { teams: data.teams ?? s.teams });
              break;
            case "waitForStart":
              syncSession(s.session, data);
              if (data.teams)
                s.teams = data.teams;
              break;
            case "gameActive":
              syncSession(s.session, data);
              ctx.next("gameActive", {
                session: s.session,
                teams: data.teams ?? s.teams,
              });
              break;
            default:
              console.warn("invalid sync state");
              break;
          }
        },
      },
      gameActive: {
        setTeamData,
        clickTile: async (s, { team, tile }, ctx) => s.session.clickTile(team, tile),
        sync: async (s, { data }, ctx) => {
          switch (data.state as keyof S) {
            case "boardUnset":
              ctx.next("boardUnset", { teams: data.teams ?? s.teams });
              break;
            case "waitForStart":
              syncSession(s.session, data);
              ctx.next("waitForStart", {
                session: s.session,
                teams: data.teams ?? s.teams,
              });
              break;
            case "gameActive":
              syncSession(s.session, data);
              if (data.teams)
                s.teams = data.teams;
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
type BingoStateMachine = ReturnType<typeof bingoStateMachine>;
function bingoSession(machine: BingoStateMachine) {
  if (machine.state.type === "boardUnset")
    return undefined;
  return machine.state.data.session;
}

const networkStateMachine = stateMachine(() => {
  async function connectToRoom(token: string, username: string, ctx: EventCtx<S, E>) {
    const url = import.meta.dev ? "ws://localhost:2930" : "wss://bingo.lungmendragons.com";

    const websocket = new WebSocket(url, [ `token.${token}`, `bingo` ]);
    websocket.binaryType = "arraybuffer";

    websocket.onopen = async () => await ctx.event("serverConnected");
    websocket.onmessage = async ev => ev.data instanceof ArrayBuffer
      ? await ctx.event(
        "serverMessage",
        { message: BinaryReader.using(ev.data, ServerMessageSchema.decode) },
      )
      : undefined;
    websocket.onclose = async () => await ctx.event("serverDisconnected");
    ctx.next("connecting", { username, websocket });
  }

  function runSync(syncs: Syncs, state: S["inRoom"]) {
    if (!state.isSync)
      return;
    const data = {
      state: state.game.state.type,
      active: syncs.active ? bingoSession(state.game)?.activeBoard : undefined,
      def: syncs.board ? bingoSession(state.game)?.boardDef : undefined,
      start: syncs.active ? bingoSession(state.game)?.start : undefined,
      teams: syncs.teams ? state.game.state.data.teams : undefined,
      users: syncs.users ? Object.values(state.users) : undefined,
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
    gettingToken: { username: string };
    connecting: { username: string; websocket: WebSocket };
    inServer: { username: string; websocket: WebSocket };
    inRoom: {
      websocket: WebSocket;
      isSync: boolean;
      userId: UserId;
      roomId: string;
      users: Record<UserId, User>;
      game: BingoStateMachine;
    };
  };
  type E = {
    createRoom: { username: string };
    joinRoom: { username: string; room: string };
    serverConnected: undefined;
    serverDisconnected: undefined;
    serverMessage: { message: ServerMessage };
    bingoAction: { user?: UserId; action: BingoAction };
  };

  return cfg<S, E>({
    initial: () => ({ type: "noLobby", data: undefined }),
    state: {
      noLobby: {
        createRoom: async (s, { username }, ctx) => {
          ctx.next("gettingToken", { username });
          const token = await $fetch(`/api/bingo/auth/create`, { method: "post" });
          return connectToRoom(token, username, ctx);
        },
        joinRoom: async (s, { username, room }, ctx) => {
          ctx.next("gettingToken", { username });
          const token = await $fetch(`/api/bingo/auth/join/${room}`, { method: "post" });
          return connectToRoom(token, username, ctx);
        },
      },
      connecting: {
        serverConnected: async (s, e, ctx) => {
          s.websocket.send(BinaryWriter.using({
            opcode: ClientOpcode.Init,
          }, ClientMessageSchema.encode));
          ctx.next("inServer", s);
        },
      },
      inServer: {
        serverMessage: handleServerMessage({
          [ServerOpcode.Init]: async (s, { client }, ctx) => {
            const game = bingoStateMachine();
            game.hooks = ctx.hooks;
            ctx.next("inRoom", {
              websocket: s.websocket,
              isSync: client.sync,
              roomId: client.room,
              userId: client.id,
              users: {},
              game,
            });
            await ctx.event("bingoAction", { action: { kind: "enter_room", name: s.username } });
          },
        }),
      },
      inRoom: {
        serverMessage: handleServerMessage({
          [ServerOpcode.SendAction]: async (s, { client, data }, ctx) => {
            const action = BinaryReader.using(data, BingoActionSchema.decode);
            await ctx.event("bingoAction", { user: client.id, action });
          },
          [ServerOpcode.SendSync]: async (s, { client, data }, ctx) => {
            if (client.sync) {
              await s.game.event("sync", {
                data: BinaryReader.using(data, BingoSyncDataSchema.decode),
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
          ctx.next("noLobby");
        },
        bingoAction: async (s, { action, user: userId }, ctx) => {
          const user = userId ?? s.userId;
          switch (action.kind) {
            case "click_tile": {
              // if (!s.users[user]?.teams.includes(action.team))
              //   break;
              await s.game.event("clickTile", { team: action.team, tile: action.tile });
              runSync({ active: true }, s);
              break;
            }
            case "enter_room": {
              s.users[user] = {
                id: user,
                name: action.name,
                teams: [],
              };
              runSync({ board: true, teams: true, users: true, active: true, to: user }, s);
              runSync({ users: true }, s);
              break;
            }
            case "join_team": {
              const userData = s.users[user];
              if (!userData)
                break;
              userData.teams.push(action.team);
              runSync({ users: true }, s);
              break;
            }
            case "set_team_data": {
              // if (!s.users[user]?.teams.includes(action.team))
              //   break;
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
      },
    },
  });
});
type NetworkStateMachine = ReturnType<typeof networkStateMachine>;

export const useBingo = defineStore("bingosync-state", () => {
  const net: Ref<NetworkStateMachine> = shallowRef(networkStateMachine());

  net.value.hooks.afterEvent = () => {
    triggerRef(net);
  };

  type S = NetworkStateMachine["Infer"]["state"];

  const inRoom = () => net.value.tryGet("inRoom");
  const board = () => inRoom()?.game.tryGet("gameActive", "waitForStart")?.session;
  const teams = () => inRoom()?.game.state.data.teams;

  return {
    net,
    tryGet: <K extends keyof S>(...types: K[]) => net.value.tryGet(...types),
    createRoom: async (username: string) => await net.value.event("createRoom", { username }),
    joinRoom: async (username: string, room: string) => await net.value.event("joinRoom", { username, room }),
    setTeamColor: async (team: TeamId, color: string) => await net.value.event("bingoAction", {
      action: {
        kind: "set_team_data",
        team,
        name: undefined,
        color,
      },
    }),
    clickTile: async (team: TeamId, tile: TileId) => await net.value.event("bingoAction", {
      action: {
        kind: "click_tile",
        team,
        tile,
      },
    }),
    board,
    teams,
    teamColorMap: computed(() => teams()?.map(
      ({ color, name }, key) => ({ label: name, hex: color, key }),
    ) ?? []),
    inRoom,
  };
});
