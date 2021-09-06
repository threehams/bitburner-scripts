import { BitBurner } from "../types/bitburner";
import { allServers } from "./shared-all-servers";
import { buyPrograms } from "./shared-buy-programs";
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
  [target: string]: {
    [action in Action]?: number;
  };
};

export async function main(ns: BitBurner) {
  const {
    h: home,
    o: once,
    v: verbose,
    g: grindExperience,
    w: weakenOnly,
    target: singleTarget,
    hack: hackOnly,
  } = ns.flags([
    ["v", false],
    ["o", false],
    ["h", false],
    ["g", false],
    ["target", ""],
    ["w", false],
    ["hack", false],
  ]);

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
    buyPrograms(ns, getProgramCount(ns));
    const sources = (home ? ["home"] : []).concat(
      allServers(ns).filter((server) => ns.hasRootAccess(server))
    );
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
    verbose && ns.tprint("current threads: ");
    verbose && ns.tprint(processes);

    let targets;
    if (singleTarget) {
      const servers = await serverList({ ns });
      const target = servers.find((server) => server.name === singleTarget);
      if (!target) {
        ns.tprint(`No server found with name: ${target}`);
        return;
      }
      targets = [target];
    } else {
      targets = (
        await serverList({
          ns,
          column: "maxServerMoney",
          sortOrder: "desc",
        })
      ).filter((target) => target.hasRoot);
    }

    const fullSources = new Set<string>();
    for (const target of targets) {
      // verbose && ns.tprint("target: ", target.name);
      for (const source of sources) {
        if (fullSources.has(source)) {
          // verbose && ns.tprint(source, " is full, sorry");
          continue;
        }
        const { action, threads: maxThreads } = getBestAction({
          ns,
          target: target.name,
          sources,
          verbose,
          singleTarget: !!singleTarget,
          weakenOnly,
          hackOnly,
        });
        if (!action || !maxThreads) {
          break;
        }
        processes[target.name] ??= {
          hack: 0,
          grow: 0,
          weaken: 0,
        };
        const currentThreads = processes[target.name]![action]!;
        verbose &&
          ns.tprint(`already running ${action} with ${currentThreads} threads`);
        if (maxThreads === currentThreads) {
          break;
        }
        const ram = ns.getScriptRam(SCRIPTS[action]);
        const availableThreads = getThreadCount(ns, source, ram);
        if (!availableThreads) {
          fullSources.add(source);
          continue;
        }

        const threads = Math.min(
          availableThreads,
          Math.max(maxThreads - currentThreads, 0)
        );

        if (threads) {
          verbose &&
            ns.tprint(
              `running ${SCRIPTS[action]} on ${source} with ${threads} threads against ${target.name}`
            );
          ns.exec(SCRIPTS[action], source, threads, target.name);
          processes[target.name]![action]! += threads;
        }
        if (maxThreads === threads) {
          break;
        }
      }
    }

    if (grindExperience) {
      for (const source of sources) {
        const target = "foodnstuff";
        const action = "hack";
        const ram = ns.getScriptRam(SCRIPTS[action]);
        const threads = getThreadCount(ns, source, ram);
        if (!threads) {
          continue;
        }
        if (verbose) {
          ns.tprint(
            `grinding experience: running ${SCRIPTS[action]} on ${source} with ${threads} threads against ${target}`
          );
        }
        ns.exec(SCRIPTS[action], source, threads, target);
      }
    }

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

const getBestAction = ({
  ns,
  target,
  sources,
  verbose,
  singleTarget,
  weakenOnly,
  hackOnly,
}: {
  ns: BitBurner;
  target: string;
  sources: string[];
  verbose: boolean;
  singleTarget: boolean;
  weakenOnly: boolean;
  hackOnly: boolean;
}): { action?: Action; threads?: number } => {
  verbose && ns.tprint(`\ndetermining best action for ${target}`);
  const totalThreads = getTotalThreads(ns, sources, 1.7);
  if (ns.getServerMaxMoney(target) === 0) {
    verbose && ns.tprint(`server max money is 0`);
    return {};
  }
  const securityLevel =
    ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);

  if (securityLevel > 10 || (weakenOnly && securityLevel > 1 && !hackOnly)) {
    const threads = Math.ceil(securityLevel / 0.05);
    const highLevel = isHighLevel(ns, sources);
    const tooSlow =
      !isSuperLevel(ns, sources) &&
      ns.getWeakenTime(target) > (highLevel || weakenOnly ? 20 : 10) * 60;
    if ((threads > totalThreads || tooSlow) && !singleTarget) {
      verbose &&
        threads > totalThreads &&
        ns.tprint(
          `required weaken threads ${threads} < total threads ${totalThreads}`
        );
      verbose &&
        tooSlow &&
        ns.tprint(
          `required weaken time of ${ns
            .getWeakenTime(target)
            .toFixed(0)}s is too slow`
        );
      return {};
    }
    verbose && ns.tprint(`weakening with ${threads} threads`);
    return { action: "weaken", threads };
  }
  if (weakenOnly) {
    return {};
  }
  if (
    ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) < 0.96 &&
    !hackOnly
  ) {
    const threads = Math.ceil(
      ns.growthAnalyze(
        target,
        ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) || 1)
      )
    );
    if (
      threads > totalThreads * 3 &&
      !isHighLevel(ns, sources) &&
      !singleTarget
    ) {
      verbose &&
        ns.tprint(
          `required grow threads ${threads} < total threads ${totalThreads}`
        );
      return {};
    }
    verbose && ns.tprint(`growing with ${threads} threads`);
    return {
      action: "grow",
      threads,
    };
  } else {
    const threads = Math.ceil(50 / ns.hackAnalyzePercent(target));
    verbose && ns.tprint(`hacking with ${threads} threads`);
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

  if (!servers.length) {
    return undefined;
  }
  const [lowestRam] = ns.getServerRam(servers[0]);
  const upgradeCost = ns.getPurchasedServerCost(lowestRam * 4) * 13;

  if (ns.getServerMoneyAvailable("home") >= upgradeCost) {
    return Math.min(lowestRam * 4, ns.getPurchasedServerMaxRam());
  }
  return undefined;
};

const isHighLevel = (ns: BitBurner, sources: string[]) => {
  return getTotalThreads(ns, sources, 1.7) > 10000;
};

const isSuperLevel = (ns: BitBurner, sources: string[]) => {
  return getTotalThreads(ns, sources, 1.7) > 500000;
};

const getProgramCount = (ns: BitBurner) => {
  const hackLevel = ns.getHackingLevel();

  if (hackLevel > 800) {
    return 5;
  } else if (hackLevel > 500) {
    return 4;
  } else if (hackLevel > 325) {
    return 3;
  } else if (hackLevel > 100) {
    return 2;
  }
  return 1;
};
