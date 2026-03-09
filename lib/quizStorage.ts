import { initialQuizStats, type QuizStats } from '@/types/quiz';

const QUIZ_STATS_KEY = 'visitor-quiz-stats';

const asFiniteNumber = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};

const asString = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

const normalizeStats = (value: unknown): QuizStats => {
  if (!value || typeof value !== 'object') {
    return initialQuizStats;
  }

  const raw = value as Partial<QuizStats>;

  return {
    bestScore: Math.max(0, Math.floor(asFiniteNumber(raw.bestScore))),
    playCount: Math.max(0, Math.floor(asFiniteNumber(raw.playCount))),
    lastScore: Math.max(0, Math.floor(asFiniteNumber(raw.lastScore))),
    lastPlayedAt: asString(raw.lastPlayedAt),
  };
};

export const loadQuizStats = (): QuizStats => {
  if (typeof window === 'undefined') {
    return initialQuizStats;
  }

  const raw = window.localStorage.getItem(QUIZ_STATS_KEY);
  if (!raw) {
    return initialQuizStats;
  }

  try {
    return normalizeStats(JSON.parse(raw));
  } catch {
    return initialQuizStats;
  }
};

export const saveQuizStats = (stats: QuizStats): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
};

export const clearQuizStats = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(QUIZ_STATS_KEY);
};
