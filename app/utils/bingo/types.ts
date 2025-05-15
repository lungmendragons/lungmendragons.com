// export interface BingoSession {
//   id: string;
//   board: BingoBoard | null;
//   admins: BingoAdmin[];
//   players: BingoPlayer[];
//   spectators: BingoSpectator[];
// }

// export interface BingoBoard {
//   id: string;
//   tiles: BingoTileStandard[];
//   bonus: BingoTileBonus[];
// }

// export interface BingoTile {
//   id: string;
//   task: string;
//   // claim: BingoPlayer | null;
//   claim: BingoTileColor | null;
// }

// export interface BingoTileStandard extends BingoTile {
//   points: number;
// }

// export interface BingoTileBonus extends BingoTile {
//   modifier: number;
// }

// export interface BingoUser {
//   id: string;
//   nickname: string;
//   sessionId: string | null;
//   connect: () => void;
//   disconnect: () => void;
// }

// export interface BingoAdmin extends BingoUser {
//   role: BingoUserRole.ADMIN;
//   // rep: BingoPlayer | null;
//   color: BingoTileColor;
// }

// export interface BingoPlayer extends BingoUser {
//   role: BingoUserRole.PLAYER;
//   color: BingoTileColor;
//   score: number;
// }

// export interface BingoSpectator extends BingoUser {
//   role: BingoUserRole.SPECTATOR;
// }

// export enum BingoUserRole {
//   ADMIN = "admin",
//   PLAYER = "player",
//   SPECTATOR = "spectator",
// }

// export enum BingoTileColor {
//   RED = "red",
//   GREEN = "green",
//   BLUE = "blue",
//   YELLOW = "yellow",
//   PURPLE = "purple",
// }