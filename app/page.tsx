'use client';

import { mbtiQuestions, type MbtiPole } from '@/lib/mbtiQuestions';
import { useEffect, useMemo, useState } from 'react';

type Phase = 'ready' | 'playing' | 'result';

type PoleScores = Record<MbtiPole, number>;

type Answer = {
  questionId: string;
  selectedIndex: number;
  isIntj: boolean;
};

type QuizStats = {
  bestIntjScore: number;
  playCount: number;
  lastType: string;
  lastPlayedAt: string;
};

const STATS_KEY = 'intj-quiz-stats-v1';

const initialPoleScores: PoleScores = {
  I: 0,
  E: 0,
  N: 0,
  S: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0,
};

const initialStats: QuizStats = {
  bestIntjScore: 0,
  playCount: 0,
  lastType: '-',
  lastPlayedAt: '',
};

const asSafeNumber = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};

const asSafeString = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

const loadStats = (): QuizStats => {
  if (typeof window === 'undefined') {
    return initialStats;
  }

  const raw = window.localStorage.getItem(STATS_KEY);
  if (!raw) {
    return initialStats;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<QuizStats>;
    return {
      bestIntjScore: Math.max(0, Math.floor(asSafeNumber(parsed.bestIntjScore))),
      playCount: Math.max(0, Math.floor(asSafeNumber(parsed.playCount))),
      lastType: asSafeString(parsed.lastType) || '-',
      lastPlayedAt: asSafeString(parsed.lastPlayedAt),
    };
  } catch {
    return initialStats;
  }
};

const saveStats = (stats: QuizStats): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

