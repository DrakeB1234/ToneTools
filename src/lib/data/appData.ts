import CircleOfFifths from "$lib/components/Icons/CircleOfFifths.svelte";
import NoteGlasses from "$lib/components/Icons/NoteGlasses.svelte";
import type { Component } from "svelte";

interface DataEntry {
  name: string;
  description: string;
  href: string;
  color: string;
  icon: Component
};

export const exercisesData: DataEntry[] = [
  {
    name: "Note Identification",
    description: "Master reading notes on treble, bass, and alto clefs.",
    href: "/",
    color: "purple",
    icon: NoteGlasses
  },
  {
    name: "Interval Training",
    description: "Learn to recognize the distance between notes by ear and sight.",
    href: "/exercises",
    color: "violet",
    icon: CircleOfFifths
  },
  {
    name: "Key Identification",
    description: "Learn to determine the key based off the key signature on a staff.",
    href: "/exercises",
    color: "blue",
    icon: CircleOfFifths
  },
  {
    name: "Chord Identification",
    description: "Learn to read chords on the staff, by sound, and other options to master!",
    href: "/exercises",
    color: "green",
    icon: CircleOfFifths
  },
];

export const toolsData: DataEntry[] = [
  {
    name: "Metronome",
    description: "Easy to use and customize metronome with many options.",
    href: "/tools",
    color: "purple",
    icon: CircleOfFifths
  },
  {
    name: "Circle of Fifths",
    description: "Interactive simple circle of fifths for use in reference.",
    href: "/tools",
    color: "violet",
    icon: CircleOfFifths
  },
  {
    name: "Chord Dictionary",
    description: "Search any chord and play them in app, or lookup how to play it on your instrument.",
    href: "/tools",
    color: "blue",
    icon: CircleOfFifths
  },
  {
    name: "Scales Library",
    description: "Find the notes and diatonic chords in any scale.",
    href: "/tools/scales-library",
    color: "green",
    icon: CircleOfFifths
  },
]
