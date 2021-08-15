import { BitBurner } from "../types/bitburner";

export const COLUMNS = [
  "hackLevel",
  "hackValue",
  "hasRoot",
  "incomeRate",
  "name",
  "security",
  "serverMoney",
  "growRate",
] as const;
export type Column = typeof COLUMNS[number];
export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = typeof SORT_ORDERS[number];

export const serverList = async (
  ns: BitBurner,
  column: Column = "hackLevel",
  sortOrder: SortOrder = "asc"
) => {
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
      const serverMoney = ns.getServerMoneyAvailable(server);
      const maxServerMoney = ns.getServerMaxMoney(server);
      const hackValue =
        (ns.hackAnalyzePercent(server) / 100) *
        serverMoney *
        ns.hackChance(server);
      const growCount = ns.growthAnalyze(server, 2);
      const growTime = ns.getGrowTime(server);
      const growRate = hasRoot
        ? Math.min(serverMoney, maxServerMoney - serverMoney) /
          (growCount * growTime)
        : 0;
      return {
        hasRoot,
        name: server,
        hackLevel: ns.getServerRequiredHackingLevel(server),
        security: ns.getServerSecurityLevel(server),
        serverMoney,
        hackValue,
        incomeRate: hackValue / ns.getHackTime(server),
        growRate,
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
