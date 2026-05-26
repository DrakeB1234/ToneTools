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

  console.log(note, accidental, scale, fixedNote);

  const notes = getScaleNotes(
    fixedNote,
    scale,
    4,
  );
  const triads = getModeDiatonicTriads(
    fixedNote,
    scale,
    4,
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

  return {
    noteToken: fixedNote,
    scaleToken: scale,

    scaleNotes: notes,
    pianoRollNotes: notes.map(e => e.tonalJsName),

    triads: triads,
    numerals: numerals,
    formula: formula,
    relativeModes: relativeModes
  };
};