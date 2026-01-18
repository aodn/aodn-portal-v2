export type CloudOptimizedFeature = {
  date: string;
  timestamp: number; // Same value as date but in number for fast processing
  count: number;
  key: string;
};
