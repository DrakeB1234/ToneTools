export type GeneralNote = {
  letter: string;
  accidental: string | null;
  octave: number | null;
}

export interface GeneralChord {
  name: string;
  symbol: string;
  tonic: string;
  bass: string;
  notes: GeneralNote[];
}

export type IntervalEntry = {
  name: string;
  interval: string;
}

export interface DiatonicChordSet {
  degree: string;
  chords: Pick<GeneralChord, "tonic" | "symbol">[];
}