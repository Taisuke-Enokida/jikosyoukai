import { initialCardData, type IntroCardData, type ThemeType } from '@/types/introCard';

const STORAGE_KEY = 'self-intro-card-data';

const isThemeType = (value: unknown): value is ThemeType => {
  return value === 'pop' || value === 'cool' || value === 'simple';
};

const sanitizeString = (value: unknown): string => {
  return typeof value === 'string' ? value : '';
};

const normalizeData = (value: unknown): IntroCardData | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Partial<IntroCardData>;
  const hobbies = Array.isArray(raw.hobbies)
    ? raw.hobbies.filter((hobby): hobby is string => typeof hobby === 'string').slice(0, 3)
    : [];

  while (hobbies.length < 3) {
    hobbies.push('');
  }

  return {
    name: sanitizeString(raw.name),
    nickname: sanitizeString(raw.nickname),
    comment: sanitizeString(raw.comment),
    hobbies,
    favoriteFood: sanitizeString(raw.favoriteFood),
    favoriteColor: sanitizeString(raw.favoriteColor),
    iconDataUrl: sanitizeString(raw.iconDataUrl),
    theme: isThemeType(raw.theme) ? raw.theme : initialCardData.theme,
  };
};

export const saveCardData = (data: IntroCardData): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadCardData = (): IntroCardData | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return normalizeData(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const clearCardData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};
