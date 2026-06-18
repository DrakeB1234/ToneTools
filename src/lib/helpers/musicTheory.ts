import { Chord, Interval, Midi, Mode, Note, Scale } from "tonal";
import { chordCategoryEntries, chordInversionNames, intervalObjs, modeFormulaMap, modeNumeralMap, naturalNoteNames } from "./musicTheoryConstants";
import { type DiatonicChordSet, type GeneralChord, type GeneralNote } from "./musicTheoryTypes";

// Intervals

export function getIntervalName(interval: string): string {
  const intervalObj = intervalObjs.find(e => e.interval === interval);

  return intervalObj?.name ?? "";
}

export function incrementNoteNameByInterval(note: string, interval: string) {
  const newNote = Note.transpose(note, interval);

  return newNote;
}

export function decrementNoteNameByInterval(note: string, interval: string) {
  // Convert app interval string (m2) to tonals (2m) for proper parsing
  const normalizedInterval = Interval.get(interval).name;
  const newNote = Note.transpose(note, `-${normalizedInterval}`);

  return newNote;
}

export function getIntervalDistanceFromNoteNames(noteNameA: string, noteNameB: string) {
  return Interval.distance(noteNameA, noteNameB);
}

// Notes

export function noteToAbsoluteSemitone(noteName: string): number | null {
  const rawValue = Midi.toMidi(noteName);

  if (!rawValue) return null
  return rawValue - 12;
}

export function convertNoteNameToObj(noteName: string): GeneralNote {
  const tonalNoteObj = Note.get(noteName);

  return {
    letter: tonalNoteObj.letter,
    accidental: tonalNoteObj.acc,
    octave: tonalNoteObj.oct ?? null,
  }
}

export function convertNoteNameToMidi(noteName: string): number | null { return Note.midi(noteName) ?? null }

export function convertMidiToNoteName(midiNum: number): string { return Midi.midiToNoteName(midiNum); }

export function convertNoteNameToChroma(note: string): number | null {
  const chroma = Note.chroma(note);
  return !Number.isNaN(chroma) ? chroma : null;
}

export function getFullNoteNameFromObj(note: GeneralNote) {
  return `${note.letter}${note.accidental}${note.octave ?? ""}`;
}

export function simplifyNoteNames(noteNames: string[]) {
  return noteNames.map(e => {
    return Note.simplify(e)
  });
}

export function simplifyNoteName(noteName: string) { return Note.simplify(noteName) };

export function getPitchClassFromNoteName(noteName: string) {
  return Note.pitchClass(noteName);
}

export function getLetterFromNoteName(noteName: string) {
  return noteName.at(0);
}

export function getAccidentalFromNoteName(noteName: string) {
  const accidental = Note.get(noteName).acc;
  return accidental !== "" ? accidental : "n";
}

// Chords

export function getPreferredChordSymbol(chordSymbol: string) {
  if (chordSymbol.includes("M")) return "maj";

  return chordSymbol;
}

export function detectChordsByNoteNames(notes: string[]) {
  const chordTokens = Chord.detect(notes);

  if (chordTokens) {
    const chordObjs = chordTokens.map(e => Chord.get(e));
    return chordObjs.map(e => {
      const symbolWithoutTonic = getChordSymbolWithoutTonic(e.symbol, e.tonic ?? "");
      const fixedChordSymbol = getPreferredChordSymbol(symbolWithoutTonic);

      return {
        tonic: e.tonic,
        symbol: fixedChordSymbol,
        notes: e.notes
      }
    });
  }
  else return null;
}

export function getAllCategoryChords(category: string) {
  return chordCategoryEntries[category];
}

export function findChord(note: string, chordSymbol: string, bassNote?: string, startingOctave: number = 4) {
  const fixedChordSymbol = chordSymbol + (bassNote ? `/${bassNote}` : "");
  const chordObj = Chord.get(note + fixedChordSymbol);

  if (chordObj.empty) return null;

  const chordNotes = Chord.notes(chordObj.symbol, note + startingOctave);
  const notes: GeneralNote[] = chordNotes.map(e => {
    return convertNoteNameToObj(e);
  });

  const resChordSymbol = getPreferredChordSymbol(fixedChordSymbol);

  return {
    name: chordObj.name,
    symbol: resChordSymbol,
    tonic: note,
    bass: chordObj.bass,
    notes: notes,

  } as GeneralChord;
}

// findChord function may return null, if there is any null chord, return null to caller
export function getChordInversions(note: string, chordSymbol: string, startingOctave: number = 4) {
  const chordObj = Chord.get(note + chordSymbol);

  const chordInversions = chordObj.notes.map(e => {
    return findChord(note, chordSymbol, e, startingOctave);
  });

  if (chordInversions.includes(null)) return null;

  return chordInversions.map((e, idx) => {
    return {
      chord: e!,
      inversionName: chordInversionNames[idx]
    }
  })

}

export function getChordSecondaryDominant(note: string) {
  const secondaryDominantRoot = incrementNoteNameByInterval(note, "5P");

  return findChord(secondaryDominantRoot, "7");
}

