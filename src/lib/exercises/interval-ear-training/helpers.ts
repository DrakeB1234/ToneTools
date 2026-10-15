import {
	convertNoteNameToObj,
	decrementNoteNameByInterval,
	getFullNoteNameFromObj,
	incrementNoteNameByInterval
} from "$lib/helpers/musicTheory";
import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
import type { GeneralNote } from "$lib/types/musicTheoryTypes";
import { type IntervalDirection, type Intervals, type PlayModeVariants, intervals } from "./config";
import type { IntervalQuestion } from "./ExerciseController.svelte";

export function sortIntervals(toSort: Intervals[]) {
	toSort.sort((a, b) => {
		const indexA = intervals.indexOf(a);
		const indexB = intervals.indexOf(b);

		return indexA - indexB;
	});
}

// Injectable so tests can pass a seeded / scripted random source.
type Rng = () => number;

function pickRandom<T>(items: readonly T[], rng: Rng): T {
	if (items.length === 0) throw new Error("Cannot pick a random item from an empty list");
	return items[Math.floor(rng() * items.length)];
}

export function getIntervalNote(
	rootNote: GeneralNote,
	interval: string,
	direction: IntervalDirection
): GeneralNote {
	const rootName = getFullNoteNameFromObj(rootNote);
	const intervalName =
		direction === "Descending"
			? decrementNoteNameByInterval(rootName, interval)
			: incrementNoteNameByInterval(rootName, interval);

	return convertNoteNameToObj(intervalName);
}

export function generateQuestion(
	intervals: Intervals[],
	availablePlayModes: PlayModeVariants[],
	availableIntervalDirections: IntervalDirection[],
	lowOctaveRange: number,
	highOctaveRange: number,
	rng: Rng = Math.random
): IntervalQuestion {
	const targetInterval = pickRandom(intervals, rng);
	const letter = pickRandom(naturalNoteNames, rng);
	const octave = lowOctaveRange + Math.floor(rng() * (highOctaveRange - lowOctaveRange + 1));
	const playMode = pickRandom(availablePlayModes, rng);
	const direction = pickRandom(availableIntervalDirections, rng);

	const rootNote = convertNoteNameToObj(`${letter}${octave}`);

	return {
		rootNote,
		intervalNote: getIntervalNote(rootNote, targetInterval, direction),
		targetInterval,
		playMode,
		direction
	};
}
