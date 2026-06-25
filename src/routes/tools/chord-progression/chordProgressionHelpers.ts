import { convertMidiToNoteName, convertNoteNameToMidi, getChord, getIntervalDistanceFromNoteNames, getPitchClassFromNoteName, incrementNoteNameByInterval, simplifyNoteName } from "$lib/helpers/musicTheory";
import type { GeneralChord } from "$lib/helpers/musicTheoryTypes";

// ==== Types / Interfaces ====
type NoteLength = "staccato" | 'legato';
export type SwingRatio = "1:1" | "3:2" | "2:1" | "3:1";
export type SwingRatioNoteValue = "8th" | "16th";

export interface ProgressionStep {
  chordInfo: GeneralChord | null;
  beats: number;
}

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
  baseMin: string;
  baseMax: string;
}

export interface MusicStyle {
  id: string;
  name: string;
  startingBPM: number;
  swingRatio?: SwingRatio;
  swingRatioNoteValue?: SwingRatioNoteValue;
  relativeNoteRanges: {
    melody: RelativeRangeConfig;
    bass: RelativeRangeConfig;
  };

  melodyTrack: MelodyTrack;
  bassTrack: RhythmTrack<BassEvent>;
}

export interface RhythmTrack<T> {
  stepCount: number;
  earlyChangeSteps?: number[];
  events: T[];
}

export interface MelodyTrack extends RhythmTrack<MelodyEvent> {
  toneCount: number;
}

export interface MelodyEvent {
  step: number;
  noteLength: NoteLength;
  tones: MelodyToneSelection;
  noteShift?: ShiftType;
}

export type MelodyToneSelection = number[] | "block";

export interface BassEvent {
  step: number;
  noteLength: NoteLength;
  tones: BassTone[];
}

interface BassTone {
  tone: "root" | "fifth";
  noteShift?: ShiftType;
  notFirstInChord?: boolean;
}

// Reusable Bass Step Objs
const stepBassRoot: BassTone[] = [{ tone: "root" }];
const stepBassFifth: BassTone[] = [{ tone: "fifth" }];
const stepBassDoubledRoot: BassTone[] = [{ tone: "root" }, { tone: "root", noteShift: { octave: 1 } }];

// If number is provided for both props, then both will be shifted in direction ( + or - direction )
export interface ShiftType {
  octave?: number;
  semitone?: number;
};

// Built to handle dropping of tones for extended chords if it surpasses the available tones on a track.
export function resolveMelodyTones(
  tones: MelodyToneSelection,
  chordToneCount: number,
): number[] {
  if (tones === "block") {
    return Array.from({ length: chordToneCount }, (_, i) => i);
  }

  return tones;
}

// Handles dropping dones from extended chords
export function applySmartOmission(rawNotes: string[], maxTonesAllowed: number): string[] {
  if (rawNotes.length <= maxTonesAllowed) return rawNotes;

  const dropPriority = [0, 2, 5, 4];

  const dropCount = rawNotes.length - maxTonesAllowed;
  const toDrop = new Set(dropPriority.filter(i => i < rawNotes.length).slice(0, dropCount));

  return rawNotes.filter((_, i) => !toDrop.has(i));
}

// ==== Functions ====

