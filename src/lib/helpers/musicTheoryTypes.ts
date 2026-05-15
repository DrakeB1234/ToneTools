export type GeneralNote = {
  letter: string;
  accidental: string | null;
  octave: number | null;
  simplifiedFullName: string;
  tonalJsName: string;
}

export type GeneralChord = {
  name: string | null;
  tonic: string;
  accidental: string | null;
  quality: string | null;
  notes: GeneralNote[];
  simplifiedTonic: string;
}