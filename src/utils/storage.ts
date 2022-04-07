import { EStorageToken } from 'src/controller';
import { createDebounce } from './timer';

export function storage_write(token: EStorageToken, values: any) {
  window.localStorage.setItem(token, JSON.stringify(values));
}

export function storage_read<T extends any = any>(token: EStorageToken, fn: (value: Record<string, T>) => void) {
  const str = window.localStorage.getItem(token);
  if (str) {
    fn(JSON.parse(str));
  }
}

export function storage_write_debounce(token: EStorageToken) {
  return createDebounce(values => {
    storage_write(token, values);
  });
}
