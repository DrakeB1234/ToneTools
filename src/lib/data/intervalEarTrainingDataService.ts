import { browser } from "$app/environment";
import { intervalObjs } from "$lib/helpers/musicTheoryConstants";

export type IntervalEarTrainingStats = {
  [interval: string]: { correct: number; wrong: number };
};

const STATS_STORAGE_KEY = "ToneTools_IntervalStats";

export const statsDataService = {

  getStats(): IntervalEarTrainingStats {
    if (!browser) return {};

    try {
      const existingData = localStorage.getItem(STATS_STORAGE_KEY);
      const rawStats = existingData ? JSON.parse(existingData) : {};
      const orderedStats: IntervalEarTrainingStats = {};

      for (const intervalObj of intervalObjs) {
        const key = intervalObj.interval;
        if (rawStats[key]) {
          orderedStats[key] = rawStats[key];
        }
      }

      return orderedStats;
    } catch (error) {
      console.error("Failed to parse interval stats:", error);
      return {};
    }
  },

  saveSessionStats(sessionStats: IntervalEarTrainingStats) {
    try {
      const allStats = this.getStats();

      for (const [interval, stats] of Object.entries(sessionStats)) {
        if (!allStats[interval]) {
          allStats[interval] = { correct: 0, wrong: 0 };
        }
        allStats[interval].correct += stats.correct;
        allStats[interval].wrong += stats.wrong;
      }

      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(allStats));
    } catch (error) {
      console.error("Failed to save interval stats:", error);
    }
  },

  resetSessionStats() {
    try {
      localStorage.removeItem(STATS_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to reset stats data:", error);
    }
  }
};