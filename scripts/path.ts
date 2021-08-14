import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [source, target] = ns.args;
  if (!source || !target) {
    ns.tprint("Usage: run path.js [source] [target]");
  }

  ns.tprint(find(source, undefined, target, ns));
}

const find = (
  source: string,
  last: string | undefined,
  server: string,
  ns: BitBurner
): string[] => {
  if (source === server) {
    return [source];
  }
  const destinations = ns
    .scan(source)
    .filter((destination) => destination !== last);
  return destinations.flatMap((destination) => {
    const found = find(destination, source, server, ns);
    if (found.length) {
      return [source].concat(found);
    }
    return found;
  });
};
