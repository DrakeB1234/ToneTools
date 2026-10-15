import { StandardStaff, type SystemTypes } from "vector-score";
import type { GeneralNote } from "$lib/types/musicTheoryTypes";
import {
	convertNoteNameToObj,
	getFullNoteNameFromObj,
	stepNoteName
} from "$lib/helpers/musicTheory";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
import { getVSNoteConfig, getVSStaffTarget } from "$lib/helpers/vectorScoreHelpers";
import type { ConfigOptions, ExerciseOptions } from "./config";
import { resolveExerciseOptions } from "./config";

type ExerciseState = "idle" | "playing" | "finished";

export class ExerciseController {
	status: ExerciseState = $state("idle");
	currentMessage = $state("Click start to begin!");

	wrongAnswers = $state(0);
	correctAnswers = $state(0);
	timer = $state(0);
	preferFlats = $state(true);

	readonly options: ExerciseOptions;
	private staffInstance: StandardStaff | null = null;
	private timerInterval: ReturnType<typeof setInterval> | null = null;
	private currentQuestionNoteObj: GeneralNote | null = null;
	private notePool: GeneralNote[] = [];

	constructor(config: ConfigOptions) {
		// Parse everything immediately upon initialization
		this.options = resolveExerciseOptions(config);
		this.notePool = this.buildNotePool();
	}

	// Used for random choosing of notes that are pre set to match within config range
	// Builds all combinations of notes + accidentals, according to config options
	private buildNotePool(): GeneralNote[] {
		const lowRangeNoteObj = this.options.noteRange.low;
		const highRangeNoteObj = this.options.noteRange.high;

		const lowIdx = naturalNoteNames.findIndex((e) => e === lowRangeNoteObj.letter);
		const highIdx = naturalNoteNames.findIndex((e) => e === highRangeNoteObj.letter);

		const rangeLetterDiff = highIdx - lowIdx;
		const rangeOctaveDiff = highRangeNoteObj.octave! - lowRangeNoteObj.octave!;
		const totalSteps = rangeOctaveDiff * 7 + rangeLetterDiff;

		// Use the parsed accidentals array (which safely includes "n")
		const accidentalsToApply = this.options.accidentals.map((acc) => (acc === "n" ? "" : acc));

		let accumulatedNotes: GeneralNote[] = [];
		let currentNoteString = `${lowRangeNoteObj.letter}${lowRangeNoteObj.octave}`;

		for (let i = 0; i <= totalSteps; i++) {
			const currentObj = convertNoteNameToObj(currentNoteString);

			for (const acc of accidentalsToApply) {
				const spelledNote = `${currentObj.letter}${acc}${currentObj.octave}`;
				accumulatedNotes.push(convertNoteNameToObj(spelledNote));
			}

			// 4. Step up alphabetically to the next natural note for the next iteration
			currentNoteString = stepNoteName(currentNoteString, 1);
		}

		return accumulatedNotes;
	}

	private generateQuestion() {
		if (this.notePool.length === 0) return;

		let randomNote = this.notePool[Math.floor(Math.random() * this.notePool.length)];

		// Loop random note generation until the new note doesn't match the current note (last answered)
		while (
			this.notePool.length > 1 &&
			this.currentQuestionNoteObj &&
			getFullNoteNameFromObj(this.currentQuestionNoteObj) === getFullNoteNameFromObj(randomNote)
		) {
			randomNote = this.notePool[Math.floor(Math.random() * this.notePool.length)];
		}

		this.currentQuestionNoteObj = randomNote;

		if (randomNote.accidental === "#") {
			this.preferFlats = false;
		} else {
			this.preferFlats = true;
		}

		if (!this.staffInstance) return;
		this.staffInstance.replaceByIndex(
			0,
			getVSNoteConfig(randomNote, "q"),
			getVSStaffTarget(randomNote, this.options.clef as SystemTypes)
		);
	}

	private handleTimeOut() {
		this.status = "finished";
		this.currentMessage = "Exercise Over!";
	}

	private startTimer() {
		if (this.options.timerLimit === null) {
			this.timerInterval = setInterval(() => {
				this.timer++; // Endless mode counts up
			}, 1000);
			return;
		}

		// Standard mode counts down
		this.timer = this.options.timerLimit;
		this.timerInterval = setInterval(() => {
			this.timer--;
			if (this.timer < 1) {
				if (this.timerInterval) clearInterval(this.timerInterval);
				this.timer = 0;
				this.handleTimeOut();
			}
		}, 1000);
	}

	get formattedTime() {
		const minutes = Math.floor(this.timer / 60);
		const seconds = this.timer % 60;
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}

	addVSStaffInstancee = (instance: StandardStaff) => {
		this.staffInstance = instance;

		this.staffInstance.drawNote("C4q");
	};

	start() {
		if (this.status !== "idle") return;

		this.status = "playing";
		this.currentMessage = "-";

		this.generateQuestion();

		this.startTimer();
	}

	handleInput(note: string) {
		if (this.status !== "playing" || !this.currentQuestionNoteObj) return;
		this.currentMessage = "-";

		const parsedNote = convertNoteNameToObj(note);
		const currentQuestion = this.currentQuestionNoteObj;

		if (
			parsedNote.letter === currentQuestion.letter &&
			parsedNote.accidental === currentQuestion.accidental
		) {
			this.correctAnswers++;
			pianoAudioService.playNote(currentQuestion, "med");
		} else {
			this.wrongAnswers++;
			sfxAudioService.play("wrong_guess");
			const stringNote = getFullNoteNameFromObj(this.currentQuestionNoteObj);
			this.currentMessage = `Wrong, Correct Answer: ${stringNote}`;
		}

		this.generateQuestion();
	}

	handleMidiInput(note: string) {
		if (this.status !== "playing" || !this.currentQuestionNoteObj) return;
		this.currentMessage = "-";

		const parsedNote = convertNoteNameToObj(note);
		const currentQuestion = this.currentQuestionNoteObj;

		if (
			parsedNote.letter === currentQuestion.letter &&
			parsedNote.accidental === currentQuestion.accidental &&
			parsedNote.octave === currentQuestion.octave
		) {
			this.correctAnswers++;
			pianoAudioService.playNote(currentQuestion, "med");
		} else {
			this.wrongAnswers++;
			sfxAudioService.play("wrong_guess");
			const stringNote = getFullNoteNameFromObj(this.currentQuestionNoteObj);
			this.currentMessage = `Wrong, Correct Answer: ${stringNote}`;
		}

		this.generateQuestion();
	}

	destroy() {
		this.staffInstance = null;
		if (this.timerInterval) clearInterval(this.timerInterval);
		this.timerInterval = null;
	}
}
