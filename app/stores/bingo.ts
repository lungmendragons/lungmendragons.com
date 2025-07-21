import { useTimeout } from "@vueuse/core";
import { type NetworkError, type NetworkStateMachine, networkStateMachine } from "bingo-client";
import type { TeamId, TileId, BoardDef } from "bingo-logic";

const wsurl = import.meta.dev ? "ws://localhost:2930" : "wss://bingosync-server.lungmendragons.com";

export const useBingo = defineStore("bingosync-state", () => {
  const net: Ref<NetworkStateMachine> = shallowRef(networkStateMachine(wsurl, "")());

  let rejoinStarted = false;
  let rejoinBackoff = 0;
  let rejoinCount = 0;

  const heartbeatTimeout = useTimeout(60000, { controls: true, callback: async () => {
    net.value.event("sendKeepalive");
    heartbeatTimeout.start();
  } });

  const rejoinTimeout = useTimeout(1000, { controls: true, immediate: false, callback: async () => {
    rejoinCount += 1;
    if (rejoinCount > rejoinBackoff) {
      rejoinBackoff += 1;
      rejoinCount = 0;
      console.log(`attempting rejoin with ${rejoinBackoff}s `);
      await net.value.event("startRejoin");
    }
    if (rejoinBackoff > 8) {
      rejoinBackoff = 0;
      rejoinCount = 0;
      rejoinStarted = false;
      await net.value.event("leaveGame");
    } else {
      rejoinTimeout.start();
    }
  } });

  net.value.hooks.afterEvent = (triggered, s, e) => {
    if (triggered) {
      triggerRef(net);
    }
  };
  net.value.hooks.serverMessage = (message) => {
    heartbeatTimeout.start();
    console.log("server message", message);
  };
  net.value.hooks.clientMessage = (message) => {
    heartbeatTimeout.start();
    console.log("client message: ", message);
  };
  net.value.hooks.needsRejoin = () => {
    console.log("needs rejoin");
    if (!rejoinStarted) {
      rejoinStarted = true;
      rejoinCount = 0;
      rejoinBackoff = 0;
      rejoinTimeout.start();
    }
  };
  net.value.hooks.rejoinSuccess = () => {
    console.log("rejoin success");
    rejoinStarted = false;
    rejoinCount = 0;
    rejoinBackoff = 0;
    rejoinTimeout.stop();
  };

  type S = NetworkStateMachine["Infer"]["state"];

  const gameState = () => net.value.tryGet("connecting", "inRoom", "gettingToken", "offline", "rejoining")?.game;

  const inRoom = () => net.value.tryGet("inRoom");
  const roomOwner = computed(() => inRoom()?.isSync ?? true);
  // const gameActive = () => net.value.tryGet("inRoom", "offline");
  const board = () => gameState()?.tryGet("gameActive")?.session;
  const teams = () => gameState()?.state.data.teams;
  const localUserTeams = () => {
    const ir = inRoom();
    if (ir) {
      return ir.users[ir.userId]?.teams;
    } else {
      return gameState()?.state.data.teams.map((_v, i) => i);
    }
  };
  const timer = () => gameState()?.state.data.timer;

  return {
    net,
    tryGet: <K extends keyof S>(...types: K[]) => net.value.tryGet(...types),
    state: computed(() => net.value.state.type),
    offlineRoom: async () => await net.value.event("offlineRoom"),
    createRoom: async (
      username: string,
      err?: (e: NetworkError) => void,
    ) => await net.value.event(
      "createRoom",
      { username },
      err
        ? {
            afterEvent: (p, s, e) => e.type === "error" ? err?.(e.data) : undefined,
          }
        : undefined,
    ),
    joinRoom: async (
      username: string,
      room: string,
      err?: (e: NetworkError) => void,
    ) => await net.value.event(
      "joinRoom",
      { username, room },
      err
        ? {
            afterEvent: (p, s, e) => e.type === "error" ? err(e.data) : undefined,
          }
        : undefined,
    ),
    setTeamColor: async (team: TeamId, color: string) => await net.value.event("bingoAction", {
      action: {
        kind: "set_team_data",
        team,
        name: undefined,
        color,
      },
    }),
    setTeamName: async (team: TeamId, name: string) => await net.value.event("bingoAction", {
      action: {
        kind: "set_team_data",
        team,
        name,
        color: undefined,
      },
    }),
    clickTile: async (team: TeamId, tile: TileId) => await net.value.event("bingoAction", {
      action: {
        kind: "click_tile",
        team,
        tile,
      },
    }),
    clearTile: async (tile: TileId) => await net.value.event("bingoAction", {
      action: {
        kind: "clear_tile",
        tile,
      },
    }),
    joinTeam: async (team: TeamId) => await net.value.event("bingoAction", {
      action: {
        kind: "join_team",
        team,
      },
    }),
    setBoard: async (board: BoardDef) => await net.value.event("setBoard", { board }),
    setTimer: async (time: number) => await net.value.event("setTimer", {
      timer: { kind: "set", time },
    }),
    resetTimer: async () => await net.value.event("setTimer", { timer: { kind: "unset" } }),
    toggleTimer: async () => {
      const st = timer();
      if (!st)
        return;
      if (st.kind === "paused" || st.kind === "set") {
        const target = Date.now() + st.time;
        await net.value.event("setTimer", { timer: { kind: "active", target } });
      } else if (st.kind === "active") {
        const time = Math.max(st.target - Date.now(), 0);
        await net.value.event("setTimer", { timer: { kind: "paused", time } });
      }
    },
    timer,
    leaveGame: async () => await net.value.event("leaveGame"),
    board,
    teams,
    localUserTeams,
    inRoom,
    roomOwner,
    log: () => inRoom()?.log.entries,
    gameSession: () => gameState()?.tryGet("gameActive"),
    gameStateDisplay: gameState,
    // gameActive,
    netState: computed(() => net.value.state.type),
    gameState: computed(() => {
      return net.value.tryGet("inRoom", "offline", "gettingToken", "connecting", "rejoining")?.game?.state.type;
    }),
  };
});
