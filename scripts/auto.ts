import { BitBurner } from "../types/bitburner";
import { buyServer, canBuyServer } from "./shared-buy-server";
import { nukeAll } from "./shared-nuke-all";
import { serverList } from "./shared-server-list";
import { SERVER_RAM } from "./shared-settings";
import { upgradeServers } from "./shared-upgrade-servers";

type Action = "hack" | "grow" | "weaken";
const SCRIPTS = {
  hack: "single-hack.js",
  grow: "single-grow.js",
  weaken: "single-weaken.js",
} as const;

const SCRIPT_TYPES: { [key: string]: Action | undefined } = {
  "single-hack.js": "hack",
  "single-grow.js": "grow",
  "single-weaken.js": "weaken",
};

type Processes = {
  [target: string]:
    | {
        [action in Action]?: number;
      }
    | undefined;
};

export async function main(ns: BitBurner) {
  const verbose = ns.args.includes("-v");
  const once = ns.args.includes("-o");
  const home = ns.args.includes("-h");

  while (true) {
    nukeAll(ns);
    const serverRam = SERVER_RAM;
    while (canBuyServer(ns, serverRam)) {
      buyServer(ns, serverRam);
      totalThreadsCache = undefined;
    }
    const ramUpgrade = serverUpgradeRam(ns);
    if (ramUpgrade) {
      upgradeServers(ns, ramUpgrade);
      totalThreadsCache = undefined;
    }
    const sources = (home ? ["home"] : []).concat(ns.getPurchasedServers());
    const processes: Processes = {};
    for (const source of sources) {
      for (const info of ns.ps(source)) {
        const action = SCRIPT_TYPES[info.filename];
        const target = info.args[0];
        if (!action || !target) {
          continue;
        }

        processes[target] ??= {
          hack: 0,
          grow: 0,
          weaken: 0,
        };
        processes[target]![action]! += info.threads;
      }
    }

    const targets = isLowLevel(ns)
      ? [await findBestTarget({ ns, sources })]
      : (
          await serverList({
            ns,
            column: "maxServerMoney",
            sortOrder: "desc",
          })
        ).filter((target) => target.hasRoot);

    const fullSources = new Set<string>();
    for (const target of targets) {
      for (const source of sources) {
        if (fullSources.has(source)) {
          continue;
        }
        const { action, threads: maxThreads } = getBestAction(
          ns,
          target.name,
          sources
        );
        if (!action || !maxThreads) {
          break;
        }
        processes[target.name] ??= {
          hack: 0,
          grow: 0,
          weaken: 0,
        };
        const currentThreads = processes[target.name]![action]!;
        if (maxThreads === currentThreads) {
          break;
        }
        const ram = ns.getScriptRam(SCRIPTS[action]);
        const threads = Math.min(
          getThreadCount(ns, source, ram),
          Math.max(maxThreads - currentThreads, 0)
        );

        if (!threads) {
          fullSources.add(source);
        }
        if (threads) {
          if (verbose) {
            ns.tprint(
              `running ${SCRIPTS[action]} on ${source} with ${threads} threads against ${target.name}`
            );
          }
          ns.exec(SCRIPTS[action], source, threads, target.name);
          processes[target.name]![action]! += threads;
        }
        if (maxThreads === threads) {
          break;
        }
      }
    }

    // for (const source of sources) {
    //   const target = "foodnstuff";
    //   const action = "hack";
    //   const ram = ns.getScriptRam(SCRIPTS[action]);
    //   const threads = getThreadCount(ns, source, ram);
    //   if (!threads) {
    //     continue;
    //   }
    //   if (verbose) {
    //     ns.tprint(
    //       `grinding experience: running ${SCRIPTS[action]} on ${source} with ${threads} threads against ${target}`
    //     );
    //   }
    //   ns.exec(SCRIPTS[action], source, threads, target);
    // }

    await ns.sleep(1000);

    if (once) {
      return;
    }
  }
}

const getThreadCount = (
  ns: BitBurner,
  server: string,
  ram: number,
  max?: boolean
) => {
  const [totalRam, usedRam] = ns.getServerRam(server);
  const threads = Math.floor(
    (totalRam - (max ? 0 : usedRam) - (server === "home" ? 0 : 0)) / ram
  );
  // it happens
  return Math.max(0, threads);
};

const getAvailableThreads = (ns: BitBurner, sources: string[], ram: number) => {
  return sources.reduce((sum, source) => {
    return sum + getThreadCount(ns, source, ram);
  }, 0);
};

let totalThreadsCache: number | undefined = undefined;

const getTotalThreads = (ns: BitBurner, sources: string[], ram: number) => {
  if (totalThreadsCache !== undefined) {
    return totalThreadsCache;
  }
  const totalThreads = sources.reduce((sum, source) => {
    return sum + getThreadCount(ns, source, ram, true);
  }, 0);
  totalThreadsCache = totalThreads;
  return totalThreads;
};

const getBestAction = (
  ns: BitBurner,
  target: string,
  sources: string[]
): { action?: Action; threads?: number } => {
  const totalThreads = getTotalThreads(ns, sources, 1.7);
  if (ns.getServerMaxMoney(target) === 0) {
    return {};
  }
  if (isLowLevel(ns)) {
    return { action: "hack", threads: 5000 };
  }
  const securityLevel =
    ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);

  if (securityLevel > 1) {
    const threads = Math.ceil(securityLevel / 0.05);
    if (
      threads > totalThreads ||
      (ns.getWeakenTime(target) > 10 * 60 && !isHighLevel(ns))
    ) {
      return {};
    }
    return { action: "weaken", threads };
  } else if (
    ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) <
    0.96
  ) {
    const threads = Math.ceil(
      ns.growthAnalyze(
        target,
        ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) || 1)
      )
    );
    if (threads > totalThreads) {
      return {};
    }
    return {
      action: "grow",
      threads,
    };
  } else {
    const threads = Math.ceil(90 / ns.hackAnalyzePercent(target));
    return {
      action: "hack",
      threads,
    };
  }
};

const serverUpgradeRam = (ns: BitBurner) => {
  const servers = ns
    .getPurchasedServers()
    .slice()
    .sort((a, b) => {
      return ns.getServerRam(a) < ns.getServerRam(b) ? 1 : -1;
    });

  const [lowestRam] = ns.getServerRam(servers[0]);
  const upgradeCost = ns.getPurchasedServerCost(lowestRam * 4) * 13;

  if (ns.getServerMoneyAvailable("home") >= upgradeCost) {
    return Math.min(lowestRam * 4, ns.getPurchasedServerMaxRam());
  }
  return undefined;
};

const findBestTarget = async ({
  ns,
  sources,
}: {
  ns: BitBurner;
  sources: string[];
}) => {
  return (
    await serverList({
      ns,
      column: "hackRate",
      sortOrder: "desc",
      threads: getAvailableThreads(ns, sources, ns.getScriptRam(SCRIPTS.hack)),
    })
  )[0];
};

const isLowLevel = (ns: BitBurner) => {
  return getTotalThreads(ns, ns.getPurchasedServers(), 1.7) < 4700;
};

const isHighLevel = (ns: BitBurner) => {
  return getTotalThreads(ns, ns.getPurchasedServers(), 1.7) > 10000;
};
