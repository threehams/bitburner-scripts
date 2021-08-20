import { BitBurner } from "../types/bitburner";

export const findPath = (
  ns: BitBurner,
  source: string,
  last: string | undefined,
  server: string
): string[] => {
  if (source === server) {
    return [source];
  }
  const destinations = ns
    .scan(source)
    .filter((destination) => destination !== last);
  return destinations.flatMap((destination) => {
    const found = findPath(ns, destination, source, server);
    if (found.length) {
      return [source].concat(found);
    }
    return found;
  });
};
