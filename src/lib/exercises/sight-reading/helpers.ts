// helpers.ts

import type { NoteRange, NoteRangeVariants, StaffVariants } from "./config";

export const staffNoteRangeMap: Record<StaffVariants, Record<NoteRangeVariants, NoteRange>> = {
	Treble: {
		Narrow: {
			low: { letter: "C", octave: 4, accidental: null },
			high: { letter: "C", octave: 5, accidental: null }
		},
		Medium: {
			low: { letter: "B", octave: 3, accidental: null },
			high: { letter: "F", octave: 5, accidental: null }
		},
		Extended: {
			low: { letter: "G", octave: 3, accidental: null },
			high: { letter: "C", octave: 6, accidental: null }
		}
	},
	Bass: {
		Narrow: {
			low: { letter: "C", octave: 3, accidental: null },
			high: { letter: "C", octave: 4, accidental: null }
		},
		Medium: {
			low: { letter: "G", octave: 2, accidental: null },
			high: { letter: "D", octave: 4, accidental: null }
		},
		Extended: {
			low: { letter: "C", octave: 2, accidental: null },
			high: { letter: "E", octave: 4, accidental: null }
		}
	},
	Grand: {
		Narrow: {
			low: { letter: "C", octave: 4, accidental: null },
			high: { letter: "C", octave: 5, accidental: null }
		},
		Medium: {
			low: { letter: "C", octave: 3, accidental: null },
			high: { letter: "G", octave: 5, accidental: null }
		},
		Extended: {
			low: { letter: "C", octave: 2, accidental: null },
			high: { letter: "C", octave: 6, accidental: null }
		}
	}
};
