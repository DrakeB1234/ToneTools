import { redirect } from '@sveltejs/kit';
import { getChord, getChordAliases, getChordIntervalFormula, getChordInversions, getChordSecondaryDominant, getFullNoteNameFromObj, getSimilarChords, simplifyNoteName } from '$lib/helpers/musicTheory';
import type { PageLoad } from './$types';
import { regexChordSymbolToken } from '$lib/helpers/musicTheoryConstants';
import { decodeUrlNote, decodeUrlChord } from '$lib/helpers/helpers';
import { getChordObj } from '$lib/helpers/guitarDBHelpers';

export const load: PageLoad = ({ params }) => {
  const rawUrlParam = params.chordToken;

  const match = rawUrlParam.match(regexChordSymbolToken);

  if (!match || !match.groups) {
    const message = encodeURIComponent("Invalid chord format provided.");
    redirect(303, `/tools/chords-library`);
  }

  const { note, accidental, symbol, bassNote } = match.groups;

  const decodedNote = decodeUrlNote(note + accidental);
  const decodedSymbol = decodeUrlChord(symbol);
  const decodedBassNote = decodeUrlNote(bassNote);

  const simplifiedNote = simplifyNoteName(decodedNote);

  const chordObj = getChord(simplifiedNote, decodedSymbol, decodedBassNote);

  if (!chordObj) {
    const message = encodeURIComponent("Unable to find chord");
    redirect(303, `/tools/chords-library`);
  };

  const fullNoteNames = chordObj.notes.map(e => getFullNoteNameFromObj(e));
  const chordInversions = !decodedBassNote ? getChordInversions(simplifiedNote, decodedSymbol) : null;
  const chordIntervals = getChordIntervalFormula(simplifiedNote, decodedSymbol);
  const chordAliases = getChordAliases(simplifiedNote, decodedSymbol);
  const similarChords = getSimilarChords(simplifiedNote, decodedSymbol);
  const secondaryDominantChord = getChordSecondaryDominant(simplifiedNote);
  const guitarChordObj = getChordObj(chordObj.tonic, chordObj.symbol)

  return {
    chordObj: chordObj,
    fullNoteNames: fullNoteNames,
    chordInversions: chordInversions,
    chordIntervals: chordIntervals,
    chordAliases: chordAliases,
    similarChords: similarChords,
    secondaryDominantChord: secondaryDominantChord,
    guitarChordObj: guitarChordObj,
    unSimplifiedNote: simplifiedNote === decodedNote ? undefined : decodedNote
  };
}; 