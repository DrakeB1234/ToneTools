export type GeneralNote = {
  letter: string;
  accidental: string | null;
  octave: number | null;
  simplifiedFullName: string;
  tonalJsName: string;
}

export type GeneralChord = {
  name: string;
  symbol: string;
  tonic: string;
  simplifiedTonic: string;
  quality: string | null;
  notes: GeneralNote[];
}

type chordSymbolsCategories = "Basic" | "Seventh" | "Ninth"