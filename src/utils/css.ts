export const css = (tokens: TemplateStringsArray, ...args: (string | number)[]) => {
  let result = '';
  tokens.forEach((token, index) => {
    result += token + (args[index] || '');
  });
  return result;
};

let id = 0;
export const getClassNameToken = () => `cn_${id++}`;

export const globalStyle = (styleCSS: string) => {
  const styleElem = document.createElement('style');
  styleElem.innerHTML = styleCSS;
  document.head.appendChild(styleElem);
};

export const defineStyle = (styleCSS: string = '', className = getClassNameToken()) => {
  let refElement: CSSStyleSheet | null = null;

  if (styleCSS) {
    const styleElem = document.createElement('style');
    styleElem.innerHTML = `.${className}{${styleCSS}}`;
    document.head.appendChild(styleElem);
    const elemIndex = document.styleSheets.length - 1;
    refElement = document.styleSheets.item(elemIndex);
  }

  return {
    el: refElement,
    cn: className,
  };
};

export const defineGuiBlock = (w: number, h: number) =>
  defineStyle(css`
    width: ${w}px;
    height: ${h}px;
  `);

declare global {
  namespace App {
    type TStyleElement = ReturnType<typeof defineStyle>;
  }
}
