import { Chord, Midi, Mode, Note, Scale } from "tonal";
import { modeFormulaMap, modeNumeralMap, naturalNoteNames } from "./musicTheoryConstants";

function isNoteNameValid(note: string): boolean {
  const noteObj = Note.get(note);

  return false;
}

function convertChordQualityIntoName(quality: string): string {
  switch (quality) {
    case "Major":
      return "maj"
    case "Minor":
      return "min"
    case "Diminished":
      return "dim"
    default:
      return "maj"
  };
}

export function getNumeralsFromMode(scaleType: string): string[] | null {
  try {
    const romanNumerals = modeNumeralMap[scaleType];

    return romanNumerals;
  }
  catch {
    return null;
  }
};

export function getFormulaFromMode(scaleType: string): string[] | null {
  try {
    const formula = modeFormulaMap[scaleType];

    return formula;
  }
  catch {
    return null;
  }
};

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
  numeral: string;
  quality: string;
};
export function getModeDiatonicTriads(root: string, scaleType: string): getModeDiatonicTriadsReturn[] | null {
  const triads = Mode.triads(scaleType, root);
  const romanNumerals = getNumeralsFromMode(scaleType);

  if (triads.length < 1 || !romanNumerals) return null;

  const result: getModeDiatonicTriadsReturn[] = triads.map((e, index) => {
    const chordObj = Chord.get(e);
    const chordName = simplifyNoteAccidental(chordObj.tonic ?? "") + convertChordQualityIntoName(chordObj.quality);
    const simplifiedNotes = chordObj.notes.map(e => {
      return simplifyNoteAccidental(e) ?? "";
    });

    return {
      chordName: chordName,
      notes: simplifiedNotes,
      numeral: romanNumerals[index],
      quality: chordObj.quality,
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

// Converts ex: 'Bbb' => 'A'
export function simplifyNoteAccidental(note: string): string | null {
  const simplifiedNote = Note.simplify(note);

  if (simplifiedNote.length < 1) return null;
  return simplifiedNote;
}

export function getChordNotes(chordName: string, tonic: string): string[] {
  return Chord.notes(chordName, tonic);
}

export function noteToAbsoluteSemitone(note: string): number | null {
  const rawValue = Midi.toMidi(note);

  if (!rawValue) return null
  return rawValue - 12;
}