export interface RunData {
  score: number;
  endings: Array<string>;
  time: string;
  video: string;
}

export interface RowData {
  key: string;
  player: string;
  run1: RunData;
  run2: RunData;
  total: number;
}

export interface RowDataSorted extends RowData {
  rank: number;
}

export interface RegData {
  key: string;
  player: string;
  endings: Array<string>;
  checked: boolean;
  valid: boolean;
}
