import { redirect } from '@sveltejs/kit';
import { findChord } from '$lib/helpers/musicTheory';
import type { PageLoad } from './$types';
import { regexChordSymbolToken } from '$lib/helpers/musicTheoryConstants';
import { decodeUrlNote, decodeUrlChord } from '$lib/helpers/helpers';

export const load: PageLoad = ({ params }) => {
  const rawUrlParam = params.chordToken;

  const match = rawUrlParam.match(regexChordSymbolToken);

  if (!match || !match.groups) {
    const message = encodeURIComponent("Invalid chord format provided.");
    redirect(303, `/tools/chord-library`);
  }

  const { note, accidental, symbol, bassNote } = match.groups;

  const fixedNote = decodeUrlNote(note + accidental);
  let fixedSymbol = decodeUrlChord(symbol);
  const fixedBassNote = decodeUrlNote(bassNote);

  const chordObj = findChord(fixedNote, fixedSymbol, fixedBassNote);

  if (!chordObj) {
    const message = encodeURIComponent("Invalid chord format provided.");
    redirect(303, `/tools/chord-library`);
  };

  const tonalNotes = chordObj.notes.map(n => n.tonalJsName);

  return {
    chordObj: chordObj,
    tonalNotes: tonalNotes,
  };
};