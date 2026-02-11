import Matter from 'matter-js'; // Fix: Import Matter to resolve namespace error

export interface Post {
  id: string;
  text: string;
  sentiment: SentimentType;
  color: string;
  createdAt: number;
  upvotes: number;
  isFlagged: boolean;
  position?: { x: number; y: number; angle: number }; // For physics syncing
}

export enum SentimentType {
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  EXCITING = 'exciting',
  NEUTRAL = 'neutral',
  LOVING = 'loving',
}

export interface CreatePostPayload {
  text: string;
}

export interface PhysicsBodyMap {
  [id: string]: Matter.Body;
}