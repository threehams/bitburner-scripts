export const range = (start: number, end: number) =>
  Array.from(Array(end - start).keys()).map((index) => index + start);
