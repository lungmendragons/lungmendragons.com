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

  mainTile(idx: number): TileId {
    return idx;
  }

  extraTile(idx: number): TileId {
    return this.boardDef.width * this.boardDef.height + idx;
  }

  getTile(id: TileId): [TileDef, ActiveTile] {
    return [this.boardDef.tiles[id]!, this.activeBoard.tiles[id]!];
  }

  getScores(): Record<TeamId, number> {
    let out: Record<TeamId, number> = {};
    for (let tile = 0; tile < this.boardDef.tiles.length; tile += 1) {
      let active = this.activeBoard.tiles[tile]!;
      let def = this.boardDef.tiles[tile]!;

      for (const team of active.claimed) {
        out[team] = (out[team] ?? 0) + def.points;
      }
    }
    return out;
  }

  clickTile(team: TeamId, tile: TileId) {
    let active = this.activeBoard.tiles[tile]!;
    let def = this.boardDef.tiles[tile]!;
    if (active.claimed.length === 0) {
      active.claimed.push(team);
    } else {
      let idx = active.claimed.indexOf(team);
      if (idx === -1) {
        // the current team has not claimed the tile.
        if (def.exclusive) {
          if (def.stealable) {
            active.claimed.length = 0;
            active.claimed.push(team);
          }
        } else {
          active.claimed.push(team);
        }
      } else {
        // the current team has claimed the tile, so toggling the click
        // will remove their claim.
        active.claimed.splice(idx);
      }
    }
  }
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

/** An id for a tile on the bingo board. */
export type TileId = number;

export type TeamId = number;
