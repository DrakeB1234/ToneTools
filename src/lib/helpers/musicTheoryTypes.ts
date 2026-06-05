export type GeneralNote = {
  letter: string;
  accidental: string | null;
  octave: number | null;
  simplifiedFullName: string;
  tonalJsName: string;
}

//
// name refers to the full chord name, ex: Cmaj7 > C Major Seventh
// simplifiedTonic refers to simplified accidental, ex: Bbb > A
// tonicOctave referes to the octave of the tonic of the chord.
// 
export type GeneralChord = {
  name: string;
  symbol: string;
  tonic: string;
  simplifiedTonic: string;
  tonicOctave: number | null;
  quality: string | null;
  notes: GeneralNote[];
}

export type GeneralChordInversion = {
  name: string;
  notes: GeneralNote[];
}

export enum ChordInversionNames {
  "Root" = 0,
  "1st" = 1,
  "2nd" = 2,
  "3rd" = 3,
  "4th" = 4,
  "5th" = 5,
};

export type SimpleChordEntry = {
  name: string;
  symbol: string;
}

export type IntervalEntry = {
  name: string;
  interval: string;
}