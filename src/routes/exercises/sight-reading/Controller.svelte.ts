import { MusicStaff } from "vector-score";
import { type ConfigOptions } from "./helpers";
import type { GeneralNote } from "$lib/types/musicTheoryTypes";
import { convertNoteNameToObj, getFullNoteNameFromObj, stepNoteName } from "$lib/helpers/musicTheory";
import { sfxAudioService } from "$lib/audio/sfxAudioService.svelte";
import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import { naturalNoteNames } from "$lib/helpers/musicTheoryConstants";

type ExerciseState = "idle" | "playing" | "finished";

export class Controller {
  status: ExerciseState = $state("idle");
  currentMessage = $state("Click start to begin!");

  wrongAnswers = $state(0);
  correctAnswers = $state(0);
  timer = $state(0);

  preferFlats = $state(true);

  private config: ConfigOptions;
  private staffInstance: MusicStaff | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private currentQuestionNoteObj: GeneralNote | null = null;

  private notePool: GeneralNote[] = [];

  constructor(config: ConfigOptions) {
    this.config = config;

    const initalTimerNumber = Number(this.config.timer);

    this.timer = Number.isNaN(initalTimerNumber) ? 0 : initalTimerNumber;

    this.notePool = this.buildNotePool();
  }

  // Used for random choosing of notes that are pre set to match within config range
  // Builds all combinations of notes + accidentals, according to config options
  private buildNotePool(): GeneralNote[] {
    const lowRangeNoteObj = convertNoteNameToObj(this.config.noteRange.low);
    const highRangeNoteObj = convertNoteNameToObj(this.config.noteRange.high);

    const lowIdx = naturalNoteNames.findIndex(e => e === lowRangeNoteObj.letter);
    const highIdx = naturalNoteNames.findIndex(e => e === highRangeNoteObj.letter);

    const rangeLetterDiff = highIdx - lowIdx;
    const rangeOctaveDiff = highRangeNoteObj.octave! - lowRangeNoteObj.octave!;
    const totalSteps = (rangeOctaveDiff * 7) + rangeLetterDiff;
    const accidentalsToApply = this.config.allowedAccidentals.map(acc =>
      acc === "n" ? "" : acc
    );

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
    }
    else {
      this.preferFlats = true;
    }

    if (!this.staffInstance) return;
    this.staffInstance.changeNoteByIndex(getFullNoteNameFromObj(randomNote), 0);
  }

  private handleTimeOut() {
    this.status = "finished";
    this.currentMessage = "Exercise Over!"
  }

  private startTimer() {
    const timerValue = Number(this.config.timer);
    if (Number.isNaN(timerValue)) {
      this.timerInterval = setInterval(() => {
        this.timer++;
      }, 1000);

      return;
    }
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

  addVSStaffInstancee = (instance: MusicStaff) => {
    this.staffInstance = instance;

    this.staffInstance.drawNote("C4");
  }

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

    if (parsedNote.letter === currentQuestion.letter && parsedNote.accidental === currentQuestion.accidental) {
      this.correctAnswers++;
      pianoAudioService.playNote(currentQuestion, "med");
    } else {
      this.wrongAnswers++;
      sfxAudioService.play("wrong_guess");
      const stringNote = getFullNoteNameFromObj(this.currentQuestionNoteObj);
      this.currentMessage = `Wrong, Correct Answer: ${stringNote}`
    }

    this.generateQuestion();
  }

  handleMidiInput(note: string) {
    if (this.status !== "playing" || !this.currentQuestionNoteObj) return;
    this.currentMessage = "-";

    const parsedNote = convertNoteNameToObj(note);
    const currentQuestion = this.currentQuestionNoteObj;

    if (parsedNote.letter === currentQuestion.letter && parsedNote.accidental === currentQuestion.accidental && parsedNote.octave === currentQuestion.octave) {
      this.correctAnswers++;
      pianoAudioService.playNote(currentQuestion, "med");
    } else {
      this.wrongAnswers++;
      sfxAudioService.play("wrong_guess");
      const stringNote = getFullNoteNameFromObj(this.currentQuestionNoteObj);
      this.currentMessage = `Wrong, Correct Answer: ${stringNote}`
    }

    this.generateQuestion();
  }

  destroy() {
    this.staffInstance = null;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
}