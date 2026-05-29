import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { regexScaleToken } from '$lib/helpers/musicTheoryConstants';
import { getFormulaFromMode, getModeDiatonicTriads, getNumeralsFromMode, getRelativeMajorMinorScales, getScaleNotes } from '$lib/helpers/musicTheory';

export const load: PageLoad = ({ params }) => {
  const rawUrlParam = params.scaleToken;

  const match = rawUrlParam.match(regexScaleToken);

  if (!match || !match.groups) {
    throw error(404, "Invalid scale format provided in URL");
  }

  const { note, accidental, scale } = match.groups;

  let fixedNote = note;
  if (accidental === "sharp") fixedNote += "#";
  else if (accidental === "flat") fixedNote += "b";

  const startingOctave = 4;

  const notes = getScaleNotes(
    fixedNote,
    scale,
    startingOctave,
  );
  const triads = getModeDiatonicTriads(
    fixedNote,
    scale,
    startingOctave,
  );
  const numerals = getNumeralsFromMode(scale);
  const formula = getFormulaFromMode(scale);
  const relativeModes = getRelativeMajorMinorScales(
    fixedNote,
    scale,
  );


  if (!notes || !triads || !numerals || !formula || !relativeModes) {
    throw error(404, "Scale not found in library");
  };

  const pianoRollNotes = notes.map(e => e.tonalJsName);

  return {
    noteToken: fixedNote,
    scaleToken: scale,
    pianoRollNotes: pianoRollNotes,

    scaleNotes: notes,
    triads: triads,
    numerals: numerals,
    formula: formula,
    relativeModes: relativeModes
  };
};