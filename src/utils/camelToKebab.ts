export const camelToKebab = (str: string) =>
  str.slice(0, 1).toLowerCase() + str.slice(1).replace(/[A-Z]/g, '-$&').toLowerCase();