export function calculateDynamicRange(globalKeyPitchClass: string, config: RelativeRangeConfig): { min: string, max: string } {
  const cleanPitchClass = getPitchClassFromNoteName(globalKeyPitchClass) || globalKeyPitchClass;

  // 1. Calculate the shortest MIDI distance from C to the new Key
  const rootMidiC = convertNoteNameToMidi("C4") || 60;
  const targetKeyMidi = convertNoteNameToMidi(`${cleanPitchClass}4`) || 60;

  let semitoneShift = targetKeyMidi - rootMidiC;

  // Normalize the shift to a -5 to +6 range. 
  // This prevents the boxes from flying off the keyboard (e.g. shifting up 11 semitones for B)
  if (semitoneShift > 6) semitoneShift -= 12;
  if (semitoneShift < -5) semitoneShift += 12;

  // 2. Apply the shift to the style's base configuration
  const minMidi = (convertNoteNameToMidi(config.baseMin) || 60) + semitoneShift;
  const maxMidi = (convertNoteNameToMidi(config.baseMax) || 71) + semitoneShift;

  return {
    min: convertMidiToNoteName(minMidi) || config.baseMin,
    max: convertMidiToNoteName(maxMidi) || config.baseMax
  };
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
// Anchor note ensures that if a step has only one voice, that the fitNoteToRange method ensure it doesn't get squeezed
// into the chord range.
export function applyMelodyNoteRange(
  melodyNotes: string[],
  melodyLineRangeConfig: NoteRangeConfig["melody"],
  preserveShape: boolean = false,
  anchorNote?: string
): string[] {
  if (melodyNotes.length === 0) return [];

  if (!preserveShape) {
    return melodyNotes.map(note => fitNoteToRange(note, melodyLineRangeConfig.min, melodyLineRangeConfig.max));
  } else {
    const rootNote = anchorNote ?? melodyNotes[0];
    const fixedRoot = fitNoteToRange(rootNote, melodyLineRangeConfig.min, melodyLineRangeConfig.max);

    const rootMidi = convertNoteNameToMidi(rootNote) ?? 0;
    const fixedRootMidi = convertNoteNameToMidi(fixedRoot) ?? 0;
    const semitoneShift = fixedRootMidi - rootMidi;

    return melodyNotes.map(note => applyNoteShift(note, { semitone: semitoneShift }));
  }
}

export function applyVoicingToMelody(melodyNotes: string[]): string[] {
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

    const transposedChord = getChord(newTonic, chordObj.symbol);

    return transposedChord || chordObj
  });
}

// ==== Music Style Data ====

export const styleBasic1: MusicStyle = {
  id: "basic-1",
  name: "Basic 1",
  startingBPM: 100,

  relativeNoteRanges: {
    melody: { baseMin: "G3", baseMax: "F4" },
    bass: { baseMin: "C2", baseMax: "B2" }
  },

  melodyTrack: {
    stepCount: 8,
    toneCount: 4,

    events: [
      { step: 0, noteLength: "legato", tones: "block" },
      { step: 4, noteLength: "legato", tones: "block" }
    ]
  },

  bassTrack: {
    stepCount: 8,
    events: [
      { step: 0, noteLength: "legato", tones: stepBassRoot },
    ]
  }
};

export const styleMelodic1: MusicStyle = {
  id: "melodic-1",
  name: "Melodic 1",
  startingBPM: 100,

  relativeNoteRanges: {
    melody: { baseMin: "C3", baseMax: "B3" },
    bass: { baseMin: "C2", baseMax: "B2" }
  },

  melodyTrack: {
    stepCount: 32,
    toneCount: 4,

    events: [
      { step: 2, noteLength: "legato", tones: [0] },
      { step: 4, noteLength: "legato", tones: [1] },
      { step: 6, noteLength: "legato", tones: [2] },
      { step: 8, noteLength: "legato", tones: [3] },
      { step: 10, noteLength: "legato", tones: [2] },
      { step: 12, noteLength: "legato", tones: [1] },
      { step: 14, noteLength: "legato", tones: [0] },

      { step: 18, noteLength: "legato", tones: [0] },
      { step: 20, noteLength: "legato", tones: [1] },
      { step: 22, noteLength: "legato", tones: [2] },
      { step: 24, noteLength: "legato", tones: [3] },
      { step: 26, noteLength: "legato", tones: [1] },
      { step: 28, noteLength: "legato", tones: [2] },
      { step: 30, noteLength: "legato", tones: [0] },
    ]
  },

  bassTrack: {
    stepCount: 16,
    events: [
      { step: 0, noteLength: "legato", tones: stepBassRoot },
    ]
  }
};

