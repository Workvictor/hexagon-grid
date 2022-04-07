const join =
  (sep: string) =>
  (...values: any[]) =>
    values.filter(Boolean).join(sep);

export const joinMin = join('');
export const joinSpace = join(' ');
export const joinComma = join(',');
export const joinSemicolon = join(';');
export const joinColon = join(':');
export const joinHyphen = join('-');
export const cn = (...args: (string | number | null | undefined)[]) => joinSpace(...args.filter(Boolean));
