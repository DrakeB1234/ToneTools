import { Chord, Mode, Note, Scale } from "tonal";

const naturalNoteNames = ["C", "D", "E", "F", "G", "A", "B"];

function isNoteNameValid(note: string): boolean {
  const noteObj = Note.get(note);
  console.log(noteObj);

  return false;
}

export function getScaleNotes(root: String, scaleType: string, startingOctave?: number): string[] | null {
  const rootNote = root + (startingOctave ? startingOctave.toString() : "");
  const fullScale = `${rootNote} ${scaleType}`;
  const scaleObj = Scale.get(fullScale);

  if (scaleObj.empty) return null;

  return scaleObj.notes;
};

export type getModeDiatonicTriadsReturn = {
  chordName: string;
  notes: string[];
};
export function getModeDiatonicTriads(root: string, scaleType: string): getModeDiatonicTriadsReturn[] | null {
  const triads = Mode.triads(scaleType, root);

  console.log(triads)

  if (triads.length < 1) return null;

  const result: getModeDiatonicTriadsReturn[] = triads.map(e => {
    const chordObj = Chord.get(e);

    return {
      chordName: chordObj.name,
      notes: chordObj.notes
    }
  });

  return result;
}


export function getAllModes(): string[] {
  let tempValues = Mode.names();

  tempValues = tempValues.map(e => {
    if (e === "ionian") return "major";
    else if (e === "aeolian") return "minor";
    else return e;
  });

  return tempValues;
};

export function getNaturalNoteNames(): string[] {
  return naturalNoteNames;
}

export function getNoteNamesCircleOfFifths(preferFlat: boolean): string[] {
  if (preferFlat) {
    return ["C", "D", "E", "F", "G", "A", "B", "Gb", "Db", "Ab", "Eb", "Bb"];
  }
  return ["C", "D", "E", "F", "G", "A", "B", "F#", "C#", "G#", "D#", "A#"];
}

export function getEnharmonicNote(note: string): string {
  return Note.enharmonic(note);
}

export function getEnharmonicNotesFromArray(notes: string[], preferFlat: boolean): string[] {
  return notes.map(e => {
    if (preferFlat) {
      return e.includes("#") ? Note.enharmonic(e) : e;
    }
    else {
      return e.includes("b") ? Note.enharmonic(e) : e;
    }
  })
}