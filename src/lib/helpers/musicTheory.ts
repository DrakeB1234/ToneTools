import { Chord, Midi, Mode, Note, Scale } from "tonal";
import { modeFormulaMap, modeNumeralMap, naturalNoteNames } from "./musicTheoryConstants";
import type { GeneralChord, GeneralNote } from "./musicTheoryTypes";

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

export function getScaleNotes(noteLetter: String, scaleType: string, startingOctave: number = 4): GeneralNote[] | null {
  const rootNote = noteLetter + startingOctave.toString();
  const fullScale = `${rootNote} ${scaleType}`;
  const scaleObj = Scale.get(fullScale);

  getRelativeMajorMinorScales(noteLetter, scaleType);

  if (scaleObj.empty) return null;

  const generalNoteObjs: GeneralNote[] = scaleObj.notes.map(e => convertNoteStringToObj(e));

  return generalNoteObjs;
};

export function getRelativeMajorMinorScales(noteLetter: String, scaleType: string) {
  const modes = Scale.modeNames(`${noteLetter} ${scaleType}`);
  const minorMode = modes.find(e => e[1] === "minor");
  const majorMode = modes.find(e => e[1] === "major");
  if (!minorMode || !majorMode) return null;

  return {
    majorMode: `${majorMode[0]} ${majorMode[1]}`,
    minorMode: `${minorMode[0]} ${minorMode[1]}`
  };
}

export function getModeDiatonicTriads(noteLetter: string, scaleType: string, startingOctave: number = 4): GeneralChord[] | null {
  const triads = Mode.triads(scaleType, noteLetter);
  const scaleName = `${noteLetter + startingOctave} ${scaleType}`;
  const scaleNotes = Scale.get(scaleName).notes;

  if (triads.length < 1) return null;

  const result: GeneralChord[] = triads.map((e, index) => {
    const chordObj = Chord.get(e);
    const chordTonic = chordObj.tonic ?? "";
    const simplifiedTonic = simplifyNoteAccidental(chordTonic) ?? "";
    const chordName = simplifiedTonic + convertChordQualityIntoName(chordObj.quality);

    const chordNotes = Chord.notes(e, scaleNotes[index]);
    const noteObjs = chordNotes.map(e => convertNoteStringToObj(e));

    return {
      name: chordName,
      tonic: chordTonic,
      accidental: null,
      quality: chordObj.quality,
      notes: noteObjs,
      simplifiedTonic: simplifiedTonic
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

export function getEnharmonicNote(note: string, preferFlat: boolean = false): string {
  if (preferFlat) {
    return note.includes("#") ? Note.enharmonic(note) : note;
  }
  else {
    return note.includes("b") ? Note.enharmonic(note) : note;
  }
}

export function getEnharmonicNotesFromArray(notes: string[], preferFlat: boolean = false): string[] {
  return notes.map(e => getEnharmonicNote(e, preferFlat));
}

// Converts ex: 'Bbb' => 'A'
export function simplifyNoteAccidental(note: string): string | null {
  const simplifiedNote = Note.simplify(note);

  if (simplifiedNote.length < 1) return null;
  return simplifiedNote;
}

export function noteToAbsoluteSemitone(note: GeneralNote): number | null {
  const rawValue = Midi.toMidi(note.tonalJsName);

  if (!rawValue) return null
  return rawValue - 12;
}

export function convertNoteStringToObj(note: string): GeneralNote {
  const tonalNoteObj = Note.get(note);
  const tonalNoteAccidental = tonalNoteObj.acc;
  const simplifiedFullName = simplifyNoteAccidental(tonalNoteObj.letter + tonalNoteAccidental);

  const res: GeneralNote = {
    letter: tonalNoteObj.letter,
    accidental: null,
    octave: tonalNoteObj.oct ?? null,
    simplifiedFullName: tonalNoteObj.name,
    tonalJsName: tonalNoteObj.name
  }

  if (simplifiedFullName) res.simplifiedFullName = simplifiedFullName;
  if (tonalNoteAccidental.length > 1) res.accidental = tonalNoteAccidental;

  return res;
}

export function convertNoteToMidi(note: GeneralNote) { return Note.midi(note.tonalJsName) }