import RU from './ru';

export type ILocale = keyof typeof TextData;
export type ITextData = typeof RU;

export const TextData = {
  RU,
};