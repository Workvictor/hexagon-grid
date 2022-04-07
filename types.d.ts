declare type Nullable<T> = T | null | undefined;

// declare type Children<T extends any = string | Node> = T[];
declare type m_bool = 0 | 1;
declare type ParamsOf<T extends (...args: any) => any> = Parameters<T>;
declare type ObjSetter<T> = (setter: T) => T[keyof T];
declare type ObjSetterList<T> = (setter: T) => T[keyof T][];

declare namespace JSX {
  type Element = HTMLElement;
  type FC<P extends {}, T = JSX.Element> = (classList?: App.ClassInject | string[] | null, props?: P) => T;
  type Attributes = Pick<JSX.Element, 'id' | 'onclick' | 'className'>;

  interface IntrinsicElements extends IntrinsicElementMap {}
  type IntrinsicElementMap = {
    // [K in keyof HTMLElementTagNameMap]: Partial<Attributes>;
    div: Partial<Attributes>;
  };

  type Props = Partial<{
    [Property in keyof Attributes]: Attributes[Property];
  }> | null;

  interface ComponentConstructor {
    (props?: JSX.Props, children?: Node[]): Node;
  }
}

declare type TStateSubscriber<T> = (state: T, prevState: T) => void | 0 | 1;

declare interface DOMStringMap {
  text?: string;
  view?: string;
  page?: string;
  link?: string;
  // icon: string;
  visible?: '0' | '1';
  component_name?: string;
}

declare type ImportChunkMap = () => Promise<{
  default: string;
}>;

declare interface HTMLElementTagNameMap {
  name: HTMLElement;
  text: HTMLElement;
  step: HTMLElement;
}
