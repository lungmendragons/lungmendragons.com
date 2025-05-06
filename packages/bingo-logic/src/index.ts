// Data for how the board is generated. Effectively a function that creates a BoardDef.
export interface BoardGenerator {
  board: BoardDef,
}

// A definition for a bingo board.
export interface BoardDef {
  width: number,
  height: number,
  extra: number,
  // should have a length of width * height + extra
  // this is row major, with extra tiles occuring at the end.
  tiles: TileDef[],
}

export interface TileDef {
  text: string,
  points: number,
  stealable: boolean,
  exclusive: boolean,
}

export class GameSession {
  /** The definition for the board in the bingo game. */
  boardDef: BoardDef;
  /** The board that is currently displayed in the game. */
  activeBoard: ActiveBoard;
  /**
   * A map of a user id to the corresponding user.
   */
  users: Map<UserId, User> = new Map();
  /**
   * An array of teams in the game.
   * 
   * Teams are the participants in a bingo game.
   */
  teams: Team[] = [];
  /** The timestamp when the game was started. */
  start: number | undefined;

  constructor(def: BoardDef) {
    this.boardDef = def;
    this.activeBoard = {
      tiles: this.boardDef.tiles.map((def, id) => ({
        claimed: [],
        id,
      })),
    };
  }

  isGameStarted(): boolean {
    return this.start !== undefined;
  }

  getScores(): Record<TeamId, number> {
    let out = new Array<number>(this.teams.length).fill(0);
    for (let tile = 0; tile < this.boardDef.tiles.length; tile += 1) {
      let active = this.activeBoard.tiles[tile]!;
      let def = this.boardDef.tiles[tile]!;

      for (const team of active.claimed) {
        out[team]! += def.points;
      }
    }
    return out;
  }

  clickTile(user: User, team: Team, tile: TileId): boolean {
    if(!user.permissions.teams.includes(team.id)) {
      return false;
    }
    
    let active = this.activeBoard.tiles[tile]!;
    let def = this.boardDef.tiles[tile]!;
    if (active.claimed.length === 0) {
      active.claimed.push(team.id);
    } else {
      let idx = active.claimed.indexOf(team.id);
      if (idx === -1) {
        // the current team has not claimed the tile.
        if (def.exclusive) {
          if (def.stealable) {
            active.claimed.length = 0;
            active.claimed.push(team.id);
          }
        } else {
          active.claimed.push(team.id);
        }
      } else {
        // the current team has claimed the tile, so toggling the click
        // will remove their claim.
        active.claimed.splice(idx);
      }
    }
    
    return true;
  }
}

/** A user connected to the game server room. */
export interface User {
  /** A nanoid for the user. */
  id: UserId,
  /** The name of the user. */
  name: string,
  /** A set of permissions for actions the user is able to take. */
  permissions: Permissions,
}

/** A team in the bingo game which can claim and own tiles. */
export interface Team {
  /** The hex code for the color of the team. */
  color: string,
  /** The name of the team. */
  name: string,
  /** The ID of the team. */
  id: TeamId,
  /** The users that can claim tiles on the teams behalf. */
  members: UserId[],
}

export interface ActiveBoard {
  tiles: ActiveTile[],
}

/** A single tile on the active bingo board. */
export interface ActiveTile {
  /** The teams that have claimed the tile. */
  claimed: TeamId[],
  // will also contain any information needed to do more complicated logic.
}

/** An id for a team. */
type TeamId = number;

/** An id for a tile on the bingo board. */
type TileId = number;

/** A nanoid describing a user. */
type UserId = string;

/** A set of permissions a user has. */
export interface Permissions {
  /** A teams that this user can claim tiles on behalf of. */
  teams: TeamId[],
  /** A permission that allows a user to edit the permissions for another user. */
  editPermissions: boolean,
}