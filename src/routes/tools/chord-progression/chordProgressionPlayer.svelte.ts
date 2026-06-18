import { pianoAudioService } from "$lib/audio/pianoAudioService.svelte";
import type { GeneralChord, GeneralNote } from "$lib/helpers/musicTheoryTypes";
import {
  applyBassNoteRange,
  applyMelodyNoteRange,
  applyMelodyVoicing,
  applyNoteShift,
  calculateDynamicRange,
  styleLibrary,
  transposeChordsByKey,
  type BassEvent,
  type MelodyEvent,
  type NoteRangeConfig,
  type RhythmStyle,
} from "./chordProgressionHelpers";
import { convertNoteNameToObj, getFullNoteNameFromObj, incrementNoteNameByInterval } from "$lib/helpers/musicTheory";
import { keyNamesFlatted } from "$lib/helpers/musicTheoryConstants";

export interface ProgressionStep {
  chordInfo: GeneralChord | null;
  beats: number;
}

export class ProgressionPlayer {
  progression: ProgressionStep[] = $state([]);
  bpm: number = $state(120);
  isPlaying: boolean = $state(false);
  currentProgressionIdx: number = $state(0);
  currentPlayedNotes: string[] = $state([]);
  autoMelodyChordInversions: boolean = $state(true);

  currentContinousStepNumber: number = $state(0);
  currentChordStepNumber: number = $state(0);
  currentBeatNumber: number = $state(0);

  globalKey: string = $state("C");
  currentStyle: string = $state("basic-1");
  currentStyleData: RhythmStyle = $derived(styleLibrary[this.currentStyle]);

  noteRangeConfig: NoteRangeConfig = $derived({
    melody: calculateDynamicRange(this.globalKey, this.currentStyleData.relativeNoteRanges.melody),
    bass: calculateDynamicRange(this.globalKey, this.currentStyleData.relativeNoteRanges.bass)
  });

  private audioContext: AudioContext | null = null;
  private timerID: ReturnType<typeof setTimeout> | null = null;

  private SCHEDULER_SLEEP_MS = 25.0;
  private LOOKAHEAD_WINDOW_SECONDS = 0.05;
  private currentNextNoteTime = 0.0;

  constructor() { }

  // === HELPERS ===

  private get secondsPerStep() {
    return (60.0 / this.bpm) / 4;
  }

  // Desinged to handle early chord changes (like in bossa nova style)
  private resolveTrackActiveChord(currentStyleStepNumber: number, trackEarlyChangeSteps?: number[]): GeneralChord | null {
    const currentProgressionStep = this.progression[this.currentProgressionIdx];
    if (!currentProgressionStep || !currentProgressionStep.chordInfo) return null;

    const currentChord = currentProgressionStep.chordInfo;
    const patternLength = this.currentStyleData.patternLength || 16;
    const localHarmonicStep = currentStyleStepNumber % patternLength;

    const earlyChangeSteps = trackEarlyChangeSteps || [];

    for (let i = 0; i <= this.currentChordStepNumber; i++) {
      const pastMasterStep = (localHarmonicStep - i + patternLength) % patternLength;

      if (earlyChangeSteps.includes(pastMasterStep)) {
        const stepWhenAnticipated = this.currentChordStepNumber - i;
        const currentChordTargetSteps = currentProgressionStep.beats * 4;
        const stepsRemainingAtTrigger = currentChordTargetSteps - stepWhenAnticipated;

        if (stepsRemainingAtTrigger <= 8) {
          const nextProgressionIdx = (this.currentProgressionIdx + 1) % this.progression.length;
          return this.progression[nextProgressionIdx].chordInfo;
        }

        break;
      }
    }

    return currentChord;
  }

  // Used by scheduleNote function to process the next bass event as specified in selected style data
  private processBassTrack(bassEvents: BassEvent[], activeChord: GeneralChord, delayInMs: number, outPlayedNotes: string[]) {
    const rawChordNotes = activeChord.notes;
    if (rawChordNotes.length === 0) return;

    bassEvents.forEach(bassEvent => {
      let bassNoteStr = getFullNoteNameFromObj(rawChordNotes[0]);
      bassNoteStr = applyBassNoteRange(bassNoteStr, this.noteRangeConfig.bass);

      if (bassEvent.degree === "fifth") bassNoteStr = incrementNoteNameByInterval(bassNoteStr, "5P");
      bassNoteStr = applyNoteShift(bassNoteStr, bassEvent.noteShift);

      const fixedBassNoteObj = convertNoteNameToObj(bassNoteStr);
      outPlayedNotes.push(bassNoteStr);

      const sustainType = bassEvent.noteLength === "legato" ? "med" : "low";

      setTimeout(() => {
        pianoAudioService.playNote(fixedBassNoteObj, sustainType);
      }, delayInMs);
    });
  }

