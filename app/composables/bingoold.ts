// import { nanoid } from "nanoid";

// export function useBingo() {
//   const bingo = useState<BingoSession | undefined>("bingoSession", () => undefined);

//   const _auth = useAuth();
//   type User = NonNullable<typeof _auth.user.value>;

//   async function getBingoSession(id: string): Promise<BingoSession | undefined> {
//     const session = await $fetch(`/api/pages/bingo/${id}`, { method: "GET" });
//     if (!session) {
//       return undefined;
//     } else {
//       bingo.value = session as BingoSession;
//       return bingo.value;
//     }
//   };

//   async function updateBingoSession(): Promise<BingoSession | undefined> {
//     if (!bingo.value) return undefined;
//     const session = await $fetch(`/api/pages/bingo/${bingo.value.id}`, { method: "GET" });
//     if (!session) {
//       return undefined;
//     } else {
//       await $fetch(`/api/pages/bingo/${bingo.value.id}`, { method: "PUT", body: bingo.value });
//       return bingo.value;
//     }
//   }

//   async function createBingoSession(user: User): Promise<BingoSession> {
//     // if (!user) return "User not found";

//     const nano = nanoid(12);

//     const admin: BingoAdmin = {
//       id: user.id,
//       nickname: user.name,
//       role: BingoUserRole.ADMIN,
//       // rep: null,
//       color: BingoTileColor.RED,
//       sessionId: nano,
//       connect: async (): Promise<BingoSession | null> => {
//         if (bingo.value) {
//           bingo.value.admins.push(admin);
//           await updateBingoSession();
//           return bingo.value;
//         }
//         return null;
//       },
//       disconnect: async (): Promise<void> => {
//         if (bingo.value && admin.sessionId) {
//           const index = bingo.value.admins.findIndex((a) => a.id === user.id);
//           if (index !== -1) bingo.value.admins.splice(index, 1);
//           await updateBingoSession();
//         }
//       },
//     };

//     const b: BingoSession = {
//       id: nano,
//       board: null,
//       admins: [],
//       players: [],
//       spectators: [],
//     };

//     bingo.value = b;
//     await $fetch(`/api/pages/bingo/${nano}`, { method: "PUT", body: b });
//     admin.connect();

//     return bingo.value;
//   }

//   async function createBingoPlayer(u: User, c: BingoTileColor): Promise<BingoPlayer | null> {
//     if (!bingo.value) return null;
//     const player: BingoPlayer = {
//       id: u.id,
//       nickname: u.name,
//       role: BingoUserRole.PLAYER,
//       score: 0,
//       color: c,
//       sessionId: bingo.value.id,
//       connect: async (): Promise<BingoSession | null> => {
//         if (bingo.value) {
//           bingo.value.players.push(player);
//           await updateBingoSession();
//           return bingo.value;
//         }
//         return null;
//       },
//       disconnect: async (): Promise<void> => {
//         if (bingo.value && player.sessionId) {
//           const index = bingo.value.players.findIndex((a) => a.id === player.id);
//           if (index !== -1) bingo.value.players.splice(index, 1);
//           await updateBingoSession();
//         }
//       },
//     };
//     bingo.value.players.push(player);
//     await updateBingoSession();
//     return player;
//   };

//   async function createBingoSpectator(u: User): Promise<BingoSpectator | null> {
//     if (!bingo.value) return null;
//     const spectator: BingoSpectator = {
//       id: u.id,
//       nickname: u.name,
//       role: BingoUserRole.SPECTATOR,
//       sessionId: bingo.value.id,
//       connect: () => {
//         if (bingo.value) bingo.value.spectators.push(spectator);
//       },
//       disconnect: () => {
//         if (bingo.value) {
//           const index = bingo.value.spectators.findIndex((spectator) => spectator.id === u.id);
//           if (index !== -1) bingo.value.spectators.splice(index, 1);
//         }
//       },
//     };
//     bingo.value.spectators.push(spectator);
//     await updateBingoSession();
//     return spectator;
//   };
  
