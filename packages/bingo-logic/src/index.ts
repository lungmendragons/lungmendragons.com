// Data for how the board is generated. Effectively a function that creates a BoardDef.
export interface BoardGenerator {
  board: BoardDef;
}

// A definition for a bingo board.
export interface BoardDef {
  width: number;
  height: number;
  extra: number;
  // should have a length of width * height + extra
  // this is row major, with extra tiles occuring at the end.
  tiles: TileDef[];
}

export interface TileDef {
  text: string;
  points: number;
  stealable: boolean;
  exclusive: boolean;
}

export interface Score {
  main: number;
  extra: number;
}

export interface LineCount {
  h: number;
  v: number;
  d: number;
}

export type TilePlace = {
  kind: "main";
  row: number;
  col: number;
} | {
  kind: "extra";
  idx: number;
};

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
      tiles: this.boardDef.tiles.map((_, id) => ({
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

  mainTileRowCol(row: number, col: number): TileId {
    return row * this.boardDef.width + col;
  }

  tilePlace(id: TileId): TilePlace {
    if (id < this.boardDef.width * this.boardDef.height) {
      return {
        kind: "main",
        row: Math.floor(id / this.boardDef.width),
        col: id % this.boardDef.width,
      };
    } else {
      return {
        kind: "extra",
        idx: id - (this.boardDef.width * this.boardDef.height),
      };
    }
  }

  extraTile(idx: number): TileId {
    return this.boardDef.width * this.boardDef.height + idx;
  }

  getTile(id: TileId): [TileDef, ActiveTile] {
    return [ this.boardDef.tiles[id]!, this.activeBoard.tiles[id]! ];
  }

  getScores(): Record<TeamId, Score> {
    const out: Record<TeamId, Score> = {};
    const getScore = (team: TeamId) => out[team] ??= { main: 0, extra: 0 };

    for (let tile = 0; tile < this.boardDef.width * this.boardDef.height; tile += 1) {
      const [ def, active ] = this.getTile(this.mainTile(tile));

      for (const team of active.claimed) {
        const score = getScore(team);
        score.main += def.points;
      }
    }

    for (let tile = 0; tile < this.boardDef.extra; tile += 1) {
      const [ def, active ] = this.getTile(this.extraTile(tile));

      for (const team of active.claimed) {
        const score = getScore(team);
        score.extra += def.points;
      }
    }

    return out;
  }

  // possibly some of the worst code i have written in my life.
  getLineCount(): Record<TeamId, LineCount> {
    const out: Record<TeamId, LineCount> = {};
    const getScore = (team: TeamId) => out[team] ??= { h: 0, v: 0, d: 0 };

    const checkLine = (tiles: TileId[], k: "h" | "v" | "d") => {
      const s: Record<TeamId, number> = {};
      for (const tileId of tiles) {
        const [ _def, active ] = this.getTile(tileId);
        for (const team of active.claimed) {
          s[team] ??= 0;
          s[team] += 1;
        }
      }

      for (const [ team, claimed ] of Object.entries(s)) {
        if (claimed === this.boardDef.width)
          getScore(+team)[k] += 1;
      }
    };

    // horizontal
    for (let row = 0; row < this.boardDef.height; row += 1) {
      checkLine(Array.from({ length: this.boardDef.width }, (_v, col) => this.mainTileRowCol(row, col)), "h");
    }

    // vertical
    for (let col = 0; col < this.boardDef.width; col += 1) {
      checkLine(Array.from({ length: this.boardDef.height }, (_v, row) => this.mainTileRowCol(row, col)), "v");
    }

    if (this.boardDef.height === this.boardDef.width) {
      const d = this.boardDef.width;

      checkLine(Array.from({ length: d }, (_v, n) => this.mainTileRowCol(n, n)), "d");
      checkLine(Array.from({ length: d }, (_v, n) => this.mainTileRowCol(n, d - n - 1)), "d");
    }

    return out;
  }

  clickTile(team: TeamId, tile: TileId) {
    const active = this.activeBoard.tiles[tile]!;
    const def = this.boardDef.tiles[tile]!;
    if (active.claimed.length === 0) {
      active.claimed.push(team);
    } else {
      const idx = active.claimed.indexOf(team);
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
        active.claimed.splice(idx, 1);
      }
    }
  }

  clearTile(tile: TileId) {
    const active = this.activeBoard.tiles[tile]!;
    active.claimed.length = 0;
  }
}

export interface ActiveBoard {
  tiles: ActiveTile[];
}

/** A single tile on the active bingo board. */
export interface ActiveTile {
  /** The teams that have claimed the tile. */
  claimed: TeamId[];
  // will also contain any information needed to do more complicated logic.
}

/** An id for a tile on the bingo board. */
export type TileId = number;

export type TeamId = number;
