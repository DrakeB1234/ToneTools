import { error, redirect } from '@sveltejs/kit';
import { convertNoteNameToMidi, findChord } from '$lib/helpers/musicTheory';
import type { PageLoad } from './$types';
import { regexChordSymbolToken } from '$lib/helpers/musicTheoryConstants';

export const load: PageLoad = ({ params }) => {
  const rawUrlParam = params.chordToken;

  const match = rawUrlParam.match(regexChordSymbolToken);

  if (!match || !match.groups) {
    const message = encodeURIComponent("Invalid chord format provided.");
    redirect(303, `/tools/chord-library`);
  }

  const { note, accidental, symbol } = match.groups;

  let fixedNote = note;
  if (accidental === "sharp") fixedNote += "#";
  else if (accidental === "flat") fixedNote += "b";

  const chordObj = findChord(fixedNote, symbol);

  if (!chordObj) {
    const message = encodeURIComponent("Invalid chord format provided.");
    redirect(303, `/tools/chord-library`);
  };

  const tonalNotes = chordObj.notes.map(n => n.tonalJsName);

  const pianoPrefersFlat = chordObj.notes.some(note => note.accidental?.includes("b"));

  return {
    chordObj: chordObj,
    tonalNotes: tonalNotes,

    pianoPrefersFlat: pianoPrefersFlat,
  };
};