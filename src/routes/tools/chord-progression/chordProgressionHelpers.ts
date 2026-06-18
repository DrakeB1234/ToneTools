import { convertMidiToNoteName, convertNoteNameToMidi, findChord, getIntervalDistanceFromNoteNames, getPitchClassFromNoteName, incrementNoteNameByInterval, simplifyNoteName } from "$lib/helpers/musicTheory";
import type { GeneralChord } from "$lib/helpers/musicTheoryTypes";

// ==== Types / Interfaces ====
export type NoteRangeConfig = {
  melody: {
    min: string;
    max: string;
  }
  bass: {
    min: string;
    max: string;
  }
}

export interface RelativeRangeConfig {
  anchorOctave: number;
  spanSemitones: number;
}

export interface RhythmTrack<T> {
  stepCount: number;
  earlyChangeSteps?: number[];
  events: T[];
}

export interface RhythmStyle {
  id: string;
  name: string;
  patternLength: number;

  relativeNoteRanges: {
    melody: RelativeRangeConfig;
    bass: RelativeRangeConfig;
  };

  melodyTrack: RhythmTrack<MelodyEvent>;
  bassTrack: RhythmTrack<BassEvent>;
}

export interface MelodyEvent {
  step: number;
  noteLength: NoteLength;
  voices: number[];
  noteShift?: ShiftType;
}


export interface BassEvent {
  step: number;
  noteLength: NoteLength;
  degree: "root" | "fifth";
  noteShift?: ShiftType;
}

type NoteLength = "staccato" | 'legato';

// If number is provided for both props, then both will be shifted in direction ( + or - direction )
export interface ShiftType {
  octave?: number;
  semitone?: number;
};

// ==== Functions ====

export function calculateDynamicRange(keyPitchClass: string, config: RelativeRangeConfig) {
  const cleanPitchClass = getPitchClassFromNoteName(keyPitchClass) || keyPitchClass;

  const minNote = `${cleanPitchClass}${config.anchorOctave}`;
  const minMidi = convertNoteNameToMidi(minNote);

  if (minMidi === null) return { min: `C${config.anchorOctave}`, max: `B${config.anchorOctave}` };

  const maxMidi = minMidi + config.spanSemitones;
  const maxNote = convertMidiToNoteName(maxMidi) || `B${config.anchorOctave}`;

  return { min: minNote, max: maxNote };
}

export function applyNoteShift(noteName: string, shift?: ShiftType): string {
  if (!shift) return noteName;

  let midiNum = convertNoteNameToMidi(noteName);
  if (!midiNum) return noteName;

  if (shift.octave) midiNum += (12 * shift.octave);
  if (shift.semitone) midiNum += shift.semitone;

  return convertMidiToNoteName(midiNum);
}

export function fitNoteToRange(noteName: string, minNote: string, maxNote: string): string {
  const minMidi = convertNoteNameToMidi(minNote) ?? 60;
  const maxMidi = convertNoteNameToMidi(maxNote) ?? 71;

  const pitchClass = getPitchClassFromNoteName(noteName);

  let bestNote = `${pitchClass}4`;
  let smallestDistance = Infinity;

  for (let oct = -1; oct <= 9; oct++) {
    const testNote = `${pitchClass}${oct}`;
    const testMidi = convertNoteNameToMidi(testNote);

    if (testMidi === null) continue;

    if (testMidi >= minMidi && testMidi <= maxMidi) {
      return testNote;
    }

    const distance = Math.min(Math.abs(testMidi - minMidi), Math.abs(testMidi - maxMidi));
    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestNote = testNote;
    }
  }

  return bestNote;
}

export function applyBassNoteRange(bassNote: string, bassLineRangeConfig: NoteRangeConfig["bass"]) {
  const fixedNote = fitNoteToRange(bassNote, bassLineRangeConfig.min, bassLineRangeConfig.max);
  return fixedNote;
}

// preserveShape is meant to ensure that if auto voicing is applied, it doesn't ruin the range of notes.
export function applyMelodyNoteRange(
  melodyNotes: string[],
  melodyLineRangeConfig: NoteRangeConfig["melody"],
  preserveShape: boolean = false
): string[] {
  if (melodyNotes.length === 0) return [];

  if (!preserveShape) {
    return melodyNotes.map(note => fitNoteToRange(note, melodyLineRangeConfig.min, melodyLineRangeConfig.max));
  } else {
    const rootNote = melodyNotes[0];
    const fixedRoot = fitNoteToRange(rootNote, melodyLineRangeConfig.min, melodyLineRangeConfig.max);

    const rootMidi = convertNoteNameToMidi(rootNote) ?? 0;
    const fixedRootMidi = convertNoteNameToMidi(fixedRoot) ?? 0;
    const semitoneShift = fixedRootMidi - rootMidi;

    return melodyNotes.map(note => applyNoteShift(note, { semitone: semitoneShift }));
  }
}

export function applyMelodyVoicing(melodyNotes: string[]): string[] {
  const voicedNotes = melodyNotes.sort((a, b) => {
    const midiA = convertNoteNameToMidi(a) ?? 0;
    const midiB = convertNoteNameToMidi(b) ?? 0;
    return midiA - midiB;
  });

  return voicedNotes;
}

export function transposeChordsByKey(chords: GeneralChord[], oldKey: string, newKey: string) {
  const transpositionInterval = getIntervalDistanceFromNoteNames(oldKey, newKey);

  return chords.map((chordObj) => {
    const oldTonic = chordObj.tonic;
    let newTonic = incrementNoteNameByInterval(oldTonic, transpositionInterval);
    newTonic = simplifyNoteName(newTonic);

    const transposedChord = findChord(newTonic, chordObj.symbol);

    return transposedChord || chordObj
  });
}

