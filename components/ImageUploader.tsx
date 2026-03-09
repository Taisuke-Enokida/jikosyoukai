import { ChangeEvent } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type ImageUploaderProps = {
  hasImage: boolean;
  error: string;
  onChange: (dataUrl: string) => void;
  onError: (message: string) => void;
};

export default function ImageUploader({ hasImage, error, onChange, onError }: ImageUploaderProps) {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError('画像は jpg / png / webp のみ対応しています');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        onChange(result);
        onError('');
      }
    };
    reader.onerror = () => {
      onError('画像の読み込みに失敗しました');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="icon" className="text-sm font-semibold text-slate-700">
        アイコン画像（任意）
      </label>
      <input
        id="icon"
        name="icon"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
        aria-describedby="icon-help icon-error"
      />
      <p id="icon-help" className="text-xs text-slate-500">
        jpg / png / webp のみ。大きい画像でもカードでは丸く表示されます。
      </p>
      {hasImage && !error && <p className="text-xs font-medium text-emerald-700">画像を設定済みです</p>}
      {error && (
        <p id="icon-error" className="text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
