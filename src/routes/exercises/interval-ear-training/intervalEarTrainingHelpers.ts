import type { IntervalEntry } from "$lib/helpers/musicTheoryTypes";

export type IntervalEarConfig = {
  selectedIntervals: IntervalEntry[];
  selectedTypes: ("melodic" | "harmonic")[],
  selectedDirections: ("ascending" | "descending")[],
  octaveRangeLow: number,
  octaveRangeHigh: number,
  questionsAmount: number,
}

export type EarTrainingGuideEntry = {
  title: string;
  description: string;
  exerciseConfig: IntervalEarConfig;
}

export const defaultConfig: IntervalEarConfig = {
  selectedIntervals: [
    { interval: "m2", name: "Minor Second" },
    { interval: "M2", name: "Major Second" },
    { interval: "m3", name: "Minor Third" },
    { interval: "M3", name: "Major Third" },
    { interval: "P4", name: "Perfect Fourth" },
    { interval: "P5", name: "Perfect Fifth" },
  ],
  selectedTypes: ["melodic"],
  selectedDirections: ["ascending"],
  octaveRangeLow: 4,
  octaveRangeHigh: 5,
  questionsAmount: 20,
}

export function validateIntvervalEarTrainingConfig(config: IntervalEarConfig): boolean {
  config.selectedTypes.some(e => {
    if (e !== "melodic" && e !== "harmonic") {
      return false;
    }
  });

  config.selectedDirections.some(e => {
    if (e !== "descending" && e !== "ascending") {
      return false;
    }
  });

  if (config.octaveRangeLow < 2) return false;
  if (config.octaveRangeHigh > 6) return false;

  if (config.questionsAmount < 1) return false;

  return true;
}

export const earTrainingGuideEntry: EarTrainingGuideEntry[] = [
  {
    title: "Simple Intervals",
    description: "Start off by comparing and distinguishing between the Unison and Octave intervals!",
    exerciseConfig: {
      selectedIntervals: [
        { interval: "P1", name: "Unison" },
        { interval: "P8", name: "Octave" },
      ],
      selectedTypes: ["melodic"],
      selectedDirections: ["ascending"],
      octaveRangeHigh: 5,
      octaveRangeLow: 4,
      questionsAmount: 10
    }
  },
  {
    title: "First Perfect Intervals",
    description: "Learn about simple perfect intervals and compare the two apart when played!",
    exerciseConfig: {
      selectedIntervals: [
        { interval: "P4", name: "Perfect Fourth" },
        { interval: "P5", name: "Perfect Fifth" },
      ],
      selectedTypes: ["melodic"],
      selectedDirections: ["ascending"],
      octaveRangeHigh: 5,
      octaveRangeLow: 4,
      questionsAmount: 10
    }
  },
  {
    title: "Combine it Together 1",
    description: "Take everything that you have learned so far and see if you can distinguish between all of the intervals at once!",
    exerciseConfig: {
      selectedIntervals: [
        { interval: "P4", name: "Perfect Fourth" },
        { interval: "P5", name: "Perfect Fifth" },
        { interval: "P8", name: "Octave" },
      ],
      selectedTypes: ["melodic"],
      selectedDirections: ["ascending"],
      octaveRangeHigh: 5,
      octaveRangeLow: 3,
      questionsAmount: 25
    }
  },
  {
    title: "Second Intervals",
    description: "Learn about simple perfect intervals and compare the two apart when played!",
    exerciseConfig: {
      selectedIntervals: [
        { interval: "m2", name: "Minor Second" },
        { interval: "M2", name: "Major Second" },
      ],
      selectedTypes: ["melodic"],
      selectedDirections: ["ascending"],
      octaveRangeHigh: 5,
      octaveRangeLow: 4,
      questionsAmount: 10
    }
  },
  {
    title: "Third Intervals",
    description: "Learn about simple perfect intervals and compare the two apart when played!",
    exerciseConfig: {
      selectedIntervals: [
        { interval: "m3", name: "Minor Third" },
        { interval: "M3", name: "Major Third" },
      ],
      selectedTypes: ["melodic"],
      selectedDirections: ["ascending"],
      octaveRangeHigh: 5,
      octaveRangeLow: 4,
      questionsAmount: 10
    }
  },
  {
    title: "Combine it Together 2",
    description: "Take everything that you have learned so far and see if you can distinguish between all of the intervals at once!",
    exerciseConfig: {
      selectedIntervals: [
        { interval: "m2", name: "Minor Second" },
        { interval: "M2", name: "Major Second" },
        { interval: "m3", name: "Minor Third" },
        { interval: "M3", name: "Major Third" },
        { interval: "P4", name: "Perfect Fourth" },
        { interval: "P5", name: "Perfect Fifth" },
        { interval: "P8", name: "Octave" },
      ],
      selectedTypes: ["melodic"],
      selectedDirections: ["ascending"],
      octaveRangeHigh: 5,
      octaveRangeLow: 3,
      questionsAmount: 25
    }
  },
]