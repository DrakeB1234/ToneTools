import type { GeneralNote } from "$lib/types/musicTheoryTypes";
import { staffNoteRangeMap } from "./helpers";

export type NoteRange = {
	low: GeneralNote;
	high: GeneralNote;
};

export type ConfigOptions = {
	staff: StaffVariants;
	noteRange: NoteRangeVariants | NoteRange;
	selectedAccidentals: AccidentalVariants[];
	timer: TimerVariants;
};

export const staffVariants = ["Grand", "Treble", "Bass"] as const;
export type StaffVariants = (typeof staffVariants)[number];

export const timerVariants = ["30", "60", "120", "240", "Endless"] as const;
export type TimerVariants = (typeof timerVariants)[number];

export const accidentalVariants = ["#", "b"] as const;
export type AccidentalVariants = (typeof accidentalVariants)[number];

export const noteRangeVariants = ["Narrow", "Medium", "Extended"] as const;
export type NoteRangeVariants = (typeof noteRangeVariants)[number];

export const defaultConfig: ConfigOptions = {
	staff: "Grand",
	noteRange: "Narrow",
	selectedAccidentals: [],
	timer: "60"
};

export function resolveConfig(config: ConfigOptions) {
	if (!staffVariants.includes(config.staff)) return false;
	if (!timerVariants.includes(config.timer)) return false;
	if (!config.selectedAccidentals.every((acc) => accidentalVariants.includes(acc))) return false;
	if (typeof config.noteRange === "string") {
		if (!noteRangeVariants.includes(config.noteRange)) return false;
	} else {
		if (!config.noteRange?.low?.letter || !config.noteRange?.high?.letter) return false;
	}

	return true;
}

export type ExerciseOptions = {
	clef: string;
	noteRange: NoteRange;
	accidentals: string[];
	timerLimit: number | null; // null represents "Endless"
};

export function resolveExerciseOptions(config: ConfigOptions): ExerciseOptions {
	let actualRange: NoteRange;

	// Means option is using
	if (typeof config.noteRange === "string") {
		actualRange = staffNoteRangeMap[config.staff][config.noteRange];
	} else {
		// Both low and high are already GeneralNote objects
		actualRange = config.noteRange;
	}

	const timerLimit = config.timer === "Endless" ? null : Number(config.timer);
	const accidentals = ["n", ...config.selectedAccidentals];

	return {
		clef: config.staff.charAt(0).toLowerCase() + config.staff.slice(1),
		noteRange: actualRange,
		accidentals,
		timerLimit
	};
}

export type Preset = {
	name: string;
	description: string;
	config: Omit<ConfigOptions, "noteRange"> & {
		noteRange: NoteRange;
	};
};

export const presets: Preset[] = [
	{
		name: "Treble Easy",
		description: "First octave of the treble staff.",
		config: {
			staff: "Treble",
			noteRange: staffNoteRangeMap["Treble"].Narrow,
			selectedAccidentals: [],
			timer: "60"
		}
	},
	{
		name: "Treble Medium",
		description: "One note below middle C, to the top line of the treble staff.",
		config: {
			staff: "Treble",
			noteRange: staffNoteRangeMap["Treble"].Medium,
			selectedAccidentals: [],
			timer: "120"
		}
	},
	{
		name: "Treble Hard",
		description: "Extended range with accidentals.",
		config: {
			staff: "Treble",
			noteRange: staffNoteRangeMap["Treble"].Extended,
			selectedAccidentals: ["#", "b"],
			timer: "120"
		}
	},
	{
		name: "Bass Easy",
		description: "First octave of the bass staff.",
		config: {
			staff: "Bass",
			noteRange: staffNoteRangeMap["Bass"].Narrow,
			selectedAccidentals: [],
			timer: "120"
		}
	},
	{
		name: "Bass Medium",
		description: "One note above middle C, to the bottom line of the bass staff.",
		config: {
			staff: "Bass",
			noteRange: staffNoteRangeMap["Bass"].Medium,
			selectedAccidentals: [],
			timer: "120"
		}
	},
	{
		name: "Bass Hard",
		description: "Extended range with accidentals.",
		config: {
			staff: "Bass",
			noteRange: staffNoteRangeMap["Bass"].Extended,
			selectedAccidentals: ["#", "b"],
			timer: "120"
		}
	},
	{
		name: "Grand Easy",
		description: "First octave from middle C on the grand staff.",
		config: {
			staff: "Grand",
			noteRange: staffNoteRangeMap["Grand"].Narrow,
			selectedAccidentals: [],
			timer: "120"
		}
	},
	{
		name: "Grand Medium",
		description: "Top of the treble line, to the middle of the bass staff.",
		config: {
			staff: "Grand",
			noteRange: staffNoteRangeMap["Grand"].Medium,
			selectedAccidentals: [],
			timer: "120"
		}
	},
	{
		name: "Grand Hard",
		description: "Six notes above the treble staff, to one space below the bass staff.",
		config: {
			staff: "Grand",
			noteRange: staffNoteRangeMap["Grand"].Extended,
			selectedAccidentals: ["#", "b"],
			timer: "120"
		}
	}
];
