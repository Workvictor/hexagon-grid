import { template } from './element';

const templates = new Map<string, HTMLTemplateElement>();

export async function createFromTemplate<T extends HTMLElement>(src: string) {
  let tmpl = templates.get(src);
  if (tmpl) {
    return Promise.resolve(tmpl.content.cloneNode(true) as T);
  }
  tmpl = template();

  const r = await fetch(src);
  tmpl.innerHTML = await r.text();
  templates.set(src, tmpl);
  return tmpl.content.cloneNode(true) as T;
}
