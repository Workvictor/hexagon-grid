import { ILocale, ITextData, TextData } from 'src/data/locale';
import { span } from 'src/utils/element';

export function GuiText(getter: (data: ITextData) => string, fabric = span) {
  const elem = fabric();
  const locale: ILocale = 'RU';
  elem.textContent = getter(TextData[locale]);
  return elem;
}