// ==== Data ====

export const styleBasic1: RhythmStyle = {
  id: "basic-1",
  name: "Basic 1",
  patternLength: 16,

  relativeNoteRanges: {
    melody: { anchorOctave: 4, spanSemitones: 11 },
    bass: { anchorOctave: 2, spanSemitones: 11 }
  },

  melodyTrack: {
    stepCount: 16,
    events: [
      { step: 0, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
      { step: 8, noteLength: "legato", voices: [0, 1, 2, 3, 4] }
    ]
  },

  bassTrack: {
    stepCount: 16,
    events: [
      { step: 0, noteLength: "legato", degree: "root" },
    ]
  }
};

export const styleBasic2: RhythmStyle = {
  id: "basic-2",
  name: "Basic 2",
  patternLength: 16,

  relativeNoteRanges: {
    melody: { anchorOctave: 4, spanSemitones: 11 },
    bass: { anchorOctave: 3, spanSemitones: 11 }
  },

  melodyTrack: {
    stepCount: 4,
    events: [
      { step: 0, noteLength: "legato", voices: [1, 2] },
      { step: 2, noteLength: "legato", voices: [0] },
    ]
  },

  bassTrack: {
    stepCount: 8,
    events: [
      { step: 0, noteLength: "legato", degree: "root" },
    ]
  }
};

export const styleBossaNova1: RhythmStyle = {
  id: "bossa-nova-1",
  name: "Bossa Nova 1",
  patternLength: 16,

  relativeNoteRanges: {
    melody: { anchorOctave: 4, spanSemitones: 11 },
    bass: { anchorOctave: 2, spanSemitones: 11 }
  },

  melodyTrack: {
    stepCount: 16,
    events: [
      { step: 0, noteLength: "staccato", voices: [0, 1, 2, 3, 4] },
      { step: 4, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
      { step: 10, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
      { step: 14, noteLength: "staccato", voices: [0, 1, 2, 3, 4] },
    ]
  },

  bassTrack: {
    stepCount: 16,
    events: [
      { step: 0, noteLength: "legato", degree: "root" },
      { step: 6, noteLength: "legato", degree: "root" },
      { step: 8, noteLength: "legato", degree: "fifth" },
      { step: 14, noteLength: "legato", degree: "root" },
    ]
  }
};

export const styleBossaNova2: RhythmStyle = {
  id: "bossa-nova-2",
  name: "Bossa Nova 2",
  patternLength: 64,

  relativeNoteRanges: {
    melody: { anchorOctave: 3, spanSemitones: 11 },
    bass: { anchorOctave: 2, spanSemitones: 11 }
  },

  melodyTrack: {
    stepCount: 32,
    earlyChangeSteps: [14],
    events: [
      { step: 0, noteLength: "staccato", voices: [0, 1, 2, 3, 4] },
      { step: 4, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
      { step: 10, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
      { step: 14, noteLength: "staccato", voices: [0, 1, 2, 3, 4] },
      { step: 18, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
      { step: 24, noteLength: "staccato", voices: [0, 1, 2, 3, 4] },
      { step: 28, noteLength: "staccato", voices: [0, 1, 2, 3, 4] },
    ]
  },

  bassTrack: {
    stepCount: 64,
    earlyChangeSteps: [14, 30, 46, 60],
    events: [
      { step: 0, noteLength: "legato", degree: "root" },
      { step: 6, noteLength: "legato", degree: "root" },
      { step: 8, noteLength: "legato", degree: "fifth" },

      { step: 14, noteLength: "legato", degree: "root" },
      { step: 22, noteLength: "legato", degree: "root" },
      { step: 24, noteLength: "legato", degree: "fifth" },

      { step: 30, noteLength: "legato", degree: "fifth", noteShift: { octave: -1 } },
      { step: 32, noteLength: "legato", degree: "root" },
      { step: 38, noteLength: "legato", degree: "root" },
      { step: 40, noteLength: "legato", degree: "fifth" },

      { step: 46, noteLength: "legato", degree: "root" },
      { step: 54, noteLength: "legato", degree: "root" },
      { step: 56, noteLength: "legato", degree: "fifth" },

      { step: 60, noteLength: "legato", degree: "root", noteShift: { semitone: -2 } },
      { step: 62, noteLength: "legato", degree: "root", noteShift: { semitone: -1 } },
    ]
  }
};

export const stylePop1: RhythmStyle = {
  id: "pop-1",
  name: "Pop 1",
  patternLength: 64,

  relativeNoteRanges: {
    melody: { anchorOctave: 4, spanSemitones: 11 },
    bass: { anchorOctave: 2, spanSemitones: 11 }
  },

  melodyTrack: {
    stepCount: 4,
    events: [
      { step: 0, noteLength: "legato", voices: [0, 1, 2, 3, 4] },
    ]
  },

  bassTrack: {
    stepCount: 32,
    earlyChangeSteps: [14],
    events: [
      { step: 0, noteLength: "legato", degree: "root" },
      { step: 0, noteLength: "legato", degree: "root", noteShift: { octave: 1 } },
      { step: 14, noteLength: "staccato", degree: "fifth" },

      { step: 16, noteLength: "staccato", degree: "root" },
      { step: 16, noteLength: "staccato", degree: "root", noteShift: { octave: 1 } },
      { step: 26, noteLength: "legato", degree: "root" },
      { step: 26, noteLength: "legato", degree: "root", noteShift: { octave: 1 } },
    ]
  }
};


export const styleLibrary: Record<string, RhythmStyle> = {
  "basic-1": styleBasic1,
  "basic-2": styleBasic2,
  "pop-1": stylePop1,
  "bossa-nova-1": styleBossaNova1,
  "bossa-nova-2": styleBossaNova2,
};