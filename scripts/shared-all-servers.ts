import { BitBurner } from "../types/bitburner";

export const allServers = (ns: BitBurner) => {
  ns.scan;
  return ns
    .getPurchasedServers()
    .concat(
      dive("home", "home", ns).filter(
        (name) => name !== "home" && !name.startsWith("drone")
      )
    );
};

const dive = (source: string, last: string, ns: BitBurner): string[] => {
  return ns
    .scan(source)
    .flatMap((server) => {
      if (server === last) {
        return [];
      }
      return dive(server, source, ns);
    })
    .concat([source]);
};
