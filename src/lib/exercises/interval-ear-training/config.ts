import { sortIntervals } from "./helpers";

export type ConfigOptions = {
	selectedIntervals: Intervals[];
	selectedPlayModes: PlayModeVariants[];
	octaveRange: OctaveVariants;
	questionsVariant: QuestionVariants;
};

export const questionVariants = ["10", "20", "30", "Endless"] as const;
export type QuestionVariants = (typeof questionVariants)[number];

export const octaveVariants = ["4-5", "3-5", "2-5"] as const;
export type OctaveVariants = (typeof octaveVariants)[number];

export const playModeVariants = ["Ascending", "Descending", "Harmonic"] as const;
export type PlayModeVariants = (typeof playModeVariants)[number];

export type IntervalDirection = Exclude<PlayModeVariants, "Harmonic">;

export const intervals = [
	"P1",
	"m2",
	"M2",
	"m3",
	"M3",
	"P4",
	"A4",
	"P5",
	"m6",
	"M6",
	"m7",
	"M7",
	"P8"
] as const;
export type Intervals = (typeof intervals)[number];

export const intervalNames: Record<Intervals, string> = {
	P1: "Unison",
	m2: "Minor Second",
	M2: "Major Second",
	m3: "Minor Third",
	M3: "Major Third",
	P4: "Perfect Fourth",
	A4: "Tritone",
	P5: "Perfect Fifth",
	m6: "Minor Sixth",
	M6: "Major Sixth",
	m7: "Minor Seventh",
	M7: "Major Seventh",
	P8: "Octave"
};

export const quickIntervalVariants = ["Simple", "Perfect", "Maj/Min", "All"] as const;
export type IntervalSelectOptions = (typeof quickIntervalVariants)[number];

export const quickIntervalVariantValues: Record<IntervalSelectOptions, Intervals[]> = {
	Simple: ["P1", "M2", "M3", "P5", "P8"],
	Perfect: ["P1", "P4", "P5", "P8"],
	"Maj/Min": ["m2", "M2", "m3", "M3", "m6", "M6", "m7", "M7"],
	All: [...intervals]
};

export const defaultConfig: ConfigOptions = {
	selectedIntervals: [...quickIntervalVariantValues.Simple],
	selectedPlayModes: ["Ascending"],
	octaveRange: "4-5",
	questionsVariant: "10"
};

export function resolveConfig(config: ConfigOptions): boolean {
	const validIntervals =
		Array.isArray(config.selectedIntervals) &&
		config.selectedIntervals.length > 0 &&
		config.selectedIntervals.every((i) => intervals.includes(i));

	if (!validIntervals) {
		config.selectedIntervals = [...quickIntervalVariantValues.Simple];
	}

	const playModeResult =
		config.selectedPlayModes.length > 0 &&
		config.selectedPlayModes.every((p) => playModeVariants.includes(p));
	if (!playModeResult) {
		config.selectedPlayModes = ["Ascending"];
	}

	if (!questionVariants.includes(config.questionsVariant)) {
		config.questionsVariant = "10";
	}
	if (!octaveVariants.includes(config.octaveRange)) {
		config.octaveRange = "4-5";
	}

	sortIntervals(config.selectedIntervals);

	return true;
}

export type ExerciseOptions = {
	intervals: Intervals[];
	directions: IntervalDirection[];
	playModes: PlayModeVariants[];
	octaveMin: number;
	octaveMax: number;
	questionLimit: number | null; // null for endless
};

export function resolveExerciseOptions(config: ConfigOptions): ExerciseOptions {
	const dirs = config.selectedPlayModes.filter((e) => e !== "Harmonic");
	const octaveParts = config.octaveRange.split("-").map(Number).sort();

	return {
		intervals: config.selectedIntervals,
		playModes: config.selectedPlayModes,
		directions: dirs.length > 0 ? dirs : ["Ascending"],
		octaveMin: octaveParts[0],
		octaveMax: octaveParts[1],
		questionLimit: config.questionsVariant === "Endless" ? null : Number(config.questionsVariant)
	};
}

export type EarTrainingGuideEntry = {
	title: string;
	description: string;
	exerciseConfig: ConfigOptions;
};

export const earTrainingGuideEntry: EarTrainingGuideEntry[] = [
	{
		title: "Simple Intervals",
		description:
			"Start off by comparing and distinguishing between the Unison and Octave intervals!",
		exerciseConfig: {
			selectedIntervals: ["P1", "P8"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "10"
		}
	},
	{
		title: "First Perfect Intervals",
		description: "Learn about simple perfect intervals and compare the two apart when played!",
		exerciseConfig: {
			selectedIntervals: ["P4", "P5"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "10"
		}
	},
	{
		title: "Combine it Together 1",
		description:
			"Take everything that you have learned so far and see if you can distinguish between all of the intervals at once!",
		exerciseConfig: {
			selectedIntervals: ["P1", "P4", "P5", "P8"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "20"
		}
	},
	{
		title: "Second Intervals",
		description: "Learn about simple perfect intervals and compare the two apart when played!",
		exerciseConfig: {
			selectedIntervals: ["m2", "M2"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "10"
		}
	},
	{
		title: "Third Intervals",
		description: "Learn about simple perfect intervals and compare the two apart when played!",
		exerciseConfig: {
			selectedIntervals: ["m3", "M3"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "10"
		}
	},
	{
		title: "Combine it Together 2",
		description:
			"Take everything that you have learned so far and see if you can distinguish between all of the intervals at once!",
		exerciseConfig: {
			selectedIntervals: ["m2", "M2", "m3", "M3", "P4", "P5", "P8"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "20"
		}
	},
	{
		title: "Sixth Intervals",
		description: "Learn about simple perfect intervals and compare the two apart when played!",
		exerciseConfig: {
			selectedIntervals: ["m6", "M6"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "10"
		}
	},
	{
		title: "Seventh Intervals",
		description: "Learn about simple perfect intervals and compare the two apart when played!",
		exerciseConfig: {
			selectedIntervals: ["m7", "M7"],
			selectedPlayModes: ["Ascending"],
			octaveRange: "4-5",
			questionsVariant: "10"
		}
	}
];