export const styleMelodic2: MusicStyle = {
  id: "melodic-2",
  name: "Melodic 2",
  startingBPM: 100,

  relativeNoteRanges: {
    melody: { baseMin: "C3", baseMax: "B3" },
    bass: { baseMin: "C2", baseMax: "B2" }
  },

  melodyTrack: {
    stepCount: 32,
    toneCount: 4,
    events: [
      { step: 0, noteLength: "legato", tones: [0] },
      { step: 4, noteLength: "legato", tones: [1] },
      { step: 8, noteLength: "legato", tones: [2] },
      { step: 12, noteLength: "legato", tones: [3] },

      { step: 16, noteLength: "legato", tones: "block" },
      { step: 24, noteLength: "staccato", tones: [2], noteShift: { octave: 1 } },
      { step: 28, noteLength: "legato", tones: [1] },
    ]
  },

  bassTrack: {
    stepCount: 32,
    events: [
      { step: 0, noteLength: "legato", tones: stepBassRoot },
      { step: 28, noteLength: "legato", tones: stepBassFifth },
    ]
  }
};

export const styleBossaNova: MusicStyle = {
  id: "bossa-nova",
  name: "Bossa Nova",
  startingBPM: 120,

  relativeNoteRanges: {
    melody: { baseMin: "G3", baseMax: "F4" },
    bass: { baseMin: "C2", baseMax: "B2" }
  },

  melodyTrack: {
    stepCount: 32,
    earlyChangeSteps: [14],
    toneCount: 4,

    events: [
      { step: 0, noteLength: "staccato", tones: "block" },
      { step: 4, noteLength: "legato", tones: "block" },
      { step: 10, noteLength: "legato", tones: "block" },
      { step: 14, noteLength: "staccato", tones: "block" },

      { step: 18, noteLength: "legato", tones: "block" },
      { step: 24, noteLength: "staccato", tones: "block" },
      { step: 28, noteLength: "staccato", tones: "block" },
    ]
  },

  bassTrack: {
    stepCount: 64,
    earlyChangeSteps: [14, 30, 46, 60],
    events: [
      { step: 0, noteLength: "legato", tones: stepBassRoot },
      { step: 6, noteLength: "legato", tones: stepBassRoot },
      { step: 8, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },

      { step: 14, noteLength: "legato", tones: stepBassRoot },
      { step: 22, noteLength: "legato", tones: stepBassRoot },
      { step: 24, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },

      { step: 30, noteLength: "legato", tones: [{ tone: "fifth", noteShift: { octave: -1 } }] },
      { step: 32, noteLength: "legato", tones: stepBassRoot },
      { step: 38, noteLength: "legato", tones: stepBassRoot },
      { step: 40, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },

      { step: 46, noteLength: "legato", tones: stepBassRoot },
      { step: 54, noteLength: "legato", tones: stepBassRoot },
      { step: 56, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },
      { step: 60, noteLength: "legato", tones: [{ tone: "root", noteShift: { semitone: -2 } }] },
      { step: 62, noteLength: "legato", tones: [{ tone: "root", noteShift: { semitone: -1 } }] },
    ]
  }
};

export const stylePop1: MusicStyle = {
  id: "pop-1",
  name: "Pop 1",
  startingBPM: 120,
  swingRatio: "2:1",
  swingRatioNoteValue: "8th",

  relativeNoteRanges: {
    melody: { baseMin: "G3", baseMax: "F4" },
    bass: { baseMin: "C1", baseMax: "B1" }
  },

  melodyTrack: {
    stepCount: 4,
    toneCount: 4,

    events: [
      { step: 0, noteLength: "legato", tones: "block" },
    ]
  },

  bassTrack: {
    stepCount: 32,
    earlyChangeSteps: [14],
    events: [
      { step: 0, noteLength: "staccato", tones: stepBassDoubledRoot },
      { step: 14, noteLength: "staccato", tones: stepBassFifth },
      { step: 16, noteLength: "staccato", tones: stepBassDoubledRoot },
      { step: 26, noteLength: "legato", tones: stepBassDoubledRoot },

    ]
  }
};

export const stylePop2: MusicStyle = {
  id: "pop-2",
  name: "Pop 2",
  startingBPM: 128,
  swingRatio: "2:1",
  swingRatioNoteValue: "8th",

  relativeNoteRanges: {
    melody: { baseMin: "G3", baseMax: "F4" },
    bass: { baseMin: "C1", baseMax: "B1" }
  },

  melodyTrack: {
    stepCount: 16,
    toneCount: 4,
    events: [
      { step: 0, noteLength: "legato", tones: "block" },
      { step: 8, noteLength: "legato", tones: "block" },
      { step: 14, noteLength: "staccato", tones: [3] },
    ]
  },

  bassTrack: {
    stepCount: 16,
    earlyChangeSteps: [14],
    events: [
      { step: 0, noteLength: "staccato", tones: stepBassDoubledRoot },
      { step: 8, noteLength: "staccato", tones: stepBassDoubledRoot },
      { step: 14, noteLength: "staccato", tones: [{ tone: "fifth", notFirstInChord: true }] },
    ]
  }
};

