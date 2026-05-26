import { Chord, ChordType, Midi, Mode, Note, Scale } from "tonal";
import { chordCategoryEntries, modeFormulaMap, modeNumeralMap, naturalNoteNames } from "./musicTheoryConstants";
import { ChordInversionNames, type GeneralChord, type GeneralChordInversion, type GeneralNote, type SimpleChordEntry } from "./musicTheoryTypes";

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

export function getAllChords() {
  return ChordType.symbols().map((e) => Chord.get(e));
}

export function getSimpleChordsByCategory(category: string): SimpleChordEntry[] {
  return chordCategoryEntries[category];
}

export function getAllChordInversions(chordObj: GeneralChord) {
  const getDegree = Chord.degrees(chordObj.symbol, chordObj.tonic + chordObj.tonicOctave);

  const inversions: GeneralChordInversion[] = [];
  const numNotes = chordObj.notes.length;

  for (let i = 0; i < numNotes; i++) {
    const inversionName = ChordInversionNames[i];
    const inversionNotes: GeneralNote[] = [];

    for (let degree = 1; degree <= numNotes; degree++) {
      const noteString = getDegree(i + degree);

      inversionNotes.push(convertNoteStringToObj(noteString));
    }

    inversions.push({
      name: inversionName,
      notes: inversionNotes
    });
  }

  return inversions;
}

export function findChord(note: string, _chordSymbol: string, startingOctave: number = 4) {
  const chordObj = Chord.getChord(_chordSymbol, note);
  const chordNotes = Chord.notes(chordObj.symbol, note + startingOctave);

  const notes: GeneralNote[] = chordNotes.map(e => {
    return convertNoteStringToObj(e);
  });

  // This gets the tonal.js preferred symbol, I prefer the M to be alias[3], so I force that here
  let chordSymbol = chordObj.aliases[0];
  if (chordSymbol.endsWith("M")) chordSymbol = chordObj.aliases[3];

  return {
    name: chordObj.name,
    symbol: chordSymbol,
    tonic: note,
    simplifiedTonic: simplifyNoteAccidental(note),
    tonicOctave: startingOctave,
    quality: chordObj.quality,
    notes: notes,

  } as GeneralChord;
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

  if (scaleObj.empty) return null;

  const generalNoteObjs: GeneralNote[] = scaleObj.notes.map(e => convertNoteStringToObj(e));

  return generalNoteObjs;
};

export function getRelativeMajorMinorScales(noteLetter: String, scaleType: string) {
  const modes = Scale.modeNames(`${noteLetter} ${scaleType}`);
  const minorMode = modes.find(e => e[1] === "minor");
  const majorMode = modes.find(e => e[1] === "major");
  if (!minorMode || !majorMode) return null;

  const simplifiedNoteAccidentalMajor = simplifyNoteAccidental(majorMode[0]);
  const simplifiedNoteAccidentalMinor = simplifyNoteAccidental(minorMode[0]);

  return {
    majorMode: `${simplifiedNoteAccidentalMajor} ${majorMode[1]}`,
    minorMode: `${simplifiedNoteAccidentalMinor} ${minorMode[1]}`
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

    let chordSymbol = chordObj.aliases[0];
    if (chordSymbol.endsWith("M")) chordSymbol = chordObj.aliases[3];

    return {
      name: chordName,
      symbol: chordSymbol,
      tonic: chordTonic,
      simplifiedTonic: simplifiedTonic,
      tonicOctave: startingOctave,
      quality: chordObj.quality,
      notes: noteObjs,
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
    accidental: tonalNoteObj.acc,
    octave: tonalNoteObj.oct ?? null,
    simplifiedFullName: tonalNoteObj.name,
    tonalJsName: tonalNoteObj.name
  }

  if (simplifiedFullName) res.simplifiedFullName = simplifiedFullName;
  if (tonalNoteAccidental.length > 1) res.accidental = tonalNoteAccidental;

  return res;
}

export function convertNoteToMidi(note: GeneralNote) { return Note.midi(note.tonalJsName) }