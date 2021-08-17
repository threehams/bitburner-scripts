import { BitBurner } from "../types/bitburner";
import { serverList } from "./shared-server-list";

const RAM_USAGE = 1.7;

export async function main(ns: BitBurner) {
  const sources = ns.getPurchasedServers();

  while (true) {
    const target =
      ns.args[0] ??
      (await serverList({ ns, column: "growRate", sortOrder: "desc" })).filter(
        (server) => server.hasRoot
      )[0].name;
    const hackTime = (ns.getGrowTime(target) + 1) * 1000;

    for (const source of sources) {
      ns.killall(source);

      if (getThreadCount(ns, source, RAM_USAGE)) {
        ns.exec(
          "single-grow.js",
          source,
          getThreadCount(ns, source, RAM_USAGE),
          target
        );
      }
    }

    await ns.sleep(hackTime);
  }
}

const getThreadCount = (ns: BitBurner, server: string, ram: number) => {
  const [totalRam, usedRam] = ns.getServerRam(server);
  return Math.floor((totalRam - usedRam) / ram);
};
