const toolScalesLibraryBaseURL = "/tools/scales-library/";
const toolChordLibraryBaseURL = "/tools/chords-library/";

const encodeUrlAccidentals = (string: string) => {
  let newString = string;
  newString = newString.replaceAll("#", "sharp");
  newString = newString.replaceAll("b", "flat");

  return newString;
}

export const decodeUrlAccidentals = (string: string) => {
  let newString = string;
  newString = newString.replaceAll("sharp", "#");
  newString = newString.replaceAll("flat", "b");

  return newString;
}

export const encodeUrlScale = (note: string, scale: string) => {
  return toolScalesLibraryBaseURL + encodeUrlNoteWithValue(note, scale);
}

export const encodeUrlChord = (note: string, chord: string) => {
  return toolChordLibraryBaseURL + encodeUrlNoteWithValue(note, chord);
}

const encodeUrlNoteWithValue = (note: string, value: string) => {
  let urlPart = encodeUrlAccidentals(note);
  urlPart += "-";
  urlPart += encodeUrlAccidentals(value);

  return urlPart;
}