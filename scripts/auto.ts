import { BitBurner } from "../types/bitburner";
import { serverList } from "./shared-server-list";

export async function main(ns: BitBurner) {
  const verbose = ns.args.includes("-v");
  const once = ns.args.includes("-o");
  const sources = ns.getPurchasedServers();

  while (true) {
    const hackServer = (await serverList(ns, "incomeRate", "desc"))[0];
    const growServer = (await serverList(ns, "growRate", "desc"))[0];
    const hackTime = (ns.getHackTime(hackServer.name) + 1) * 1000;
    const growTime = (ns.getGrowTime(growServer.name) + 1) * 1000;
    const script =
      hackServer.incomeRate > growServer.growRate * 2
        ? "single-hack.js"
        : "single-grow.js";

    const ram = ns.getScriptRam(script);
    const sleepTime = script === "single-grow.js" ? growTime : hackTime;

    const target =
      script === "single-grow.js" ? growServer.name : hackServer.name;

    const totalThreads = sources.reduce((sum, source) => {
      return sum + getThreadCount(ns, source, ram);
    }, 0);

    if (verbose) {
      ns.tprint(
        `${
          script === "single-grow.js" ? "growing" : "hacking"
        } target: ${target} on ${totalThreads} threads, ETA: ${(
          sleepTime / 1000
        ).toFixed(0)}s`
      );
    }

    for (const source of sources) {
      if (getThreadCount(ns, source, ram)) {
        ns.exec(script, source, getThreadCount(ns, source, ram), target);
      }
    }

    await ns.sleep(sleepTime);
    if (once) {
      return;
    }
  }
}

const getThreadCount = (ns: BitBurner, server: string, ram: number) => {
  const [totalRam, usedRam] = ns.getServerRam(server);
  return Math.floor((totalRam - usedRam) / ram);
};
