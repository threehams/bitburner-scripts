import { BitBurner } from "../types/bitburner";
import { formatNumber } from "./shared-format-number";
import { findArg } from "./shared-args";
import {
  Column,
  COLUMNS,
  serverList,
  SortOrder,
  SORT_ORDERS,
} from "./shared-server-list";
import { makeTable } from "./shared-make-table";

const sortColumns: { [key: string]: Column | undefined } = {
  l: "hackLevel",
  r: "hackRate",
  v: "hackValue",
  g: "growRate",
  m: "serverMoney",
  t: "fullGrowTime",
};

export async function main(ns: BitBurner) {
  const threads = findArg(ns.args, { key: "t", defaultValue: 1 });
  const sortOrder = ns.args.includes("-r") ? "desc" : "asc";
  const column =
    sortColumns[
      ns.args.find((flag) => flag.startsWith("-s"))?.replace("-s", "") ?? "l"
    ] ?? "hackLevel";
  const showAll = findArg(ns.args, { key: "a", defaultValue: false });

  if (!isValidSort(column) || !isValidSortOrder(sortOrder)) {
    ns.tprint(`Usage: run walk.js --sort [column] [sort-order]`);
    ns.tprint(`Available columns: ${COLUMNS.join(", ")}`);
    ns.tprint(`Available sort orders: ${SORT_ORDERS.join(", ")}`);
    return;
  }
  const servers = await serverList({ ns, column, sortOrder, threads });

  const table = servers
    .filter((server) => showAll || server.hasRoot)
    .map(
      ({
        fullGrowTime,
        growRate,
        hackLevel,
        hasRoot,
        hackRate,
        name,
        nukable,
        security,
        serverMoney,
        percentMoney,
      }) => {
        const growTime = formatTime(new Date(fullGrowTime * 1000));

        return [
          hasRoot
            ? "🟩"
            : nukable && hackLevel <= ns.getHackingLevel()
            ? "🟧"
            : "🟥",
          formatNumber(hackLevel.toFixed(0)),
          formatNumber(security.toFixed(0)),
          `$${formatNumber(serverMoney.toFixed(0))}`,
          `$${formatNumber(hackRate.toFixed(0))}/sec`,
          `$${formatNumber(growRate.toFixed(0))}/sec`,
          `${(percentMoney * 100).toFixed(0)}%`,
          growTime,
          name,
        ];
      }
    );

  makeTable(table, ns).forEach((row) => ns.tprint(row));
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

const formatTime = (date: Date) => {
  const days = date.getUTCMonth() * 30 + (date.getUTCDate() - 1);
  return [
    days > 99 ? ">" : " ",
    Math.min(days, 99).toString().padStart(2, " "),
    "d ",
    date.getUTCHours().toString().padStart(2, "0"),
    ":",
    date.getUTCMinutes().toString().padStart(2, "0"),
    ":",
    date.getUTCSeconds().toString().padStart(2, "0"),
  ].join("");
};