//   async function createBingoBoard(): Promise<BingoBoard | null> {
//     if (!bingo.value) return null;
//     const tiles: BingoTileStandard[] = [];
//     const bonus: BingoTileBonus[] = [];
//     for (let i = 0; i < 25; i++) {
//       const n = nanoid(6);
//       tiles.push({
//         id: n,
//         task: n,
//         points: Math.ceil(Math.random() * 5),
//         claim: null,
//         // modifier: null,
//       });
//     }
//     for (let i = 0; i < 3; i++) {
//       const n = nanoid(6);
//       bonus.push({
//         id: n,
//         task: n,
//         // points: Math.floor(Math.random() * 5),
//         claim: null,
//         modifier: 1.2,
//       });
//     }
//     const board: BingoBoard = {
//       id: nanoid(6),
//       tiles,
//       bonus,
//     };
//     bingo.value.board = board;
//     await updateBingoSession();
//     return board;
//   };

//   // async function claimBingoTile(i: number, admin: BingoAdmin): Promise<void> {
//   async function claimBingoTileStandard(i: number, color: BingoTileColor): Promise<void> {
//     if (!bingo.value || !bingo.value.board /* || !admin.rep */) return;
//     const tile = bingo.value.board.tiles[i];
//     await claimTile(tile, color);
//   }

//   async function claimBingoTileBonus(i: number, color: BingoTileColor): Promise<void> {
//     if (!bingo.value || !bingo.value.board /* || !admin.rep */) return;
//     const tile = bingo.value.board.bonus[i];
//     await claimTile(tile, color);
//   }

//   async function claimTile(tile: BingoTileStandard | BingoTileBonus | undefined, color: BingoTileColor): Promise<void> {
//     if (tile && !tile.claim) {
//       // tile.claim = admin.rep;
//       tile.claim = color;
//       await updateBingoSession();
//     } else if (tile && tile.claim) {
//       tile.claim = null;
//       await updateBingoSession();
//     }
//   }

//   async function updatePlayerScores(): Promise<void> {
//     if (!bingo.value || !bingo.value.board) return;
//     for (const player of bingo.value.players) {
//       const tiles = bingo.value.board.tiles.filter((tile) => tile.claim === player.color); // .color is temporary
//       const baseScore = tiles.reduce((acc, tile) => {
//         if (tile.points) return acc + tile.points;
//         return acc;
//       }, 0);
//       const bonus = bingo.value.board.bonus.filter((tile) => tile.claim === player.color); // .color is temporary
//       const totalScore = bonus.reduce((acc, tile) => {
//         if (tile.modifier) return acc * tile.modifier;
//         return acc;
//       }, baseScore);
//       player.score = totalScore;
//     }
//   }

//   // delete when backend ready
//   async function getScoreTemporary(c: BingoTileColor): Promise<number> {
//     if (!bingo.value || !bingo.value.board) return 0;
//     const tiles = bingo.value.board.tiles.filter((tile) => tile.claim === c);
//     const baseScore = tiles.reduce((acc, tile) => {
//       if (tile.points) return acc + tile.points;
//       return acc;
//     }, 0);
//     const bonus = bingo.value.board.bonus.filter((tile) => tile.claim === c);
//     const totalScore = bonus.reduce((acc, tile) => {
//       if (tile.modifier) return acc * tile.modifier;
//       return acc;
//     }, baseScore);
//     return totalScore;
//   }

//   async function assignPlayerToAdmin(admin: BingoAdmin, player: BingoPlayer): Promise<void> {
//     if (!bingo.value) return;
//     const a = bingo.value.admins.find((a) => a.id === admin.id);
//     const p = bingo.value.players.find((p) => p.id === player.id);
//     if (!a || !p) return;
//     // a.rep = p;
//     a.color = p.color;
//     await updateBingoSession();
//   }
  
//   function destroyBingoSession() {
//     bingo.value = undefined;
//     // todo
//   }
  
//   // temporary
//   function changeColor(user: User, color: BingoTileColor): void {
//     const a = bingo.value?.admins.find((a) => a.id === user.id);
//     if (!a) return;
//     a.color = color;
//   }

//   return {
//     getBingoSession,
//     updateBingoSession,
//     createBingoSession,
//     createBingoPlayer,
//     createBingoSpectator,
//     createBingoBoard,
//     claimBingoTileStandard,
//     claimBingoTileBonus,
//     updatePlayerScores,
//     getScoreTemporary,
//     assignPlayerToAdmin,
//     destroyBingoSession,

//     // temporary
//     changeColor,
//   }
// }

