import { BitBurner } from "../types/bitburner";

export const waitFor = async <T extends unknown>(
  ns: BitBurner,
  callback: () => T | Promise<T> | undefined,
  timeout: number = 60000
): Promise<T> => {
  let timer = 0;

  while (timer < timeout) {
    const result = await callback();
    if (result !== undefined) {
      return result;
    }
    // silly but works for now
    timer += 50;
    await ns.sleep(50);
  }
  throw new Error(`waitFor failed after ${timeout}s`);
};
