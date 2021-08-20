import { BitBurner } from "../types/bitburner";
import { findArg } from "./shared-args";
import { buyServer, canBuyServer } from "./shared-buy-server";
import { nukeAll } from "./shared-nuke-all";
import { SERVER_RAM } from "./shared-settings";

const SCRIPTS = {
  hack: "single-hack.js",
  grow: "single-grow.js",
  weaken: "single-weaken.js",
};

// track
const pids: Record<string, number[]> = {};

export async function main(ns: BitBurner) {
  const home = findArg(ns.args, { key: "h", defaultValue: false });
  const verbose = findArg(ns.args, { key: "v", defaultValue: false });
  const target = ns.args.filter((arg) => !arg.startsWith("-"))[0];
  if (!target) {
    ns.tprint("usage: run cycle.js [target] [-h] [-v]");
    return;
  }

  while (true) {
    nukeAll(ns);
    const serverRam = SERVER_RAM;
    while (canBuyServer(ns, serverRam)) {
      buyServer(ns, serverRam);
    }
    const sources = (home ? ["home"] : []).concat(ns.getPurchasedServers());

    const totalThreads = getTotalThreads(ns, sources, 1.75);
    if (!totalThreads) {
      await ns.sleep(1000);
      continue;
    }
    const action = getBestAction(ns, target, sources);
    const ram = ns.getScriptRam(SCRIPTS[action]);

    for (const source of sources) {
      // const processes = ns.ps(source);
      if (getThreadCount(ns, source, ram)) {
        ns.exec(
          SCRIPTS[action],
          source,
          getThreadCount(ns, source, ram),
          target
        );
      }
    }

    const message = `${
      action === "grow"
        ? "growing"
        : action === "hack"
        ? "hacking"
        : "weakening"
    } target: ${target} on ${totalThreads} threads`;
    if (verbose) {
      ns.tprint(message);
    } else {
      ns.print(message);
    }

    await ns.sleep(1000);
  }
}

const getThreadCount = (ns: BitBurner, server: string, ram: number) => {
  const [totalRam, usedRam] = ns.getServerRam(server);
  return Math.floor((totalRam - usedRam - (server === "home" ? 8 : 0)) / ram);
};

const getTotalThreads = (ns: BitBurner, sources: string[], ram: number) => {
  return sources.reduce((sum, source) => {
    return sum + getThreadCount(ns, source, ram);
  }, 0);
};

const getBestAction = (ns: BitBurner, server: string, sources: string[]) => {
  if (
    ns.getServerSecurityLevel(server) >
    ns.getServerMinSecurityLevel(server) + 20
  ) {
    return "weaken";
  } else if (
    ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server) <
    0.4
  ) {
    return "grow";
  } else {
    return "hack";
  }
};
