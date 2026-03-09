export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
};

export type QuizAnswer = {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
};

export type QuizStats = {
  bestScore: number;
  playCount: number;
  lastScore: number;
  lastPlayedAt: string;
};

export const initialQuizStats: QuizStats = {
  bestScore: 0,
  playCount: 0,
  lastScore: 0,
  lastPlayedAt: '',
};
