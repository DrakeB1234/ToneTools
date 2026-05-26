import { error } from '@sveltejs/kit';
import { findChord } from '$lib/helpers/musicTheory';
import type { PageLoad } from './$types';
import { regexChordSymbolToken } from '$lib/helpers/musicTheoryConstants';

export const load: PageLoad = ({ params }) => {
  const rawUrlParam = params.chordToken;

  const match = rawUrlParam.match(regexChordSymbolToken);

  if (!match || !match.groups) {
    throw error(404, "Invalid chord format provided in URL");
  }

  const { note, accidental, symbol } = match.groups;

  let fixedNote = note;
  if (accidental === "sharp") fixedNote += "#";
  else if (accidental === "flat") fixedNote += "b";

  const chordObj = findChord(fixedNote, symbol, 0);

  if (!chordObj) {
    throw error(404, "Chord not found in library");
  };

  const tonalNotes = chordObj.notes.map(n => n.tonalJsName);

  return {
    chordObj: chordObj,
    tonalNotes: tonalNotes
  };
};