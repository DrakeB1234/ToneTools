const toolScalesLibraryBaseURL = "/tools/scales-library/";
const toolChordLibraryBaseURL = "/tools/chords-library/";

export const encodeUrlScale = (note: string, scale: string) => {
  let urlPart = encodeUrlNote(note);
  urlPart += "-";
  urlPart += encodeUrlNote(scale);

  return toolScalesLibraryBaseURL + urlPart;
}

export const encodeUrlChord = (note: string, symbol: string) => {
  let urlPart = encodeUrlNote(note);

  const parts = symbol.split("/");
  const mainSymbol = parts[0];
  const bassNote = parts[1];

  urlPart += `-${encodeUrlNote(mainSymbol)}`;

  if (bassNote) {
    urlPart += `-bass${encodeUrlNote(bassNote)}`;
  }

  return toolChordLibraryBaseURL + urlPart;
}

const encodeUrlNote = (string: string) => {
  let newString = string;
  newString = newString.replaceAll("#", "sharp");
  newString = newString.replaceAll("b", "flat");

  return newString;
}

export const decodeUrlNote = (string: string) => {
  if (!string) return "";

  let newString = string;
  newString = newString.replaceAll("sharp", "#");
  newString = newString.replaceAll("flat", "b");

  return newString;
}

export const decodeUrlChord = (string: string) => {
  let newString = string;
  newString = newString.replaceAll("sharp", "#");
  newString = newString.replaceAll("flat", "b");
  newString = newString.replaceAll("bass", "/");

  return newString;
}

export const switchIndexInArrayInPlace = (arr: Array<any>, i: number, j: number) => [arr[i], arr[j]] = [arr[j], arr[i]]