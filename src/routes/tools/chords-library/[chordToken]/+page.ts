import { redirect } from '@sveltejs/kit';
import { getChord, getChordAliases, getChordIntervalFormula, getChordInversions, getChordSecondaryDominant, getFullNoteNameFromObj, getSimilarChords } from '$lib/helpers/musicTheory';
import type { PageLoad } from './$types';
import { regexChordSymbolToken } from '$lib/helpers/musicTheoryConstants';
import { decodeUrlNote, decodeUrlChord } from '$lib/helpers/helpers';

export const load: PageLoad = ({ params }) => {
  const rawUrlParam = params.chordToken;

  const match = rawUrlParam.match(regexChordSymbolToken);

  if (!match || !match.groups) {
    const message = encodeURIComponent("Invalid chord format provided.");
    redirect(303, `/tools/chords-library`);
  }

  const { note, accidental, symbol, bassNote } = match.groups;

  const fixedNote = decodeUrlNote(note + accidental);
  let fixedSymbol = decodeUrlChord(symbol);
  const fixedBassNote = decodeUrlNote(bassNote);

  const chordObj = getChord(fixedNote, fixedSymbol, fixedBassNote);

  if (!chordObj) {
    const message = encodeURIComponent("Unable to find chord");
    redirect(303, `/tools/chords-library`);
  };

  const fullNoteNames = chordObj.notes.map(e => getFullNoteNameFromObj(e));
  const chordInversions = !fixedBassNote ? getChordInversions(fixedNote, fixedSymbol) : null;
  const chordIntervals = getChordIntervalFormula(fixedNote, fixedSymbol);
  const chordAliases = getChordAliases(fixedNote, fixedSymbol);
  const similarChords = getSimilarChords(fixedNote, fixedSymbol);
  const secondaryDominantChord = getChordSecondaryDominant(fixedNote);

  return {
    chordObj: chordObj,
    fullNoteNames: fullNoteNames,
    chordInversions: chordInversions,
    chordIntervals: chordIntervals,
    chordAliases: chordAliases,
    similarChords: similarChords,
    secondaryDominantChord: secondaryDominantChord,
  };
}; 