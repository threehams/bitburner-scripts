import { BitBurner } from "../types/bitburner";
import { serverList } from "./shared-server-list";

const RAM_USAGE = 1.7;

export async function main(ns: BitBurner) {
  const verbose = ns.args[0] === "-v";
  const sources = ns.getPurchasedServers();

  while (true) {
    const hackServer = (await serverList(ns, "incomeRate", "desc"))[0];
    const growServer = (await serverList(ns, "growRate", "desc"))[0];
    const hackTime = (ns.getHackTime(hackServer.name) + 1) * 1000;
    const growTime = (ns.getGrowTime(growServer.name) + 1) * 1000;

    const script =
      hackServer.incomeRate > growServer.growRate
        ? "single-hack.js"
        : "single-grow.js";

    const target =
      script === "single-grow.js" ? growServer.name : hackServer.name;
    if (verbose) {
      ns.tprint(
        `${
          script === "single-grow.js" ? "growing" : "hacking"
        } target: ${target} from ${sources.length} servers`
      );
    }

    for (const source of sources) {
      ns.killall(source);

      if (getThreadCount(ns, source, RAM_USAGE)) {
        ns.exec(script, source, getThreadCount(ns, source, RAM_USAGE), target);
      }
    }

    await ns.sleep(script === "single-grow.js" ? growTime : hackTime);
  }
}

const getThreadCount = (ns: BitBurner, server: string, ram: number) => {
  const [totalRam, usedRam] = ns.getServerRam(server);
  return Math.floor((totalRam - usedRam) / ram);
};
