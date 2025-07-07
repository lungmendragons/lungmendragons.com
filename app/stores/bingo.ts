import { type NetworkStateMachine, networkStateMachine } from "bingo-client";
import type { TeamId, TileId, BoardDef } from "bingo-logic";

const wsurl = import.meta.dev ? "ws://localhost:2930" : "wss://bingosync-server.lungmendragons.com";

export const useBingo = defineStore("bingosync-state", () => {
  const net: Ref<NetworkStateMachine> = shallowRef(networkStateMachine(wsurl, "")());

  net.value.hooks.afterEvent = () => {
    triggerRef(net);
  };

  type S = NetworkStateMachine["Infer"]["state"];

  const inRoom = () => net.value.tryGet("inRoom");
  const gameActive = () => net.value.tryGet("inRoom", "offline");
  const board = () => gameActive()?.game.tryGet("gameActive")?.session;
  const teams = () => gameActive()?.game.state.data.teams;
  const localUserTeams = () => {
    const ir = inRoom();
    if (ir) {
      return ir.users[ir.userId]?.teams;
    } else {
      if (net.value.tryGet("offline")) {
        return [ 0 ];
      }
      return undefined;
    }
  };
  const timer = () => gameActive()?.game.tryGet("gameActive")?.timer;

  return {
    net,
    tryGet: <K extends keyof S>(...types: K[]) => net.value.tryGet(...types),
    state: computed(() => net.value.state.type),
    offlineRoom: async () => await net.value.event("offlineRoom"),
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
    setTimerValue: async (time: number) => await net.value.event("setTimer", {
      timer: { kind: "paused", time },
    }),
    toggleTimer: async () => {
      const st = timer();
      if (!st)
        return;
      if (st.kind === "paused") {
        const target = Date.now() + st.time;
        await net.value.event("setTimer", { timer: { kind: "active", target } });
      } else {
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
    netState: computed(() => net.value.state.type),
    gameState: computed(() => net.value.tryGet("inRoom", "offline")?.game.state.type),
  };
});
