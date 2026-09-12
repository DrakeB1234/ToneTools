import type { GuitarChordObj, GuitarDB, GuitarDBChordPosition, ParsedGuitarChord } from "$lib/types/guitarDBTypes";
import _guitarDB from "@tombatossals/chords-db/lib/guitar.json";
import { simplifyNoteName } from "./musicTheory";

const guitarDB = _guitarDB as GuitarDB;

const GUITAR_DB_KEY_CONVERT_MAP: Record<string, string> = {
  "Cb": "B",
  "D#": "Eb",
  "Db": "C#",
  "E#": "F",
  "Fb": "E",
  "G#": "Ab",
  "Gb": "F#",
  "A#": "Bb",
  "B#": "C",
}

export function getChordObj(key: string, chordSymbol: string): GuitarChordObj | null {
  // GuitarDB used does not contain definitions for enharmonic notes like "Cb", music theory helper solves this issue.
  const fixedKey = parseGuitarDBKey(key);
  const fixedSymbol = parseGuitarChordSymbol(chordSymbol);

  const chordsForKey = guitarDB.chords[fixedKey];
  if (!chordsForKey) return null;

  const chordDetail = chordsForKey.find((c) => c.suffix === fixedSymbol);
  if (!chordDetail) return null;

  const parsedChordPositions = chordDetail.positions.map(parseGuitarDBChordPosition);

  return {
    chords: parsedChordPositions,
    key: key,
    symbol: fixedSymbol
  };
}

// Required to change from the schema of the @tombatossals/chords-db to what I need to display chords in vector-score
function parseGuitarDBChordPosition(position: GuitarDBChordPosition): ParsedGuitarChord {
  const baseFret = position.baseFret ?? 1;

  return {
    frets: position.frets
      .map((fret) => toAbsoluteFret(fret, baseFret))
      .map(fretToChar)
      .join(""),
    fingers: position.fingers.map(fingerToChar).join(""),
    barres: normalizeBarres(position.barres, baseFret),
    baseFret: position.baseFret,
    midi: position.midi,
  };
}

function parseGuitarDBKey(key: string): string {
  // GuitarDB only has specific keys defined
  const simplifiedKey = simplifyNoteName(key);
  const convertedKey = GUITAR_DB_KEY_CONVERT_MAP[simplifiedKey];
  const fixedKey = convertedKey ?? simplifiedKey;

  return fixedKey.replaceAll("#", "sharp");
}

function toAbsoluteFret(relativeFret: number, baseFret: number): number {
  return relativeFret > 0 ? relativeFret + baseFret - 1 : relativeFret;
}

function fretToChar(fret: number): string {
  return fret === -1 ? "x" : fret.toString(16);
}

function fingerToChar(finger: number): string {
  return finger.toString(16);
}

function normalizeBarres(barres: number[], baseFret: number): number[] | undefined {
  if (barres.length === 0) return undefined;
  return barres.map(e => e + baseFret - 1);
}

function parseGuitarChordSymbol(symbol: string): string {
  if (symbol === "maj") return "major";
  if (symbol.includes("min")) return symbol.replace("min", "m");

  return symbol;
}