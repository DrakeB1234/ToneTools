import type { IconType } from "$lib/components/Icons/Icon.svelte";
import DAW from "$lib/components/Icons/DAW.svelte";
import Metronome from "$lib/components/Icons/Metronome.svelte";
import Polyrhythm from "$lib/components/Icons/Polyrhythm.svelte";
import TrebleClef from "$lib/components/Icons/TrebleClef.svelte";

interface DataEntry {
	name: string;
	description: string;
	href: string;
	urlName: string;
	color: string;
	icon: IconType;
}

export interface IntervalsExerciseEntry {
	title: string;
	description: string;
	href: string;
	color: "purple" | "violet" | "blue" | "green";
	icon: IconType;
}

export const exercisesData: DataEntry[] = [
	{
		name: "Interval Ear Training",
		description:
			"In this exercise, you will hear two notes in played sequence. Your goal is to identify the interval between the played two notes. Be sure to check your stats to see where to improve!",
		href: "/exercises/interval-ear-training",
		urlName: "interval-ear-training",
		color: "green",
		icon: "book"
	},
	{
		name: "Sight Reading",
		description:
			"In this exercise, you will see a note on the staff. Press the corresponding button or key on your instrument to identify it. Great to learn the names of notes on the staff!",
		href: "/exercises/sight-reading",
		urlName: "sight-reading",
		color: "green",
		icon: "queueMusic"
	}
	// {
	//   name: "Scales Companion",
	//   description: "Companion for your daily practicing of scales, featuring midi detection, built-in metronome, and more!",
	//   href: "/exercises/scales-companion",
	//   urlName: "scales-companion",
	//   color: "purple",
	//   icon: Scale
	// },
];

export const toolsData: DataEntry[] = [
	{
		name: "Metronome",
		description: "Easy to use and simple metronome to use for many musical applications!",
		href: "/tools/metronome",
		urlName: "metronome",
		color: "purple",
		icon: Metronome
	},
	{
		name: "Polyrhythms",
		description:
			"In depth and deeply customizable polyrhythm creator with many options and customization available!",
		href: "/tools/polyrhythms",
		urlName: "polyrhythms",
		color: "purple",
		icon: Polyrhythm
	},
	{
		name: "Identify Chord",
		description:
			"Lookup a chord that you know the notes to on a piano roll, then view the details on it!",
		href: "/tools/identify-chord",
		urlName: "identify-chord",
		color: "purple",
		icon: "search"
	},
	{
		name: "Chords Library",
		description:
			"Search any chord and play them in app, or lookup how to play it on your instrument.",
		href: "/tools/chords-library",
		urlName: "chords-library",
		color: "purple",
		icon: "dictionary"
	},
	{
		name: "Scales Library",
		description:
			"Choose from many scales to view useful information, such as a piano roll diagram, diatnoic chords, and more.",
		href: "/tools/scales-library",
		urlName: "scales-library",
		color: "purple",
		icon: "stacks"
	},
	{
		name: "Chord Progression",
		description:
			"Experiment with chords and choose between various styles to hear your progression in!",
		href: "/tools/chord-progression",
		urlName: "chord-progression",
		color: "purple",
		icon: DAW
	}
];
