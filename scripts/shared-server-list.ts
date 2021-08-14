import { BitBurner } from "../types/bitburner";

export const COLUMNS = [
  "hackLevel",
  "hackValue",
  "hasRoot",
  "incomeRate",
  "name",
  "security",
  "serverMoney",
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
      const hackValue =
        (ns.hackAnalyzePercent(server) / 100) *
        ns.getServerMoneyAvailable(server) *
        ns.hackChance(server);
      const growAmount = ns.getServerGrowth(server);
      return {
        hasRoot: ns.hasRootAccess(server),
        name: server,
        hackLevel: ns.getServerRequiredHackingLevel(server),
        security: ns.getServerSecurityLevel(server),
        serverMoney: ns.getServerMoneyAvailable(server),
        hackValue,
        incomeRate: hackValue / ns.getHackTime(server),
        growAmount,
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

const isValidSort = (sort: string): sort is Column => {
  if (!COLUMNS.includes(sort as Column)) {
    return false;
  }
  return true;
};

const isValidSortOrder = (order: string): order is SortOrder => {
  if (!SORT_ORDERS.includes(order as SortOrder)) {
    return false;
  }
  return true;
};
