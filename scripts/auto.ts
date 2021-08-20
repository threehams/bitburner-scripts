import { BitBurner } from "../types/bitburner";
import { buyServer, canBuyServer } from "./shared-buy-server";
import { nukeAll } from "./shared-nuke-all";
import { serverList } from "./shared-server-list";
import { SERVER_RAM } from "./shared-settings";

const SCRIPTS = {
  hack: "single-hack.js",
  grow: "single-grow.js",
};

export async function main(ns: BitBurner) {
  const verbose = ns.args.includes("-v");
  const once = ns.args.includes("-o");
  const grow = ns.args.includes("-g");
  const experience = ns.args.includes("-e");
  const home = ns.args.includes("-h");

  while (true) {
    nukeAll(ns);
    const serverRam = SERVER_RAM;
    while (canBuyServer(ns, serverRam)) {
      buyServer(ns, serverRam);
    }
    const sources = (home ? ["home"] : []).concat(ns.getPurchasedServers());

    const { action, target, runTime, ram } = await findBestTarget({
      ns,
      grow,
      sources,
      experience,
    });
    const totalThreads = getTotalThreads(ns, sources, ram);
    if (!totalThreads) {
      await ns.sleep(1000);
      continue;
    }

    for (const source of sources) {
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
    } target: ${target} on ${totalThreads} threads, ETA: ${(
      runTime / 1000
    ).toFixed(0)}s`;
    if (verbose) {
      ns.tprint(message);
    } else {
      ns.print(message);
    }

    await ns.sleep(1000);

    if (once) {
      return;
    }
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

type Target = {
  action: "hack" | "grow";
  target: string;
  runTime: number;
  ram: number;
};
const findBestTarget = async ({
  ns,
  grow,
  experience,
  sources,
}: {
  ns: BitBurner;
  grow: boolean;
  experience: boolean;
  sources: string[];
}): Promise<Target> => {
  const hackRam = ns.getScriptRam(SCRIPTS["hack"]);
  const growRam = ns.getScriptRam(SCRIPTS["grow"]);

  if (experience) {
    const target = (
      await serverList({
        ns,
        column: "hackLevel",
        sortOrder: "asc",
        threads: getTotalThreads(ns, sources, hackRam),
      })
    )[0].name;
    return {
      action: "hack",
      target,
      runTime: ns.getHackTime(target) * 1000,
      ram: hackRam,
    };
  } else if (grow) {
    const target = (
      await serverList({
        ns,
        column: "growRate",
        sortOrder: "desc",
        threads: getTotalThreads(ns, sources, hackRam),
      })
    )[0].name;
    return {
      action: "grow",
      target,
      runTime: ns.getGrowTime(target) * 1000,
      ram: growRam,
    };
  } else {
    const hackServer = (
      await serverList({
        ns,
        column: "hackRate",
        sortOrder: "desc",
        threads: getTotalThreads(ns, sources, hackRam),
      })
    )[0];
    const growServer = (
      await serverList({
        ns,
        column: "growRate",
        sortOrder: "desc",
        threads: getTotalThreads(ns, sources, growRam),
      })
    )[0];
    const hackTime = ns.getHackTime(hackServer.name) * 1000;
    const growTime = ns.getGrowTime(growServer.name) * 1000;
    const action = hackServer.hackRate > growServer.growRate ? "hack" : "grow";
    return {
      action,
      target: action === "grow" ? growServer.name : hackServer.name,
      runTime: action === "grow" ? growTime : hackTime,
      ram: action === "grow" ? growRam : hackRam,
    };
  }
};
