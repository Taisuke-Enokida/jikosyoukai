import ImageUploader from '@/components/ImageUploader';
import ThemeSelector from '@/components/ThemeSelector';
import type { IntroCardData, ThemeType } from '@/types/introCard';

type TextField = 'name' | 'nickname' | 'comment' | 'favoriteFood' | 'favoriteColor';

type IntroCardFormProps = {
  data: IntroCardData;
  imageError: string;
  onTextChange: (field: TextField, value: string) => void;
  onHobbyChange: (index: number, value: string) => void;
  onThemeChange: (theme: ThemeType) => void;
  onImageChange: (dataUrl: string) => void;
  onImageError: (message: string) => void;
  onReset: () => void;
};

const inputBaseClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200';

export default function IntroCardForm({
  data,
  imageError,
  onTextChange,
  onHobbyChange,
  onThemeChange,
  onImageChange,
  onImageError,
  onReset,
}: IntroCardFormProps) {
  return (
    <form className="space-y-4 rounded-3xl bg-white/85 p-5 shadow-mellow ring-1 ring-black/5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">入力フォーム</h2>

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-semibold text-slate-700">
          名前（必須）
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(event) => onTextChange('name', event.target.value.slice(0, 20))}
          maxLength={20}
          className={inputBaseClass}
          placeholder="例: 田中 花子"
          aria-describedby="name-help"
        />
        <p id="name-help" className="text-xs text-slate-500">
          20文字以内
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="nickname" className="text-sm font-semibold text-slate-700">
          ニックネーム
        </label>
        <input
          id="nickname"
          type="text"
          value={data.nickname}
          onChange={(event) => onTextChange('nickname', event.target.value.slice(0, 20))}
          maxLength={20}
          className={inputBaseClass}
          placeholder="例: はなちゃん"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="comment" className="text-sm font-semibold text-slate-700">
          一言コメント
        </label>
        <textarea
          id="comment"
          value={data.comment}
          onChange={(event) => onTextChange('comment', event.target.value.slice(0, 60))}
          maxLength={60}
          rows={3}
          className={inputBaseClass}
          placeholder="例: 休日はカフェめぐりをしています"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">趣味（最大3つ）</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {data.hobbies.map((hobby, index) => (
            <input
              key={`hobby-${index + 1}`}
              aria-label={`趣味${index + 1}`}
              type="text"
              value={hobby}
              onChange={(event) => onHobbyChange(index, event.target.value.slice(0, 15))}
              maxLength={15}
              className={inputBaseClass}
              placeholder={`趣味${index + 1}`}
            />
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="favoriteFood" className="text-sm font-semibold text-slate-700">
            好きな食べ物
          </label>
          <input
            id="favoriteFood"
            type="text"
            value={data.favoriteFood}
            onChange={(event) => onTextChange('favoriteFood', event.target.value.slice(0, 20))}
            maxLength={20}
            className={inputBaseClass}
            placeholder="例: お寿司"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="favoriteColor" className="text-sm font-semibold text-slate-700">
            好きな色
          </label>
          <input
            id="favoriteColor"
            type="text"
            value={data.favoriteColor}
            onChange={(event) => onTextChange('favoriteColor', event.target.value.slice(0, 20))}
            maxLength={20}
            className={inputBaseClass}
            placeholder="例: ターコイズ"
          />
        </div>
      </div>

      {!data.name.trim() && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700" role="status">
          名前を入れると完成度が上がります
        </p>
      )}

      <ImageUploader
        hasImage={Boolean(data.iconDataUrl)}
        error={imageError}
        onChange={onImageChange}
        onError={onImageError}
      />

      <ThemeSelector value={data.theme} onChange={onThemeChange} />

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        入力内容をリセット
      </button>
    </form>
  );
}
