export interface GuitarDBChordPosition {
  capo?: boolean;
  barres: number[];
  baseFret?: number;
  fingers: number[];
  frets: number[];
  midi: number[];
}

export interface GuitarDBChordDetail {
  key: string;
  suffix: string;
  positions: GuitarDBChordPosition[];
}

interface GuitarDBMain {
  strings: number;
  fretsOnChord: number;
  name: string;
  numberOfChords: number;
}

export type GuitarDB = {
  chords: Record<string, GuitarDBChordDetail[]>;
  keys: string[];
  main: GuitarDBMain;
  suffixes: string[];
  tunings: Record<string, string[]>;
}

export type ParsedGuitarChord = {
  barres?: number[];
  baseFret?: number;
  fingers: string;
  frets: string;
  midi?: number[];
}

export type GuitarChordObj = {
  chords: ParsedGuitarChord[];
  key: string;
  symbol: string;
}