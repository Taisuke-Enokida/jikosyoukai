export type ThemeType = 'pop' | 'cool' | 'simple';

export type IntroCardData = {
  name: string;
  nickname: string;
  comment: string;
  hobbies: string[];
  favoriteFood: string;
  favoriteColor: string;
  iconDataUrl: string;
  theme: ThemeType;
};

export const initialCardData: IntroCardData = {
  name: '',
  nickname: '',
  comment: '',
  hobbies: ['', '', ''],
  favoriteFood: '',
  favoriteColor: '',
  iconDataUrl: '',
  theme: 'pop',
};
