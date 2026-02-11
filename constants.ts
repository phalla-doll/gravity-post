import { SentimentType } from './types';

export const SENTIMENT_COLORS: Record<SentimentType, string> = {
  [SentimentType.HAPPY]: '#FCD34D', // Amber 300
  [SentimentType.EXCITING]: '#F87171', // Red 400
  [SentimentType.NEUTRAL]: '#60A5FA', // Blue 400
  [SentimentType.SAD]: '#9CA3AF', // Gray 400
  [SentimentType.ANGRY]: '#EF4444', // Red 500
  [SentimentType.LOVING]: '#F472B6', // Pink 400
};

export const INITIAL_POSTS_COUNT = 100;

export const PHYSICS_CONFIG = {
  WALL_THICKNESS: 100,
  POST_RADIUS_BASE: 30, // Base radius for circular representation in physics
  POST_WIDTH_BASE: 120, // Approx width for pill
  POST_HEIGHT_BASE: 60, // Approx height for pill
};