  // Used by scheduleNote function to process the next bass event as specified in selected style data
  private processMelodyTrack(chordEvents: MelodyEvent[], activeChord: GeneralChord, delayInMs: number, outPlayedNotes: string[]) {
    const rawChordNotes = activeChord.notes;
    if (rawChordNotes.length === 0) return;

    const rawUpperNotes = rawChordNotes.map(n => getFullNoteNameFromObj(n));
    let fixedUpperNotes: string[];

    if (this.autoMelodyChordInversions) {
      const rangedUpperNotes = applyMelodyNoteRange(rawUpperNotes, this.noteRangeConfig.melody, false);
      fixedUpperNotes = applyMelodyVoicing(rangedUpperNotes);
    } else {
      fixedUpperNotes = applyMelodyNoteRange(rawUpperNotes, this.noteRangeConfig.melody, true);
    }

    chordEvents.forEach(chordEvent => {
      const sustainType = chordEvent.noteLength === "legato" ? "med" : "low";
      const chordVoices: GeneralNote[] = [];

      chordEvent.voices.forEach(voiceIndex => {
        if (voiceIndex < fixedUpperNotes.length) {
          let voiceStr = fixedUpperNotes[voiceIndex];
          voiceStr = applyNoteShift(voiceStr, chordEvent.noteShift);

          const fixedVoiceNoteObj = convertNoteNameToObj(voiceStr);
          outPlayedNotes.push(voiceStr);
          chordVoices.push(fixedVoiceNoteObj);
        }
      });

      setTimeout(() => {
        pianoAudioService.playChord(chordVoices, sustainType);
      }, delayInMs);
    });
  }

  private validateBpmValue() {
    if (this.bpm < 40 || this.bpm > 240) this.bpm = 120;
  }

  // === PRIVATE METHODS ===

  private nextNote() {
    this.validateBpmValue();

    this.currentNextNoteTime += this.secondsPerStep;
    this.currentContinousStepNumber++;
    this.currentChordStepNumber++;

    const currentChordTargetSteps = this.progression[this.currentProgressionIdx].beats * 4;

    if (this.currentChordStepNumber >= currentChordTargetSteps) {
      this.currentChordStepNumber = 0;
      this.currentProgressionIdx++;

      if (this.currentProgressionIdx >= this.progression.length) {
        this.currentProgressionIdx = 0;
      }
    }
  }
  private scheduleNote() {
    const timeToPlay = this.currentNextNoteTime;
    const currentStyleStepNumber = this.currentContinousStepNumber;
    this.currentPlayedNotes = [];

    // Gets the step from seperate tracks, as each could have different looping points
    const localMelodyStep = currentStyleStepNumber % this.currentStyleData.melodyTrack.stepCount;
    const localBassStep = currentStyleStepNumber % this.currentStyleData.bassTrack.stepCount;

    const melodyEvents = this.currentStyleData.melodyTrack.events.filter(e => e.step === localMelodyStep);
    const bassEvents = this.currentStyleData.bassTrack.events.filter(e => e.step === localBassStep);
    if (melodyEvents.length === 0 && bassEvents.length === 0) return;

    if (!this.audioContext) return;

    const currentPlayedNoteStrings: string[] = [];

    const delayInSeconds = timeToPlay - this.audioContext.currentTime;
    const delayInMs = Math.max(0, delayInSeconds * 1000);

    if (bassEvents.length > 0) {
      const activeBassChord = this.resolveTrackActiveChord(
        currentStyleStepNumber,
        this.currentStyleData.bassTrack.earlyChangeSteps
      );

      if (activeBassChord) {
        this.processBassTrack(bassEvents, activeBassChord, delayInMs, currentPlayedNoteStrings);
      }
    }

    if (melodyEvents.length > 0) {
      const activeMelodyChord = this.resolveTrackActiveChord(
        currentStyleStepNumber,
        this.currentStyleData.melodyTrack.earlyChangeSteps
      );

      if (activeMelodyChord) {
        this.processMelodyTrack(melodyEvents, activeMelodyChord, delayInMs, currentPlayedNoteStrings);
      }
    }

    // Update UI with played notes
    this.currentPlayedNotes = currentPlayedNoteStrings;
  }

  private scheduler() {
    if (!this.isPlaying || !this.audioContext) return;

    while (this.currentNextNoteTime < this.audioContext.currentTime + this.LOOKAHEAD_WINDOW_SECONDS) {
      this.scheduleNote();
      this.nextNote();
    }

    this.timerID = setTimeout(() => this.scheduler(), this.SCHEDULER_SLEEP_MS);
  }

  // === PUBLIC METHODS ===

  play() {
    if (this.isPlaying) return;

    this.audioContext = Howler.ctx;

    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.currentProgressionIdx = 0;
    this.currentContinousStepNumber = 0;
    this.currentChordStepNumber = 0;

    // Value is added, so that the scheduler can see first set of notes
    this.currentNextNoteTime = this.audioContext.currentTime + 0.05;

    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID) clearTimeout(this.timerID);
    this.currentProgressionIdx = 0;
    this.currentContinousStepNumber = 0;
    this.currentChordStepNumber = 0;
    this.currentPlayedNotes = []

    pianoAudioService.stopAll();
  }

  togglePlay = () => {
    if (this.isPlaying) this.stop();
    else this.play();
  }

  // Function is designed to be called during component mount. Key is passed in for proper transposing
  // of chords when key is changed.
  initProgression(progression: ProgressionStep[], key: string) {
    this.progression = progression;
    this.currentProgressionIdx = 0;

    this.globalKey = key;
  }

  changeStyle(style: string) {
    this.stop();
    this.currentStyle = style;
  }

  changeKey(newKey: string, autoTranposeChords: boolean = true) {
    if (!keyNamesFlatted.includes(newKey) || this.globalKey === newKey) return;
    this.stop();

    if (autoTranposeChords) {
      const tranposedChords = transposeChordsByKey(this.progression.map(e => e.chordInfo!), this.globalKey, newKey);

      this.progression = this.progression.map((e, idx) => {
        return {
          ...e,
          chordInfo: tranposedChords[idx]
        }
      })
    }

    this.globalKey = newKey;
  }
}