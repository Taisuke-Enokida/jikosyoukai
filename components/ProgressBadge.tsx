type ProgressBadgeProps = {
  completion: number;
  className?: string;
};

const getLabel = (completion: number): string => {
  if (completion < 40) return '作成中';
  if (completion < 80) return 'もうすぐ完成';
  return '完成';
};

export default function ProgressBadge({ completion, className = '' }: ProgressBadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-current/25 bg-white/70 px-3 py-1 text-sm font-semibold backdrop-blur ${className}`}
      aria-live="polite"
    >
      完成度 {completion}% / {getLabel(completion)}
    </div>
  );
}
