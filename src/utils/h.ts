import { div } from './element';

const creatorsMap = new Map<keyof JSX.IntrinsicElementMap, () => HTMLElement>();
creatorsMap.set('div', div);

export function h<T extends keyof JSX.IntrinsicElementMap>(
  Component: T | JSX.ComponentConstructor,
  props: JSX.Props,
  ...children: Node[]
) {
  if (!props) {
    props = {};
  }

  if (typeof Component === 'function') {
    return Component(props, children);
  }

  const elementCreator = creatorsMap.get(Component);

  const element = elementCreator ? elementCreator() : document.createElement(Component);

  Object.keys(props).forEach(propName => {
    if (propName && props && propName in props) {
      const value = props[propName as keyof JSX.Attributes];      
      if (value) {
        (element as any)[propName] = value;
      }
    }
  });

  for (let child of children) {
    if (typeof child === 'string') {
      element.innerText += child;
      continue;
    }
    if (Array.isArray(child)) {
      element.append(...child);
      continue;
    }
    element.appendChild(child);
  }
  return element;
}