export const styleCascadingArpeggio: MusicStyle = {
  id: "cascading-arpeggio",
  name: "Cascading Arpeggio",
  startingBPM: 90,

  relativeNoteRanges: {
    melody: { baseMin: "C5", baseMax: "B5" },
    bass: { baseMin: "C2", baseMax: "B2" }
  },

  melodyTrack: {
    stepCount: 8,
    toneCount: 4,
    events: [
      { step: 0, noteLength: "legato", tones: [3], noteShift: { octave: 1 } },
      { step: 1, noteLength: "legato", tones: [2], noteShift: { octave: 1 } },
      { step: 2, noteLength: "legato", tones: [1], noteShift: { octave: 1 } },
      { step: 3, noteLength: "legato", tones: [0], noteShift: { octave: 1 } },

      { step: 4, noteLength: "legato", tones: [3] },
      { step: 5, noteLength: "legato", tones: [2] },
      { step: 6, noteLength: "legato", tones: [1] },
      { step: 7, noteLength: "legato", tones: [0] },
    ]
  },

  bassTrack: {
    stepCount: 16,
    events: [
      { step: 0, noteLength: "legato", tones: [{ tone: "root" }] },
      { step: 2, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },
      { step: 4, noteLength: "legato", tones: [{ tone: "root", noteShift: { octave: 1 }, }] },
      { step: 6, noteLength: "legato", tones: [{ tone: "fifth", noteShift: { octave: 1 }, notFirstInChord: true }] },
      { step: 8, noteLength: "legato", tones: [{ tone: "root", noteShift: { octave: 2 } }] },
      { step: 10, noteLength: "legato", tones: [{ tone: "fifth", noteShift: { octave: 1 }, notFirstInChord: true }] },
      { step: 12, noteLength: "legato", tones: [{ tone: "root", noteShift: { octave: 1 } }] },
      { step: 14, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },
    ]
  }
};

export const styleReggae: MusicStyle = {
  id: "reggae-dub",
  name: "Reggae Dub",
  startingBPM: 75,
  swingRatio: "3:2",
  swingRatioNoteValue: "16th",

  relativeNoteRanges: {
    melody: { baseMin: "G4", baseMax: "F5" },
    bass: { baseMin: "C1", baseMax: "B1" }
  },

  melodyTrack: {
    stepCount: 16,
    toneCount: 4,
    events: [
      { step: 4, noteLength: "staccato", tones: "block" },
      { step: 12, noteLength: "staccato", tones: "block" },
    ]
  },

  bassTrack: {
    stepCount: 16,
    events: [
      { step: 2, noteLength: "staccato", tones: [{ tone: "root", notFirstInChord: true }] },
      { step: 3, noteLength: "staccato", tones: [{ tone: "root", notFirstInChord: true }] },
      { step: 4, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },
      { step: 8, noteLength: "staccato", tones: [{ tone: "root", notFirstInChord: true }] },
      { step: 10, noteLength: "staccato", tones: [{ tone: "root", noteShift: { octave: 1 }, notFirstInChord: true }] },
      { step: 12, noteLength: "legato", tones: [{ tone: "fifth", notFirstInChord: true }] },
      { step: 14, noteLength: "staccato", tones: [{ tone: "root", notFirstInChord: true }] },
    ]
  }
};

export const styleLibrary: Record<string, MusicStyle> = {
  "basic-1": styleBasic1,
  "melodic-1": styleMelodic1,
  "melodic-2": styleMelodic2,
  "pop-1": stylePop1,
  "pop-2": stylePop2,
  "bossa-nova": styleBossaNova,
  "cascading-arpeggio": styleCascadingArpeggio,
  "reggae-dub": styleReggae
};