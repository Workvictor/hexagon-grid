export function fetchText(src: string, onprogress?: (loaded: number, total: number) => void) {
  return new Promise<string>(resolve => {
    const request = new XMLHttpRequest();
    request.onload = function onload() {
      resolve(this.responseText);
    };
    request.onprogress = onprogress ? e => onprogress(e.loaded, e.total) : null;
    request.open('get', src);
    request.send();
  });
}
