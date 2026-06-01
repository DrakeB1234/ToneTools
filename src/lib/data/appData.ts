import CircleOfFifths from "$lib/components/Icons/CircleOfFifths.svelte";
import NoteGlasses from "$lib/components/Icons/NoteGlasses.svelte";
import type { Component } from "svelte";

interface DataEntry {
  name: string;
  description: string;
  href: string;
  urlName: string;
  color: string;
  icon: Component
};

export const exercisesData: DataEntry[] = [
  {
    name: "Note Identification",
    description: "Master reading notes on treble, bass, and alto clefs.",
    href: "/exercises",
    urlName: "NONE",
    color: "purple",
    icon: NoteGlasses
  },
  {
    name: "Interval Training",
    description: "Learn to recognize the distance between notes by ear and sight.",
    href: "/exercises",
    urlName: "NONE",
    color: "violet",
    icon: CircleOfFifths
  },
  {
    name: "Key Identification",
    description: "Learn to determine the key based off the key signature on a staff.",
    href: "/exercises",
    urlName: "NONE",
    color: "blue",
    icon: CircleOfFifths
  },
  {
    name: "Chord Identification",
    description: "Learn to read chords on the staff, by sound, and other options to master!",
    href: "/exercises",
    urlName: "NONE",
    color: "green",
    icon: CircleOfFifths
  },
];

export const toolsData: DataEntry[] = [
  {
    name: "Metronome",
    description: "Easy to use and customize metronome with many options, including polyrhythms!",
    href: "/tools/metronome",
    urlName: "metronome",
    color: "purple",
    icon: CircleOfFifths
  },
  {
    name: "Circle of Fifths",
    description: "Interactive simple circle of fifths for use in reference.",
    href: "/tools",
    urlName: "NONE",
    color: "violet",
    icon: CircleOfFifths
  },
  {
    name: "Polyrhythm Creator",
    description: "Tool to create and study simple polyrhythms.",
    href: "/tools",
    urlName: "NONE",
    color: "violet",
    icon: CircleOfFifths
  },
  {
    name: "Indentify Chord",
    description: "Lookup a chord that you know the notes to on a piano roll, then view the details on it!",
    href: "/tools/indentify-chord",
    urlName: "indentify-chord",
    color: "violet",
    icon: CircleOfFifths
  },
  {
    name: "Chords Library",
    description: "Search any chord and play them in app, or lookup how to play it on your instrument.",
    href: "/tools/chords-library",
    urlName: "chords-library",
    color: "blue",
    icon: CircleOfFifths
  },
  {
    name: "Scales Library",
    description: "Find the notes and diatonic chords in any scale.",
    href: "/tools/scales-library",
    urlName: "scales-library",
    color: "green",
    icon: CircleOfFifths
  },
]
