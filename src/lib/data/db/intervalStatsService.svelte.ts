// src/lib/data/intervalStatsService.svelte.ts
import {
	intervalNames,
	intervals,
	type Intervals
} from "$lib/exercises/interval-ear-training/config";
import { db, type DBIntervalStatRow } from "./db";

type StatField = "correct" | "wrong";

export const sortStatVariants = [
	"intervals",
	"accuracy-asc",
	"accuracy-desc",
	"most-played"
] as const;
export type SortStatVariants = (typeof sortStatVariants)[number];

export type StatItem = {
	interval: Intervals;
	name: string;
	correct: number;
	wrong: number;
	total: number;
	correctPercent: number;
	weightedScore: number;
};

// Used for weakest / strongest interval (Bayesian smoothing algorithm)
const PRIOR_CORRECT = 2;
const PRIOR_TOTAL = 4;
const MIN_ATTEMPTS_TO_RANK = 3;

export type StatsDashboardState =
	| { status: "empty" }
	| {
			status: "success";
			statsArray: StatItem[];
			overallAccuracy: number;
			strongestInterval: StatItem | null;
			weakestInterval: StatItem | null;
	  };

class IntervalStatsService {
	stats = $state<Partial<Record<Intervals, DBIntervalStatRow>>>({});
	isLoaded = $state(false);

	dashboard = $derived.by<StatsDashboardState>(() => this.computeDashboard());

	constructor() {
		// Guard for SSR if applicable
		if (typeof window !== "undefined") {
			this.loadAll();
		}
	}

	async loadAll() {
		const rows = await db.intervalStats.toArray();
		const map: Partial<Record<Intervals, DBIntervalStatRow>> = {};

		for (const row of rows) {
			map[row.interval] = row;
		}

		this.stats = map;
		this.isLoaded = true;
	}

	private async adjustStat(interval: Intervals, field: StatField, delta: 1 | -1) {
		await db.transaction("rw", db.intervalStats, async () => {
			const existing = await db.intervalStats.get(interval);

			const updated: DBIntervalStatRow = existing ?? {
				interval,
				correct: 0,
				wrong: 0
			};

			// Clamp at 0 so decrementing never produces negative stats
			updated[field] = Math.max(0, updated[field] + delta);

			await db.intervalStats.put(updated);

			this.stats[interval] = updated;
		});
	}

	private computeDashboard(): StatsDashboardState {
		const statsArray = this.buildStatsArray();

		if (statsArray.length === 0) {
			return { status: "empty" };
		}

		const overallAccuracy = this.calculateOverallAccuracy(statsArray);
		const { strongest, weakest } = this.findExtremeIntervals(statsArray);

		return {
			status: "success",
			statsArray,
			overallAccuracy,
			strongestInterval: strongest,
			weakestInterval: weakest
		};
	}

	private buildStatsArray(): StatItem[] {
		const result: StatItem[] = [];

		for (const interval of intervals) {
			const row = this.stats[interval as Intervals];
			if (!row) continue;

			const total = row.correct + row.wrong;
			if (total === 0) continue;

			result.push(this.createStatItem(interval, row, total));
		}
		return result;
	}

	private createStatItem(interval: Intervals, row: DBIntervalStatRow, total: number): StatItem {
		return {
			interval,
			name: intervalNames[interval],
			correct: row.correct,
			wrong: row.wrong,
			total,
			correctPercent: Math.round((row.correct / total) * 100),
			weightedScore: (row.correct + PRIOR_CORRECT) / (total + PRIOR_TOTAL)
		};
	}

	private calculateOverallAccuracy(statsArray: StatItem[]): number {
		let totalCorrect = 0;
		let totalGuesses = 0;

		for (const item of statsArray) {
			totalCorrect += item.correct;
			totalGuesses += item.total;
		}

		return totalGuesses > 0 ? Math.round((totalCorrect / totalGuesses) * 100) : 0;
	}

	private findExtremeIntervals(statsArray: StatItem[]): {
		strongest: StatItem | null;
		weakest: StatItem | null;
	} {
		const rankable = statsArray.filter((item) => item.total >= MIN_ATTEMPTS_TO_RANK);

		if (rankable.length === 0) {
			return { strongest: null, weakest: null };
		}

		const strongest = rankable.reduce((prev, curr) =>
			curr.weightedScore > prev.weightedScore ? curr : prev
		);

		if (rankable.length < 2) {
			return { strongest, weakest: null };
		}

		const candidateWeakest = rankable.reduce((prev, curr) =>
			curr.weightedScore < prev.weightedScore ? curr : prev
		);

		const weakest = candidateWeakest.interval !== strongest.interval ? candidateWeakest : null;

		return { strongest, weakest };
	}

	sortStatsArray(statsArray: StatItem[], sortBy: SortStatVariants): StatItem[] {
		// "intervals" is already the default musical order from iterating over `intervals`
		if (sortBy === "intervals") {
			return statsArray;
		}

		return [...statsArray].sort((a, b) => {
			switch (sortBy) {
				case "accuracy-desc":
					return b.correctPercent - a.correctPercent || b.weightedScore - a.weightedScore;
				case "accuracy-asc":
					return a.correctPercent - b.correctPercent || a.weightedScore - b.weightedScore;
				case "most-played":
					return b.total - a.total;
			}
		});
	}

	incrementCorrect(interval: Intervals) {
		return this.adjustStat(interval, "correct", 1);
	}

	decrementCorrect(interval: Intervals) {
		return this.adjustStat(interval, "correct", -1);
	}

	incrementWrong(interval: Intervals) {
		return this.adjustStat(interval, "wrong", 1);
	}

	decrementWrong(interval: Intervals) {
		return this.adjustStat(interval, "wrong", -1);
	}

	async resetAll() {
		await db.intervalStats.clear();
		this.stats = {};
	}
}

export const intervalStatsService = new IntervalStatsService();
