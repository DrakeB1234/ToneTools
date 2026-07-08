export type IntervalEarTrainingStats = {
  [interval: string]: { correct: number; wrong: number };
};

const STATS_STORAGE_KEY = "ToneTools_IntervalStats";

export const statsDataService = {
  getStats(): IntervalEarTrainingStats {
    try {
      const existingData = localStorage.getItem(STATS_STORAGE_KEY);
      return existingData ? JSON.parse(existingData) : {};
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
  }
};