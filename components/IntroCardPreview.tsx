import ProgressBadge from '@/components/ProgressBadge';
import type { IntroCardData, ThemeType } from '@/types/introCard';
import type { RefObject } from 'react';

type IntroCardPreviewProps = {
  data: IntroCardData;
  completion: number;
  cardRef: RefObject<HTMLDivElement>;
};

type ThemeStyle = {
  card: string;
  heading: string;
  accent: string;
  tag: string;
};

const themeStyles: Record<ThemeType, ThemeStyle> = {
  pop: {
    card: 'border-pink-300 bg-gradient-to-br from-rose-100 via-amber-50 to-sky-100 text-slate-800',
    heading: 'text-rose-600',
    accent: 'text-rose-700',
    tag: 'bg-rose-200 text-rose-700',
  },
  cool: {
    card: 'border-sky-400 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100',
    heading: 'text-sky-300',
    accent: 'text-sky-200',
    tag: 'bg-sky-300/20 text-sky-100 ring-1 ring-sky-200/35',
  },
  simple: {
    card: 'border-slate-300 bg-white text-slate-800',
    heading: 'text-slate-700',
    accent: 'text-slate-700',
    tag: 'bg-slate-100 text-slate-700',
  },
};

export default function IntroCardPreview({ data, completion, cardRef }: IntroCardPreviewProps) {
  const themeStyle = themeStyles[data.theme];
  const hobbies = data.hobbies.filter((hobby) => hobby.trim());
  const nickname = data.nickname.trim();
  const nicknameLabel = nickname ? (nickname.startsWith('@') ? nickname : `@${nickname}`) : '';

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900">カードプレビュー</h2>
      <div
        ref={cardRef}
        className={`mx-auto w-full max-w-xl rounded-3xl border-2 p-6 shadow-mellow sm:p-7 ${themeStyle.card}`}
      >
        <div className="flex items-start gap-4">
          {data.iconDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.iconDataUrl}
              alt={`${data.name || 'プロフィール'}のアイコン`}
              className="h-20 w-20 rounded-full border-2 border-white/70 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/70 bg-white/60 text-2xl font-bold text-slate-600">
              {data.name.trim().charAt(0) || '?'}
            </div>
          )}

          <div className="space-y-1">
            {data.name.trim() && <p className={`text-2xl font-black leading-tight ${themeStyle.heading}`}>{data.name}</p>}
            {nicknameLabel && <p className={`text-sm font-semibold ${themeStyle.accent}`}>{nicknameLabel}</p>}
            {!data.name.trim() && !nicknameLabel && (
              <p className="text-sm font-medium text-slate-500">名前を入力するとここに表示されます</p>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          {data.comment.trim() && (
            <p className="rounded-xl bg-white/60 px-3 py-2 leading-relaxed">{data.comment}</p>
          )}

          {hobbies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <span key={hobby} className={`rounded-full px-3 py-1 text-xs font-semibold ${themeStyle.tag}`}>
                  #{hobby}
                </span>
              ))}
            </div>
          )}

          {data.favoriteFood.trim() && (
            <p>
              <span className="mr-2 text-xs font-bold uppercase tracking-wider text-slate-500">Food</span>
              <span className="font-semibold">{data.favoriteFood}</span>
            </p>
          )}

          {data.favoriteColor.trim() && (
            <p>
              <span className="mr-2 text-xs font-bold uppercase tracking-wider text-slate-500">Color</span>
              <span className="font-semibold">{data.favoriteColor}</span>
            </p>
          )}
        </div>

        <div className="mt-6">
          <ProgressBadge completion={completion} className={data.theme === 'cool' ? 'text-slate-100' : 'text-slate-700'} />
        </div>
      </div>
    </div>
  );
}
