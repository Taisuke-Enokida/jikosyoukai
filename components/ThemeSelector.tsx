import type { ThemeType } from '@/types/introCard';

type ThemeSelectorProps = {
  value: ThemeType;
  onChange: (theme: ThemeType) => void;
};

const themes: { id: ThemeType; label: string }[] = [
  { id: 'pop', label: 'Pop' },
  { id: 'cool', label: 'Cool' },
  { id: 'simple', label: 'Simple' },
];

export default function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-slate-700">テーマ</legend>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => {
          const active = theme.id === value;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
              aria-pressed={active}
            >
              {theme.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
