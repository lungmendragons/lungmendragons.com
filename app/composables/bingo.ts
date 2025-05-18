import {
  GameSession,
  type ActiveBoard,
  type BoardDef,
  type TeamId,
  type TileId,
} from "bingo-logic";
import {
  ServerOpcode,
  ClientOpcode,
  ClientMessageSchema,
  ServerMessageSchema,
  type ServerMessage,
} from "bingo-server/protocol";
import {
  BinaryReader,
  BinaryWriter,
  s,
} from "binary-schema";

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
  active: s.option(ActiveBoardSchema),
  def: s.option(BoardDefSchema),
  users: s.option(s.array(UserSchema)),
  teams: s.option(s.array(TeamSchema)),
  start: s.option(s.f64),
});

export function useBingo() {
  const url = import.meta.dev ? "ws://localhost:2930" : "wss://bingo.lungmendragons.com";

  const session = useState<GameSession | undefined>("bingoSession", () => undefined);
  const users = useState<Record<UserId, User>>("bingoUsers", () => ({}));
  const teams = useState<Team[]>("bingoTeams", () => []);

  interface Syncs {
    active?: boolean;
    board?: boolean;
    users?: boolean;
    teams?: boolean;
    to?: string;
  };

  const websocket = useState<WebSocket | undefined>("bingoWebsocket", () => shallowRef());
  const roomId = useState<string | undefined>("bingoRoomId", () => undefined);
  const isSync = useState<boolean | undefined>("bingoIsSync", () => undefined);
  const user = useState<UserId | undefined>("bingoUser", () => undefined);

  let thisName: string | undefined;

  type ServerMessageHooks = {
    [K in ServerOpcode]: (message: Extract<ServerMessage, { opcode: K }>) => Promise<void>;
  };

  type BingoActionHooks = {
    [K in BingoAction["kind"]]: (
      user: UserId,
      data: Omit<Extract<BingoAction, { kind: K }>, "kind">,
    ) => Promise<Syncs | undefined>;
  };

  const runSync = (syncs: Syncs) => {
    if (!isSync.value)
      return;
    const data = {
      active: syncs.active ? session.value?.activeBoard : undefined,
      def: syncs.board ? session.value?.boardDef : undefined,
      start: syncs.active ? session.value?.start : undefined,
      teams: syncs.teams ? teams.value : undefined,
      users: syncs.users ? Object.values(users.value) : undefined,
    };

    console.log(`sending syncs: ${JSON.stringify(data)}`);

    websocket.value?.send(BinaryWriter.using({
      opcode: ClientOpcode.SendSync,
      data: BinaryWriter.using(data, BingoSyncDataSchema.encode),
      to: syncs.to,
    }, ClientMessageSchema.encode));
  };

  const bingoActionHooks: BingoActionHooks = {
    click_tile: async (id, { tile, team }) => {
      if (!session.value)
        return;
      const user = users.value[id];
      if (!user)
        return;

      // if (user.teams.includes(team)) {
      session.value.clickTile(team, tile);
      return { active: true };
      // }
    },
    enter_room: async (id, { name }) => {
      users.value[id] = {
        id,
        name,
        teams: [],
      };
      runSync({ board: true, teams: true, users: true, active: true, to: id });
      return { users: true };
    },
    join_team: async (id, { team }) => {
      const user = users.value[id];
      if (!user)
        return;
      user.teams.push(team);
      return { users: true };
    },
    set_team_data: async (id, { team, name, color }) => {
      const teamData = teams.value[team];
      if (!teamData)
        return;
      if (!users.value[id]?.teams.includes(team))
        return;

      if (name !== undefined) {
        teamData.name = name;
      }
      if (color !== undefined) {
        teamData.color = color;
      }
      return { teams: true };
    },
  };

  const executeAction = async <K extends BingoAction["kind"]>(
    action: K,
    id: UserId,
    data: Omit<Extract<BingoAction, { kind: K }>, "kind">,
    forceNoSync: boolean = false,
  ) => {
    console.log(`action ${action}: ${JSON.stringify(data)}`);
    const syncs = await bingoActionHooks[action](id, data);
    if (isSync.value) {
      if (!forceNoSync) {
        runSync(syncs ?? {});
      }
    } else {
      const actionData = {
        kind: action,
        ...data,
      };
      websocket.value?.send(BinaryWriter.using({
        opcode: ClientOpcode.SendAction,
        data: BinaryWriter.using(actionData as any, BingoActionSchema.encode),
      }, ClientMessageSchema.encode));
    }
  };

  const serverMessageHooks: ServerMessageHooks = {
    [ServerOpcode.Init]: async ({ client }) => {
      isSync.value = client.sync;
      user.value = client.id;
      roomId.value = client.room;
      executeAction("enter_room", client.id, { name: thisName ?? client.id });
    },
    [ServerOpcode.SendAction]: async ({ client, data }) => {
      if (!isSync.value)
        return;
      const action = BinaryReader.using(data, BingoActionSchema.decode);
      executeAction(action.kind, client.id, action);
    },
    [ServerOpcode.SendSync]: async ({ client, data }) => {
      if (!client.sync)
        return;
      const syncData = BinaryReader.using(data, BingoSyncDataSchema.decode);

      console.log(`receiving syncs: ${JSON.stringify(syncData)}`);

      if (session.value) {
        if (syncData.active) {
          session.value.activeBoard = syncData.active;
          console.log(`active synced`);
          triggerRef(session);
        }
        if (syncData.def) {
          session.value.boardDef = syncData.def;
        }
        if (syncData.start) {
          session.value.start = syncData.start;
        }
      } else {
        if (syncData.def) {
          session.value = new GameSession(syncData.def);
          if (syncData.active) {
            session.value.activeBoard = syncData.active;
          }
          if (syncData.start) {
            session.value.start = syncData.start;
          }
        }
      }
      if (syncData.users) {
        users.value = {};
        for (const user of syncData.users) {
          users.value[user.id] = user;
        }
      }
      if (syncData.teams) {
        teams.value = syncData.teams;
      }
    },
    [ServerOpcode.Close]: async ({ client }) => {
      if (!isSync.value)
        return;
      delete users.value[client.id];
      runSync({ users: true });
    },
  };

  const executeServerMessageHook = async <K extends ServerOpcode>(
    opcode: K,
    data: Extract<ServerMessage, { opcode: K }>,
  ) => {
    await serverMessageHooks[opcode](data as any);
  };

  async function onWsOpen(_: Event) {
    const data = BinaryWriter.using({
      opcode: ClientOpcode.Init,
    }, ClientMessageSchema.encode);
    websocket.value?.send(data);
  }

  async function onWsMessage(ev: MessageEvent) {
    if (!(ev.data instanceof ArrayBuffer)) {
      return;
    }
    const buffer = ev.data;
    const message = BinaryReader.using(buffer, ServerMessageSchema.decode);
    executeServerMessageHook(message.opcode, message);
  }

  async function onWsClose(_: CloseEvent) {
    session.value = undefined;
    users.value = {};
    teams.value = [];
    websocket.value = undefined;
    roomId.value = undefined;
    isSync.value = undefined;
    user.value = undefined;
  }

  const protocols = (token: string) => [ `token.${token}`, "bingo" ];

  async function createSession(def: BoardDef) {
    session.value = new GameSession(def);
  }

  async function createRoom(name: string) {
    const data = await $fetch(`/api/bingo/auth/create`, {
      method: "post",
    });

    thisName = name;
    createSession({
      width: 5,
      height: 5,
      extra: 3,
      tiles: Array.from({ length: 5 * 5 + 3 }).fill(0).map((_, i) => ({
        exclusive: true,
        stealable: false,
        points: 1,
        text: `idx ${i}`,
      })),
    });
    teams.value = [
      {
        color: "#2080F0",
        name: "Team 1",
      },
      {
        color: "#D03050",
        name: "Team 2",
      },
    ];

    const ws = new WebSocket(url, protocols(data));
    ws.binaryType = "arraybuffer";

    ws.onopen = onWsOpen;
    ws.onmessage = onWsMessage;
    ws.onclose = onWsClose;

    websocket.value = ws;
  }

  async function joinRoom(room: string, name: string) {
    const data = await $fetch(`/api/bingo/auth/join/${room}`, {
      method: "post",
    });

    thisName = name;

    const ws = new WebSocket(url, protocols(data));
    ws.binaryType = "arraybuffer";

    ws.onopen = onWsOpen;
    ws.onmessage = onWsMessage;
    ws.onclose = onWsClose;

    websocket.value = ws;
  }

  return {
    createRoom,
    joinRoom,
    roomId: computed(() => roomId.value),
    users,
    teams,
    session,
    localUserId: user,
    isSync,
    actions: {
      clickTile: (tile: TileId, team: TeamId) => {
        if (user.value)
          executeAction("click_tile", user.value, { team, tile });
      },
      joinTeam: (team: TeamId) => {
        if (user.value)
          executeAction("join_team", user.value, { team });
      },
      setTeamData: (team: TeamId, data: Partial<Team>) => {
        if (user.value)
          executeAction("set_team_data", user.value, { team, color: data.color, name: data.name });
      },
    },
    teamColorMap: computed(() => {
      return teams.value.map(
        ({ color, name }, key) => ({ label: name, hex: color, key }),
      );
    }).value,
  };
}
