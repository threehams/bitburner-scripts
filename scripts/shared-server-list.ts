import { BitBurner } from "../types/bitburner";
import { canNuke } from "./shared-can-nuke";

export const COLUMNS = [
  "hackLevel",
  "hackValue",
  "hackRate",
  "hasRoot",
  "name",
  "nukable",
  "security",
  "serverMoney",
  "maxServerMoney",
  "growRate",
  "fullGrowTime",
] as const;
export type Column = typeof COLUMNS[number];
export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const serverList = async ({
  ns,
  column = "hackLevel",
  sortOrder = "asc",
  threads = 1,
}: {
  ns: BitBurner;
  column?: Column;
  sortOrder?: SortOrder;
  threads?: number;
}) => {
  const owned = ["home"].concat(ns.getPurchasedServers());
  ns.growthAnalyze; // force this to be calculated for RAM usage
  ns.getHackTime;

  const servers = dive("home", "home", ns)
    .slice()
    .sort((a, b) => {
      return ns.getServerRequiredHackingLevel(a) >
        ns.getServerRequiredHackingLevel(b)
        ? 1
        : -1;
    });

  return servers
    .filter((server) => !owned.includes(server))
    .map((server) => {
      const hasRoot = ns.hasRootAccess(server);
      const nukable = canNuke(ns, server);
      const serverMoney = ns.getServerMoneyAvailable(server);
      const maxServerMoney = ns.getServerMaxMoney(server);
      const hackValue = hasRoot
        ? Math.min(
            serverMoney,
            (ns.hackAnalyzePercent(server) / 100) *
              serverMoney *
              ns.hackChance(server) *
              threads
          )
        : 0;
      const hackRate = hackValue / ns.getHackTime(server);
      const growCount = ns.growthAnalyze(server, 2);
      const growValue = hasRoot
        ? Math.min(serverMoney * threads, maxServerMoney - serverMoney)
        : 0;
      const growTime = ns.getGrowTime(server);
      const growRate = growValue / (Math.max(growCount, 1) * growTime);
      const fullGrowTime =
        serverMoney > 0
          ? (ns.growthAnalyze(server, maxServerMoney / serverMoney) *
              ns.getGrowTime(server)) /
            threads
          : 0;
      const percentMoney =
        ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server) || 0;

      return {
        fullGrowTime,
        growRate,
        hackLevel: ns.getServerRequiredHackingLevel(server),
        hackRate,
        hackValue,
        hasRoot,
        name: server,
        nukable,
        percentMoney,
        ports: ns.getServerNumPortsRequired(server),
        security: ns.getServerSecurityLevel(server),
        minSecurity: ns.getServerMinSecurityLevel(server),
        serverMoney,
        maxServerMoney,
        threadsToHack: threadsToHack(ns, server),
        timeToHack: ns.getHackTime(server),
        threadsToGrow: threadsToGrow(ns, server),
        timeToGrow: ns.getGrowTime(server),
        threadsToWeaken: threadsToWeaken(ns, server),
        timeToWeaken: ns.getWeakenTime(server),
      };
    })
    .sort((a, b) => {
      const modifier = sortOrder === "desc" ? -1 : 1;
      return a[column] > b[column] ? 1 * modifier : -1 * modifier;
    });
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

const threadsToWeaken = (ns: BitBurner, target: string) => {
  if (ns.getServerMaxMoney(target) === 0) {
    return 0;
  }
  const securityLevel =
    ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
  return Math.ceil(securityLevel / 0.05);
};

const threadsToHack = (ns: BitBurner, target: string) => {
  if (ns.getServerMaxMoney(target) === 0) {
    return 0;
  }
  return Math.ceil(90 / ns.hackAnalyzePercent(target));
};

const threadsToGrow = (ns: BitBurner, target: string) => {
  if (ns.getServerMaxMoney(target) === 0) {
    return 0;
  }

  return Math.ceil(
    ns.growthAnalyze(
      target,
      ns.getServerMaxMoney(target) / (ns.getServerMoneyAvailable(target) || 1)
    )
  );
};
