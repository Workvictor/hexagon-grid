declare global {
  type TLocales = 'ru';
  type TLocaleData<DataType> = Record<TLocales, DataType>;
}

export function getDataByLocale<DataType>(data: TLocaleData<DataType>) {
  return data.ru;
}
