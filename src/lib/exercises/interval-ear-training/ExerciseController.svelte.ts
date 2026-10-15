import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import type { GeneralNote } from "$lib/types/musicTheoryTypes";
import type { StandardStaff } from "vector-score";
import { generateQuestion, getIntervalNote } from "./helpers";
import { getFullNoteNameFromObj } from "$lib/helpers/musicTheory";
import { getVSStaffTarget } from "$lib/helpers/vectorScoreHelpers";
import {
	type IntervalDirection,
	type ConfigOptions,
	type Intervals,
	type PlayModeVariants,
	type ExerciseOptions,
	resolveExerciseOptions
} from "./config";
import { intervalStatsService } from "$lib/data/db/intervalStatsService.svelte";

type ExerciseState = "idle" | "playing" | "answered" | "finished";

export type IntervalQuestion = {
	rootNote: GeneralNote;
	intervalNote: GeneralNote;
	targetInterval: Intervals;
	playMode: PlayModeVariants;
	direction: IntervalDirection;
};

const MELODIC_GAP_MS = 800;

export class ExerciseController {
	selectedIntervals: Intervals[] = $state([]);

	// State
	status: ExerciseState = $state("idle");

	wrongAnswers = $state(0);
	correctAnswers = $state(0);
	questionNumber = $state(0);

	correctGuessInterval = $state("");
	wrongGuessInterval = $state("");

	isNextQuestionDisabled = $derived(this.status !== "answered" && this.status !== "idle");
	isExerciseOver = $derived(this.status === "finished");
	currentMessage = $derived(this.getCurrentUIMessage(this.status));

	private options: ExerciseOptions;
	private audioTimer: ReturnType<typeof setTimeout> | null = null;
	private staffInstance: StandardStaff | null = null;

	private currentQuestion: IntervalQuestion | null = null;

	constructor(config: ConfigOptions) {
		this.options = resolveExerciseOptions(config);
	}

	private startNextQuestion() {
		this.clearVectorScoreNotes();
		this.correctGuessInterval = "";
		this.wrongGuessInterval = "";

		const question = generateQuestion(
			this.options.intervals,
			this.options.playModes,
			this.options.directions,
			this.options.octaveMin,
			this.options.octaveMax
		);
		this.currentQuestion = question;
		this.questionNumber += 1;
		this.status = "playing";

		this.playNotes(this.currentQuestion.intervalNote);
	}

	private submitGuess(guessedInterval: string) {
		const question = this.currentQuestion;
		if (!question || this.status !== "playing") return;

		const correctInterval = question.targetInterval;
		const isCorrect = guessedInterval === correctInterval;

		this.correctGuessInterval = correctInterval;
		if (isCorrect) {
			this.correctAnswers += 1;
			this.wrongGuessInterval = "";
			intervalStatsService.incrementCorrect(question.targetInterval);
		} else {
			this.wrongAnswers += 1;
			this.wrongGuessInterval = guessedInterval;
			intervalStatsService.incrementWrong(question.targetInterval);
		}

		this.drawVectorScoreNotes(
			question.intervalNote,
			getIntervalNote(question.rootNote, guessedInterval, question.direction),
			isCorrect
		);

		sfxAudioService.play(isCorrect ? "correct_guess" : "wrong_guess");

		this.status = "answered";

		// If questions limit is null, endless mode is selected
		if (this.options.questionLimit !== null && this.questionNumber >= this.options.questionLimit)
			this.status = "finished";
	}

	private stopPlayback() {
		if (this.audioTimer) clearTimeout(this.audioTimer);
		this.audioTimer = null;
	}

	private playNotes(intervalNote: GeneralNote) {
		this.stopPlayback();
		if (!this.currentQuestion) return;
		const rootNoteObj = this.currentQuestion.rootNote;

		if (this.currentQuestion.playMode === "Harmonic") {
			pianoAudioService.playNote(rootNoteObj);
			pianoAudioService.playNote(intervalNote);
			return;
		}

		// Implicitly will handle ascending / desc notes, as the root / interval notes are changed during  question generation.
		pianoAudioService.playNote(rootNoteObj);
		this.audioTimer = setTimeout(() => pianoAudioService.playNote(intervalNote), MELODIC_GAP_MS);
	}

	private getCurrentUIMessage(status: ExerciseState) {
		switch (status) {
			case "idle":
				return "Click the next arrow to start";
			case "playing":
				return "Identify the played interval";
			case "answered": {
				return (
					(this.wrongGuessInterval !== "" ? "Incorrect. " : "Correct! ") +
					"Click the next arrow to start"
				);
			}
			case "finished":
				return "Exercise Over!";
		}
	}

	private drawVectorScoreNotes(
		intervalNote: GeneralNote,
		guessedNote: GeneralNote,
		guessCorrect: boolean
	) {
		if (!this.staffInstance || !this.currentQuestion) return;
		const rootNoteStr = getFullNoteNameFromObj(this.currentQuestion.rootNote);
		const intervalNoteStr = getFullNoteNameFromObj(intervalNote);
		const guessedNoteStr = getFullNoteNameFromObj(guessedNote);

		const staffOptions = getVSStaffTarget(this.currentQuestion.rootNote, "grand");

		this.staffInstance.drawBatchElements(`${rootNoteStr}q ${intervalNoteStr}q |`, staffOptions);
		this.staffInstance.drawBatchElements(`${rootNoteStr}q ${guessedNoteStr}q`, {
			...staffOptions,
			classes: [guessCorrect ? "correct-note" : "wrong-note"]
		});
		this.staffInstance.justifyNotes();
	}

	private clearVectorScoreNotes() {
		if (!this.staffInstance) return;
		this.staffInstance.clearAllNotes();
	}

	// If class state is already answered, then whatever interval pressed by user is played.
	handleIntervalButtonClick = (interval: string) => {
		if (this.status === "playing") this.submitGuess(interval);
		else if (this.status === "answered" && this.currentQuestion) {
			const intervalNote = getIntervalNote(
				this.currentQuestion.rootNote,
				interval,
				this.currentQuestion.direction
			);
			this.playNotes(intervalNote);
		}
	};

	handleNextButtonClick = () => {
		if (this.status === "idle" || this.status === "answered") this.startNextQuestion();
	};

	handleReplayIntervalClick = () => {
		if (this.status !== "idle" && this.currentQuestion)
			this.playNotes(this.currentQuestion.intervalNote);
	};

	addVSStaffInstance = (instance: StandardStaff) => {
		this.staffInstance = instance;
	};

	destroy() {
		if (this.audioTimer) clearTimeout(this.audioTimer);
		if (this.staffInstance) {
			this.staffInstance.clearAllNotes();
			this.staffInstance = null;
		}
	}
}
