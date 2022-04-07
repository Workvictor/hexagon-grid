import { EDevTool } from 'src/types';

/** хранит ключ-значение для перевода */
const data: Record<string, string> = {};
/** Выполнять сразу после сборки интерфейса */
export function collectUiTextData(context: HTMLElement) {
  const uiText = context.querySelectorAll<HTMLElement>('[data-text]');
  uiText.forEach(elem => {
    const { text } = elem.dataset;
    if (!elem.textContent) {
      console.error(`Отсутствует перевод для ключа ${text}`, elem);
      return;
    }
    if (!text) {
      console.error(`Отсутствует ключ перевода [data-text]`, elem);
      return;
    }
    if (data[text] && data[text] !== elem.textContent) {
      console.error(`Дубликат перевода [data-text] ${text}`, elem);
    }
    data[text] = elem.textContent;
  });
}

/** Показывает кнопки */
export function activateDevTools(context: HTMLElement) {
  const tools = context.querySelectorAll<HTMLElement>('[data-dev-tool]');
  tools.forEach(tool => {
    switch (tool.dataset.devTool) {
      case EDevTool.extractTextData:
        tool.textContent = EDevTool.extractTextData;
        tool.onclick = () => {
          const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'text-data';
          link.click();
        };

        break;
    }
  });
}
