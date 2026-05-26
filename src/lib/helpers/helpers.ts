const toolScalesLibraryBaseURL = "/tools/scales-library/";
const toolChordLibraryBaseURL = "/tools/chord-library/";

export const encodeUrlScale = (note: string, scale: string) => {
  let url = toolScalesLibraryBaseURL + note[0];
  if (note[1] === "#") url += "sharp-";
  else if (note[1] === "b") url += "flat-";
  else url += "-";
  url += scale;
  return url;
}

export const encodeUrlChord = (note: string, symbol: string) => {
  let url = toolChordLibraryBaseURL + note[0];
  if (note[1] === "#") url += "sharp-";
  else if (note[1] === "b") url += "flat-";
  else url += "-";
  url += symbol;
  return url;
}