import { GAME_DATA } from 'src/controller/gameData';
import { classNameToken } from './classToken';
import { css } from './css';
import { Observer } from './observer';

declare global {
  namespace App {
    type ClassInject = (inject: typeof classNameToken) => TStyleElement[];
    type Children = (string | Node | null | undefined | number)[];
    type ClassList = Parameters<HTMLElement['classList']['add']> | string[] | App.ClassInject;
  }
}

const notNullish = <T>(value: T) => value !== null && value !== undefined;

const stringifyChildren = (children: App.Children) => {
  const result: (string | Node)[] = [];

  for (let i = 0; i < children.length; i++) {
    if (notNullish(children[i])) {
      if (children[i] instanceof Node) {
        result.push(children[i] as Node);
        continue;
      }
      result.push(String(children[i]));
    }
  }

  return result;
};

function makeElement<K extends keyof HTMLElementTagNameMap>(tagName: K, classListTopLevel?: App.ClassList) {
  return (classList: App.ClassList | null = null, children?: App.Children) => {
    const element = document.createElement(tagName);

    if (children) {
      element.append(...stringifyChildren(children));
    }

    const classListTotal: App.ClassList & string[] = [];

    if (classListTopLevel) {
      if (Array.isArray(classListTopLevel)) {
        classListTotal.push(...classListTopLevel);
      } else {
        classListTopLevel(classNameToken).forEach(item => classListTotal.push(item.cn));
      }
    }

    if (classList) {
      if (Array.isArray(classList)) {
        classListTotal.push(...classList);
      } else {
        classList(classNameToken).forEach(item => classListTotal.push(item.cn));
      }
    }

    if (classListTotal.length) {
      element.classList.add(...classListTotal);
    }

    return element;
  };
}

export const div = makeElement('div');
export const hr = makeElement('hr');
export const button = makeElement('button');
export const span = makeElement('span');
export const label = makeElement('label');
export const input = makeElement('input');
export const output = makeElement('output');
export const template = makeElement('template');
export const icon_button = makeElement('button', i => [i.IconBtn]);
export const flex = makeElement('div', i => [i.DisplayFlex]);
export const grid = makeElement('div', i => [i.DisplayGrid]);
export const panel = makeElement('div', i => [i.Panel]);
export const carve = makeElement('div', i => [i.Carve]);
export const carve_btn = makeElement('div', i => [i.Carve, i.CarveBtnWrap]);
export const head = makeElement('head');
export const body = makeElement('body');
export const style = makeElement('style');
export const slot = makeElement('slot');
export const canvas = makeElement('canvas');
export const canvasCTX = () => canvas().getContext('2d');

export const TOKEN_HIDDEN = 'hidden';
const TOKEN_ACTIVE = 'active';

export function elemInjectClassList(element: HTMLElement, inject: App.ClassInject | string[] | null = null) {
  if (inject && inject instanceof Function) {
    inject(classNameToken).forEach(item => element.classList.add(item.cn));
  }

  if (inject && inject instanceof Array) {
    element.classList.add(...inject);
  }

  return element;
}

export function elemIsHidden(element: HTMLElement) {
  return element.classList.contains(TOKEN_HIDDEN);
}

export function elemHide(element: HTMLElement) {
  element.classList.add(TOKEN_HIDDEN);
}

export function elemShow(element: HTMLElement) {
  element.classList.remove(TOKEN_HIDDEN);
}

export function elemIsActive(element: HTMLElement) {
  return element.classList.contains(TOKEN_ACTIVE);
}

export function elemSetActive(element: HTMLElement, toggle?: boolean) {
  return element.classList.toggle(TOKEN_ACTIVE, toggle);
}

let elemId = 0;
const getElementGuiName = () => `ui-${elemId}`;
const elementNameMap = new Map<string, string>();
let id = 0;
const getClassNameToken = (token = 'cn') => `${token}-${id++}`;

export const unitPX = (value: number) => `${value}px`;
export const unitPC = (value: number) => `${value}%`;
export const unitEM = (value: number) => `${value}em`;

type UnitFunction = typeof unitPX | typeof unitPC | typeof unitEM;

export class GuiElement extends HTMLElement {
  protected $head = head();
  protected $slot = slot();

  protected $connected = new Observer(false);

  connectedCallback() {
    this.$connected.Set(true);
  }

  disconnectedCallback() {
    this.$connected.Set(false);
  }

  private getConstructorName() {
    return elementNameMap.get(this.tagName.toLowerCase());
  }

  constructor(...nodes: App.Children) {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(this.$head, this.$slot);
    this.append(...stringifyChildren(nodes));

    this.$addHostCss(css`
      display: block;
    `);

    GAME_DATA.SystemDebugState.Subscribe(isDebug => {
      const constructorName = this.getConstructorName();
      if (isDebug && constructorName) this.setAttribute('gui-name', constructorName);
      if (!isDebug) this.removeAttribute('gui-name');
    });
  }

  $setStyle(cssText: string) {
    this.style.cssText = cssText;
  }

  $setWidth(width: number, unit: UnitFunction = unitPX) {
    this.style.width = unit(width);
  }

  $setTransform(x: number, y: number, unit: UnitFunction = unitPX) {
    this.style.transform = `transform(${unit(x)},${unit(y)})`;
  }

  $addCss(cssStyle: string) {
    return this.$head.appendChild(style(null, [cssStyle]));
  }

  protected $addCssClass(cssStyle: string) {
    const constructorName = this.getConstructorName();
    const className = getClassNameToken(constructorName);
    const styleElem = this.$head.append(style(null, [`.${className}{${cssStyle}}`]));
    return { el: styleElem, cn: className };
  }

  protected $addHostCss(cssStyle: string) {
    const styleElem = style(null, [`:host{${cssStyle}}`]);
    this.$head.append(styleElem);
    return { el: styleElem };
  }

  protected $setStyleActive(styleElem: HTMLStyleElement, active: boolean) {
    if (!this.shadowRoot) return;
    if (!this.shadowRoot.styleSheets) return;
    const styleElementInSheet = Array.from(this.shadowRoot.styleSheets).find(i => i.ownerNode === styleElem);
    if (!styleElementInSheet) return;
    styleElementInSheet.disabled = !active;
  }
}

interface GuiElementConstructor {
  new (...params: any[]): GuiElement | HTMLElement;
}

export const defineElement = <T extends GuiElementConstructor, K extends keyof HTMLElementTagNameMap>(
  elementConstructor: T,
  name = getElementGuiName(),
  extendsElement?: K
) => {
  elemId++;
  elementNameMap.set(name, elementConstructor.name);
  if (extendsElement) {
    customElements.define(name, elementConstructor, { extends: extendsElement });
    return;
  }
  customElements.define(name, elementConstructor);
};
defineElement(GuiElement);