export function getChordIntervalFormula(note: string, chordSymbol: string) {
  const chordObj = Chord.get(note + chordSymbol);
  return chordObj.intervals;
}

export function getChordAliases(note: string, chordSymbol: string) {
  const chordObj = Chord.get(note + chordSymbol);
  const fixedAliases = chordObj.aliases.filter(e => e !== "");
  return fixedAliases;
}

export function getScalesFromChord(note: string, chordSymbol: string) {
  return Chord.chordScales(note + chordSymbol);
}

export function getSimilarChords(note: string, chordSymbol: string): Pick<GeneralChord, "tonic" | "symbol" | "name">[] {
  let similarChords = Chord.extended(note + chordSymbol).slice(0, 10);
  if (similarChords.length < 2) similarChords = Chord.reduced(note + chordSymbol).slice(0, 10);

  const chordObjs = similarChords.map(e => Chord.get(e));

  return chordObjs.map(e => {
    const fixedChordSymbol = getChordSymbolWithoutTonic(e.symbol, note);

    return {
      name: e.name,
      symbol: fixedChordSymbol,
      tonic: note,
    }
  })
}

export function getModeDiatonicTriads(note: string, scaleType: string, startingOctave: number = 4): GeneralChord[] | null {
  const triads = Mode.triads(scaleType, note);
  const scaleName = `${note + startingOctave} ${scaleType}`;
  const scaleNotes = Scale.get(scaleName).notes;

  if (triads.length < 1) return null;

  const result: GeneralChord[] = triads.map((e, index) => {
    const chordObj = Chord.get(e);

    const chordNotes = Chord.notes(e, scaleNotes[index]);
    const noteObjs = chordNotes.map(e => convertNoteNameToObj(e));

    const symbolWithoutTonic = getChordSymbolWithoutTonic(chordObj.aliases[0], chordObj.tonic ?? "");
    let fixedSymbol = symbolWithoutTonic;
    if (fixedSymbol === "M") fixedSymbol = "maj";
    if (fixedSymbol === "m") fixedSymbol = "min";

    return {
      name: chordObj.name,
      symbol: fixedSymbol,
      tonic: chordObj.tonic ?? "",
      bass: chordObj.bass,
      notes: noteObjs,
    }
  });

  return result;
}

export function getDiatonicChordsFromScale(tonic: string, scaleType: string): DiatonicChordSet[] | null {
  const scaleName = `${tonic} ${scaleType}`;
  const scaleObj = Scale.get(scaleName);

  if (scaleObj.empty) return null;

  // Fetches precise notes by their 1-based scale degree and auto-handles octave wraps
  const getNoteByDegree = Scale.degrees(scaleName);

  const result = scaleObj.notes.map((_, idx) => {
    const rootDegree = idx + 1;
    const rootNote = getNoteByDegree(rootDegree);
    const rootNoteWithoutOctave = rootNote.replace(/\d/g, '');

    const triadNotes = [
      rootNote,
      getNoteByDegree(rootDegree + 2),
      getNoteByDegree(rootDegree + 4)
    ];

    const seventhNotes = [
      ...triadNotes,
      getNoteByDegree(rootDegree + 6)
    ];

    const ninthNotes = [
      ...seventhNotes,
      getNoteByDegree(rootDegree + 8)
    ];

    const chords: Pick<GeneralChord, "tonic" | "symbol">[] = [];
    const cleanedTriadChord = formatDiatonicChord(triadNotes, rootNoteWithoutOctave);
    const cleanedSeventhChord = formatDiatonicChord(seventhNotes, rootNoteWithoutOctave);
    const cleanedNinthChord = formatDiatonicChord(ninthNotes, rootNoteWithoutOctave);
    if (cleanedTriadChord) chords.push(cleanedTriadChord);
    if (cleanedSeventhChord) chords.push(cleanedSeventhChord);
    if (cleanedNinthChord) chords.push(cleanedNinthChord);

    const degree = modeNumeralMap[scaleType][idx];

    return {
      degree: degree,
      chords: chords
    };
  });

  return result;
}

function formatDiatonicChord(notes: string[], rootNote: string): Pick<GeneralChord, "tonic" | "symbol"> | null {
  const detected = Chord.detect(notes);

  if (!detected.length) {
    return { tonic: rootNote, symbol: "" };
  }

  const bestMatch = detected.find(c => c.startsWith(rootNote));
  if (!bestMatch) return null;

  const chordObj = Chord.get(bestMatch);

  const chordTonic = chordObj.tonic ?? rootNote;
  let cleanSymbol = getChordSymbolWithoutTonic(chordObj.symbol, chordTonic);
  cleanSymbol = getPreferredChordSymbol(cleanSymbol);

  return {
    tonic: chordObj.tonic ?? rootNote,
    symbol: cleanSymbol
  };
}

function getChordSymbolWithoutTonic(chordSymbol: string, tonic: string) { return chordSymbol.replace(tonic, ""); }

// Misc Music Theory

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

  const generalNoteObjs: GeneralNote[] = scaleObj.notes.map(e => convertNoteNameToObj(e));

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