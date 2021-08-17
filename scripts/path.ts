import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [server1, server2] = ns.args;
  if (!server1) {
    ns.tprint("Usage: run path.js [source] [target]");
    return;
  }

  let source, target;
  if (!server2) {
    source = ns.getHostname();
    target = server1;
  } else {
    source = server1;
    target = server2;
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
