// src/lib/data/db.ts
import type { SfxSoundName } from "$lib/audio/sfxAudioService.svelte";
import type { ConfigOptions, Intervals } from "$lib/exercises/interval-ear-training/config";
import type { ConfigOptions as SightReadingConfig } from "$lib/exercises/sight-reading/config";
import Dexie, { type EntityTable } from "dexie";

export interface DBIntervalStatRow {
	interval: Intervals; // Primary Key
	correct: number;
	wrong: number;
}

type MetronomeConfig = {
	bpm: number;
	timeSigNumTop: number;
	timeSigNumBottom: number;
	accentBeatSound: SfxSoundName;
	standardBeatSound: SfxSoundName;
};

export interface UserConfigMap {
	"interval-ear-training": ConfigOptions;
	"sight-reading": SightReadingConfig;
	metronome: MetronomeConfig;
}

export type UserConfigKey = keyof UserConfigMap;

export type UserConfigRow<K extends UserConfigKey = UserConfigKey> = {
	[P in K]: {
		key: P;
		config: UserConfigMap[P];
	};
}[K];

export const db = new Dexie("ToneToolsDB") as Dexie & {
	intervalStats: EntityTable<DBIntervalStatRow, "interval">;
	userConfigOptions: EntityTable<UserConfigRow, "key">;
};

// Auto incrementing: ++ before field value
db.version(1).stores({
	intervalStats: "interval",
	userConfigOptions: "key"
});
