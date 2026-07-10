import { convertNoteNameToMidi, stepNoteName } from "$lib/helpers/musicTheory";

export type StaffTypes = "grand" | "treble" | "bass";
export type NoteRange = {
  low: string,
  high: string,
}
export type StaffSpacing = {
  above: number;
  below: number;
}

export type ConfigOptions = {
  clef: StaffTypes;
  timer: number;
  noteRange: NoteRange;
  allowedAccidentals: string[];
};

export type Preset = {
  name: string;
  description: string;
  config: ConfigOptions;
}

export const defaultConfig: ConfigOptions = {
  clef: "grand",
  timer: 60,
  noteRange: { low: "C4", high: "C5" },
  allowedAccidentals: ["n"]
};

export const presets: Preset[] = [
  {
    name: "Treble Easy",
    description: "First octave of the treble staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "treble",
      noteRange: {
        low: "C4",
        high: "B4"
      },
      timer: 90
    }
  },
  {
    name: "Treble Medium",
    description: "One note below middle C, to the top line of the treble staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "treble",
      noteRange: {
        low: "B3",
        high: "F5"
      },
      timer: 90
    },
  },
  {
    name: "Treble Hard",
    description: "Three notes below middle C, to six notes above the top line of the treble staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "treble",
      noteRange: {
        low: "G3",
        high: "E6"
      },
      timer: 90
    },
  },
  {
    name: "Bass Easy",
    description: "First octave of the bass staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "bass",
      noteRange: {
        low: "D3",
        high: "C4"
      },
      timer: 90
    }
  },
  {
    name: "Bass Medium",
    description: "One note above middle C, to the bottom line of the bass staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "bass",
      noteRange: {
        low: "G2",
        high: "D4"
      },
      timer: 90
    }
  },
  {
    name: "Bass Hard",
    description: "Three notes above middle C, to five notes below the bottom line of the bass staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "bass",
      noteRange: {
        low: "B1",
        high: "F4"
      },
      timer: 90
    }
  },
  {
    name: "Grand Easy",
    description: "First octave from middle C on the grand staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "grand",
      noteRange: {
        low: "C4",
        high: "B4"
      },
      timer: 90
    }
  },
  {
    name: "Grand Medium",
    description: "Top of the treble line, to the middle of the bass staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "grand",
      noteRange: {
        low: "D3",
        high: "F5"
      },
      timer: 90
    }
  },
  {
    name: "Grand Hard",
    description: "Six notes above the treble staff, to one space below the bass staff.",
    config: {
      allowedAccidentals: ["n"],
      clef: "grand",
      noteRange: {
        low: "F2",
        high: "E6"
      },
      timer: 90
    }
  },
];

export const StaffTypeNoteRanges: Record<
  ConfigOptions["clef"],
  NoteRange
> = {
  grand: { low: "A1", high: "E6" },
  treble: { low: "F3", high: "E6" },
  bass: { low: "A1", high: "G4" },
};

export const StaffTypeSpacing: Record<
  ConfigOptions["clef"],
  StaffSpacing
> = {
  grand: { below: 4, above: 3 },
  treble: { below: 2, above: 3 },
  bass: { below: 4, above: 4 },
};

export function validateNoteRange(
  lowNote: string,
  highNote: string,
  staffTypeLowNote: string,
  staffTypeHighNote: string,
) {
  const lowRangeMidi = convertNoteNameToMidi(lowNote);
  const highRangeMidi = convertNoteNameToMidi(highNote);
  const staffTypeLowRangeMidi = convertNoteNameToMidi(staffTypeLowNote);
  const staffTypeHighRangeMidi = convertNoteNameToMidi(staffTypeHighNote);
  if (
    !lowRangeMidi ||
    !highRangeMidi ||
    !staffTypeLowRangeMidi ||
    !staffTypeHighRangeMidi
  )
    return null;

  const tempRange = { low: lowNote, high: highNote };

  if (lowRangeMidi > highRangeMidi) {
    tempRange.low = highNote;
    tempRange.high = lowNote;
  } else if (lowRangeMidi === highRangeMidi) {
    const newLowRangeNote = stepNoteName(lowNote, -1);
    tempRange.low = newLowRangeNote;
  }

  if (lowRangeMidi < staffTypeLowRangeMidi) tempRange.low = staffTypeLowNote;
  if (highRangeMidi > staffTypeHighRangeMidi) tempRange.high = staffTypeHighNote;

  return tempRange;
}