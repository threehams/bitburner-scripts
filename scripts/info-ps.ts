import { BitBurner } from "../types/bitburner";
import { allServers } from "./shared-all-servers";
import { makeTable } from "./shared-make-table";

type Action = "hack" | "grow" | "weaken";
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

export const main = async (ns: BitBurner) => {
  const sources = ["home"].concat(
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
  const table = Object.entries(processes)
    .map(([target, actions]) => {
      const hack = actions?.hack ?? 0;
      const grow = actions?.grow ?? 0;
      const weaken = actions?.weaken ?? 0;
      return {
        name: target,
        hack,
        grow,
        weaken,
        total: hack + grow + weaken,
      };
    })
    .sort((a, b) => {
      return ns.getServerRequiredHackingLevel(a.name) <
        ns.getServerRequiredHackingLevel(b.name)
        ? -1
        : 1;
    })
    .map(({ name, grow, hack, total, weaken }) => {
      return [
        hack.toFixed(0),
        grow.toFixed(0),
        weaken.toFixed(0),
        total.toFixed(0),
        name,
      ];
    });

  ns.tprint("total threads available: ", getTotalThreads(ns, sources));
  makeTable(
    [["hack", "grow", "weaken", "total", "name"]].concat(table)
  ).forEach((row) => {
    ns.tprint(row);
  });
};

const getTotalThreads = (
  ns: BitBurner,
  sources: string[],
  ram: number = 1.7
) => {
  return sources.reduce((sum, source) => {
    return sum + getThreadCount(ns, source, ram, true);
  }, 0);
};

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
