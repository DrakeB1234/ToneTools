type NoteType = {
  noteName: string;
  octave?: number;
  accidental?: "#" | "x" | "b" | "bb";
}

type ChordType = {
  chordName?: string;
  notes: string[];
}