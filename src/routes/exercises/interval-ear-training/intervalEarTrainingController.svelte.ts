import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { convertNoteNameToObj, decrementNoteNameByInterval, incrementNoteNameByInterval } from "$lib/helpers/musicTheory";
import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";
import type { GeneralNote, IntervalEntry } from "$lib/helpers/musicTheoryTypes";
import type { IntervalEarConfig } from "./intervalEarTrainingHelpers";

type ExerciseState = "idle" | "playing" | "answered" | "finished";
type UIAnswerState = "none" | "correct" | "wrong";

type CurrentQuestion = {
  rootNote: GeneralNote;
  intervalNote: GeneralNote;
  targetInterval: IntervalEntry;
  type: string;
  direction: string;
} | null;

export class IntervalEarTrainingController {
  private config: IntervalEarConfig;
  private intervalAudioTimer: ReturnType<typeof setTimeout> | null = null;

  selectedIntervals: IntervalEntry[] = $state([]);

  // State
  status: ExerciseState = $state("idle");
  currentQuestion: CurrentQuestion = null;

  correctGuessInterval = $state("");
  wrongGuessInterval = $state("");

  wrongAnswers = $state(0);
  correctAnswers = $state(0);
  questionNumber = $state(0);

  isNextQuestionDisabled = $derived(this.status !== "answered" && this.status !== "idle");
  isExerciseOver = $derived(this.status === "finished");

  currentMessage = $derived(this.getCurrentUIMessage(this.status));

  constructor(config: IntervalEarConfig) {
    this.config = config;
    this.selectedIntervals = config.selectedIntervals;
  }

  private generateNewQuestion() {
    if (this.status === "finished") return;

    this.questionNumber += 1;
    this.status = "playing";
    this.correctGuessInterval = "";
    this.wrongGuessInterval = "";

    const randomInterval = this.selectedIntervals[Math.floor(Math.random() * this.selectedIntervals.length)];
    const randomNoteLetter = naturalNoteNames[Math.floor(Math.random() * naturalNoteNames.length)];
    const randomOctave = Math.max(Math.floor(Math.random() * this.config.octaveRangeHigh), this.config.octaveRangeLow);

    const rootName = randomNoteLetter + randomOctave;
    const rootNoteObj = convertNoteNameToObj(rootName);

    const randomType = this.config.selectedTypes[Math.floor(Math.random() * this.config.selectedTypes.length)];
    const randomDirection = this.config.selectedDirections[Math.floor(Math.random() * this.config.selectedDirections.length)];

    const intervalNoteObj = this.getIntervalNoteByDirection(rootNoteObj, randomInterval.interval, randomDirection);

    this.currentQuestion = {
      rootNote: rootNoteObj,
      intervalNote: intervalNoteObj,
      targetInterval: randomInterval,
      type: randomType,
      direction: randomDirection
    };

    this.playInterval();
  }

  private handleInput(guessedInterval: string) {
    if (!this.currentQuestion || this.status !== "playing") return;

    if (this.currentQuestion.targetInterval.interval === guessedInterval) {
      this.correctAnswers += 1;
      this.wrongGuessInterval = "";
      sfxAudioService.play("correct");
    } else {
      this.wrongAnswers += 1;
      this.wrongGuessInterval = guessedInterval;
      sfxAudioService.play("wrong");
    }

    this.correctGuessInterval = this.currentQuestion!.targetInterval.interval;

    if (this.questionNumber >= this.config.questionsAmount) {
      this.status = "finished";
    } else {
      this.status = "answered";
    }
  }

  private playInterval() {
    if (!this.currentQuestion) return;

    pianoAudioService.stopAll();
    if (this.intervalAudioTimer) {
      clearTimeout(this.intervalAudioTimer);
      this.intervalAudioTimer = null;
    }

    const { type, rootNote, intervalNote } = this.currentQuestion;

    if (type === "melodic") {
      pianoAudioService.playNote(rootNote);
      this.intervalAudioTimer = setTimeout(() => {
        pianoAudioService.playNote(intervalNote);
      }, 800);
    } else {
      pianoAudioService.playNote(rootNote);
      pianoAudioService.playNote(intervalNote);
    }
  }

  private playRequestedInterval(interval: string) {
    if (!this.currentQuestion) return;

    pianoAudioService.stopAll();
    if (this.intervalAudioTimer) {
      clearTimeout(this.intervalAudioTimer);
      this.intervalAudioTimer = null;
    }

    const { type, direction, rootNote } = this.currentQuestion;

    const intervalNote = this.getIntervalNoteByDirection(rootNote, interval, direction);

    if (type === "melodic") {
      pianoAudioService.playNote(rootNote);
      this.intervalAudioTimer = setTimeout(() => {
        pianoAudioService.playNote(intervalNote);
      }, 800);
    } else {
      pianoAudioService.playNote(rootNote);
      pianoAudioService.playNote(intervalNote);
    }
  }

  private getIntervalNoteByDirection(rootNote: GeneralNote, interval: string, direction: string): GeneralNote {
    let intervalNoteName = "";
    if (direction === "descending") intervalNoteName = decrementNoteNameByInterval(rootNote.tonalJsName, interval);
    else intervalNoteName = incrementNoteNameByInterval(rootNote.tonalJsName, interval);
    return convertNoteNameToObj(intervalNoteName);
  }

  private getCurrentUIMessage(status: ExerciseState) {
    switch (status) {
      case "idle": return "Click the next arrow to start";
      case "playing": return "Identify the played interval";
      case "answered": {
        return (this.wrongGuessInterval !== "" ? "Incorrect. " : "Correct! ") + "Click the next arrow to start";
      }
      case "finished": return "Exercise Over!";
    }
  }

  // If class state is already answered, then whatever interval pressed by user is played.
  handleIntervalButtonClick = (interval: string) => {
    if (this.status === "playing") this.handleInput(interval);
    else if (this.status === "answered") this.playRequestedInterval(interval);
  }

  handleNextButtonClick = () => {
    if (this.status === "idle" || this.status === "answered") {
      this.generateNewQuestion();
    }
  }

  handleReplayIntervalClick = () => {
    if (this.status !== "idle") this.playInterval();
  }

  destroy() {
    if (this.intervalAudioTimer) clearTimeout(this.intervalAudioTimer);
  }
}