import type { GeneralNote } from "$lib/types/musicTheoryTypes";
import {
	chordConfig,
	noteConfig,
	type DrawChordConfig,
	type DrawNoteConfig,
	type NoteAccidentals,
	type NoteArticulations,
	type NoteDurations,
	type NoteLetters,
	type StandardStaffDrawOptions,
	type SystemTypes
} from "vector-score";
import { convertNoteObjToMidi } from "./musicTheory";

const MIDDLE_C_MIDI = 60;

export function getVSNoteConfig(
	note: GeneralNote,
	duration: NoteDurations,
	options?: { isDotted?: boolean; articulation?: NoteArticulations }
): DrawNoteConfig {
	return noteConfig({
		letter: note.letter as NoteLetters,
		octave: note.octave ?? 0,
		accidental: note.accidental as NoteAccidentals,
		duration,
		articulation: options?.articulation,
		isDotted: options?.isDotted
	});
}

export function getVSChordConfig(
	notes: GeneralNote[],
	duration: NoteDurations,
	options?: { isDotted?: boolean; articulation?: NoteArticulations }
): DrawChordConfig {
	return chordConfig({
		notes: notes.map((note) => ({
			letter: note.letter as NoteLetters,
			octave: note.octave ?? 0,
			accidental: (note.accidental as NoteAccidentals) ?? undefined
		})),
		duration,
		isDotted: options?.isDotted,
		articulation: options?.articulation
	});
}

export function getVSStaffTarget(
	note: GeneralNote,
	staffType: SystemTypes
): StandardStaffDrawOptions | undefined {
	if (staffType !== "grand") return undefined;
	const midi = convertNoteObjToMidi(note);
	return { staff: midi !== null && midi < MIDDLE_C_MIDI ? "bottom" : "top" };
}
