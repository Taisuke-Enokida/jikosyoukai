import type { IntroCardData } from '@/types/introCard';

export const calculateCompletion = (data: IntroCardData): number => {
  const checks = [
    data.name.trim().length > 0,
    data.nickname.trim().length > 0,
    data.comment.trim().length > 0,
    data.hobbies.some((hobby) => hobby.trim().length > 0),
    data.favoriteFood.trim().length > 0,
    data.favoriteColor.trim().length > 0,
    data.iconDataUrl.trim().length > 0,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.floor((completed / checks.length) * 100);
};
