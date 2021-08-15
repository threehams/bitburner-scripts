import { BitBurner } from "../types/bitburner";
import {
  Column,
  COLUMNS,
  serverList,
  SortOrder,
  SORT_ORDERS,
} from "./shared-server-list";

export async function main(ns: BitBurner) {
  const [, column = "hackLevel", sortOrder = "asc"] = ns.args;

  if (!isValidSort(column) || !isValidSortOrder(sortOrder)) {
    ns.tprint(`Usage: run walk.js --sort [column] [sort-order]`);
    ns.tprint(`Available columns: ${COLUMNS.join(", ")}`);
    ns.tprint(`Available sort orders: ${SORT_ORDERS.join(", ")}`);
    return;
  }
  const servers = await serverList(ns, column, sortOrder);

  servers
    .filter((server) => server.hasRoot)
    .forEach(
      ({
        growRate,
        hackLevel,
        hasRoot,
        incomeRate,
        name,
        security,
        serverMoney,
      }) => {
        ns.tprint(
          [
            hasRoot ? "🟩" : "🟥",
            formatNumber(hackLevel.toFixed(0)).padStart(5),
            formatNumber(security.toFixed(0)).padStart(6),
            `$${formatNumber(serverMoney.toFixed(0))}`.padStart(16),
            `$${formatNumber(incomeRate.toFixed(0))}/sec`.padStart(14),
            `$${formatNumber(growRate.toFixed(0))}/sec`.padStart(10),
            name,
          ].join(" ")
        );
      }
    );
}

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

const formatNumber = (num: number | string) => {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
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