const formatDateTime = (isoText: string): string => {
  if (!isoText) {
    return '未プレイ';
  }

  const date = new Date(isoText);
  if (Number.isNaN(date.getTime())) {
    return '未プレイ';
  }

  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getRankMessage = (rate: number): string => {
  if (rate >= 95) return 'INTJマスター。戦略家の思考がかなり安定しています。';
  if (rate >= 80) return 'かなりINTJ寄り。あと少しでほぼ完璧。';
  if (rate >= 65) return 'INTJの傾向がしっかり出ています。';
  if (rate >= 50) return 'バランス型。状況で使い分けるタイプです。';
  return 'INTJ以外の魅力も強め。別タイプも含めて楽しめます。';
};

const getWinningPole = (scores: PoleScores, intjPole: MbtiPole, oppositePole: MbtiPole): MbtiPole => {
  const intjValue = scores[intjPole];
  const oppositeValue = scores[oppositePole];
  if (intjValue === oppositeValue) {
    return intjPole;
  }
  return intjValue > oppositeValue ? intjPole : oppositePole;
};

export default function Home() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [intjScore, setIntjScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [poleScores, setPoleScores] = useState<PoleScores>(initialPoleScores);
  const [stats, setStats] = useState<QuizStats>(initialStats);

  const totalQuestions = mbtiQuestions.length;
  const currentQuestion = mbtiQuestions[questionIndex];

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const completionRate = useMemo(() => {
    if (totalQuestions === 0) {
      return 0;
    }
    const solvedCount = selectedChoice === null ? questionIndex : questionIndex + 1;
    return Math.floor((solvedCount / totalQuestions) * 100);
  }, [questionIndex, selectedChoice, totalQuestions]);

  const predictedType = useMemo(() => {
    const ie = getWinningPole(poleScores, 'I', 'E');
    const ns = getWinningPole(poleScores, 'N', 'S');
    const tf = getWinningPole(poleScores, 'T', 'F');
    const jp = getWinningPole(poleScores, 'J', 'P');
    return `${ie}${ns}${tf}${jp}`;
  }, [poleScores]);

  const intjRate = useMemo(() => {
    if (totalQuestions === 0) {
      return 0;
    }
    return Math.round((intjScore / totalQuestions) * 100);
  }, [intjScore, totalQuestions]);

  const pairStats = useMemo(() => {
    const pairs: Array<{ left: MbtiPole; right: MbtiPole; label: string }> = [
      { left: 'I', right: 'E', label: 'I / E' },
      { left: 'N', right: 'S', label: 'N / S' },
      { left: 'T', right: 'F', label: 'T / F' },
      { left: 'J', right: 'P', label: 'J / P' },
    ];

    return pairs.map((pair) => {
      const leftValue = poleScores[pair.left];
      const rightValue = poleScores[pair.right];
      const total = leftValue + rightValue;
      const leftRate = total === 0 ? 50 : Math.round((leftValue / total) * 100);
      return {
        ...pair,
        leftValue,
        rightValue,
        leftRate,
      };
    });
  }, [poleScores]);

  const startQuiz = () => {
    setPhase('playing');
    setQuestionIndex(0);
    setSelectedChoice(null);
    setIntjScore(0);
    setAnswers([]);
    setPoleScores(initialPoleScores);
  };

  const handleChoiceSelect = (choiceIndex: number) => {
    if (selectedChoice !== null) {
      return;
    }

    const choice = currentQuestion.choices[choiceIndex];
    const isIntj = choiceIndex === currentQuestion.intjChoiceIndex;

    setSelectedChoice(choiceIndex);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: choiceIndex,
        isIntj,
      },
    ]);

    setPoleScores((prev) => ({
      ...prev,
      [choice.pole]: prev[choice.pole] + choice.points,
    }));

    if (isIntj) {
      setIntjScore((prev) => prev + 1);
    }
  };

  const moveNext = () => {
    if (selectedChoice === null) {
      return;
    }

    if (questionIndex === totalQuestions - 1) {
      const nextStats: QuizStats = {
        bestIntjScore: Math.max(stats.bestIntjScore, intjScore),
        playCount: stats.playCount + 1,
        lastType: predictedType,
        lastPlayedAt: new Date().toISOString(),
      };

      setStats(nextStats);
      saveStats(nextStats);
      setPhase('result');
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelectedChoice(null);
  };

  const resetStats = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STATS_KEY);
    }
    setStats(initialStats);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-white/50 bg-white/85 p-6 shadow-mellow backdrop-blur sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">MBTI INTJ Challenge</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">30問で遊ぶ INTJ診断クイズ</h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            各問題で「INTJらしい選択肢」を正解として採点します。最後に推定MBTIタイプも表示します。
          </p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-cyan-100/80 px-3 py-2 text-cyan-900">
              ベストINTJ一致: {stats.bestIntjScore} / {totalQuestions}
            </div>
            <div className="rounded-xl bg-amber-100/80 px-3 py-2 text-amber-900">プレイ回数: {stats.playCount}</div>
            <div className="rounded-xl bg-violet-100/80 px-3 py-2 text-violet-900">
              前回タイプ: {stats.lastType}（{formatDateTime(stats.lastPlayedAt)}）
            </div>
          </div>
        </header>

        {phase === 'ready' && (
          <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-mellow sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">遊び方</h2>
            <p className="mt-2 text-sm text-slate-600">
              30問すべて4択です。回答後すぐに「INTJ正解」が表示されるので、テンポよく進められます。
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startQuiz}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                クイズ開始
              </button>
              <button
                type="button"
                onClick={resetStats}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                記録リセット
              </button>
            </div>
          </section>
        )}

        {phase === 'playing' && (
          <section className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-mellow sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold text-cyan-700">
                Q{questionIndex + 1} / {totalQuestions}
              </p>
              <p className="text-sm font-semibold text-slate-700">INTJ一致: {intjScore} 問</p>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Dimension: {currentQuestion.dimension}
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">{currentQuestion.prompt}</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {currentQuestion.choices.map((choice, index) => {
                const isAnswered = selectedChoice !== null;
                const isSelected = selectedChoice === index;
                const isCorrect = currentQuestion.intjChoiceIndex === index;

                let buttonClass = 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50';

                if (isAnswered && isCorrect) {
                  buttonClass = 'border-emerald-500 bg-emerald-100 text-emerald-900';
                } else if (isAnswered && isSelected && !isCorrect) {
                  buttonClass = 'border-rose-500 bg-rose-100 text-rose-900';
                }

                return (
                  <button
                    key={`${currentQuestion.id}-${index}`}
                    type="button"
                    onClick={() => handleChoiceSelect(index)}
                    disabled={isAnswered}
                    className={`rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${buttonClass} disabled:cursor-not-allowed`}
                  >
                    {choice.text}
                  </button>
                );
              })}
            </div>

            {selectedChoice !== null && (
              <div className="mt-5 space-y-4">
                <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{currentQuestion.explanation}</p>
                <button
                  type="button"
                  onClick={moveNext}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  {questionIndex === totalQuestions - 1 ? '結果を見る' : '次の問題へ'}
                </button>
              </div>
            )}
          </section>
        )}

        {phase === 'result' && (
          <section className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-mellow sm:p-8">
            <p className="text-sm font-semibold text-cyan-700">RESULT</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">推定タイプ: {predictedType}</h2>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {intjScore} / {totalQuestions}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-700">INTJ一致率 {intjRate}%</p>
            <p className="mt-3 rounded-xl bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-900">{getRankMessage(intjRate)}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {pairStats.map((pair) => (
                <div key={pair.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold tracking-wider text-slate-500">{pair.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {pair.left}: {pair.leftValue} / {pair.right}: {pair.rightValue}
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{ width: `${pair.leftRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <details className="mt-5 rounded-xl bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">回答一覧を表示</summary>
              <ul className="mt-3 space-y-2 text-sm">
                {mbtiQuestions.map((question, index) => {
                  const answer = answers[index];
                  const resultText = answer?.isIntj ? 'INTJ正解' : '別タイプ回答';
                  const resultClass = answer?.isIntj ? 'text-emerald-700' : 'text-rose-700';
                  return (
                    <li key={question.id} className="rounded-lg bg-white px-3 py-2">
                      <span className="mr-2 font-bold text-slate-700">Q{index + 1}</span>
                      <span className={resultClass}>{resultText}</span>
                    </li>
                  );
                })}
              </ul>
            </details>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startQuiz}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                もう一度遊ぶ
              </button>
              <button
                type="button"
                onClick={() => setPhase('ready')}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                タイトルへ戻る
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
