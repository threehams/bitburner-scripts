import { BitBurner } from "../types/bitburner";
import { formatNumber } from "./shared-format-number";
import { Column, COLUMNS, serverList, SORT_ORDERS } from "./shared-server-list";
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
  const {
    h: threads,
    s: column,
    a: showAll,
    r: reverseSort,
  } = ns.flags([
    ["h", 1],
    ["s", "hackLevel"],
    ["a", false],
    ["r", false],
  ]);
  const sortOrder = reverseSort ? "desc" : "asc";

  if (!isValidSort(column)) {
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
        minSecurity,
        threadsToGrow,
        threadsToHack,
        threadsToWeaken,
        timeToGrow,
        timeToHack,
        timeToWeaken,
      }) => {
        const growTime = formatTime(new Date(fullGrowTime * 1000));

        return [
          hasRoot
            ? "🟩"
            : nukable && hackLevel <= ns.getHackingLevel()
            ? "🟧"
            : "🟥",
          formatNumber(hackLevel.toFixed(0)),
          `${formatNumber(security.toFixed(0))}/${formatNumber(
            minSecurity.toFixed(0)
          )}`,
          `$${formatNumber(serverMoney.toFixed(0))}`,
          // `$${formatNumber(hackRate.toFixed(0))}/sec`,
          // `$${formatNumber(growRate.toFixed(0))}/sec`,
          `${(percentMoney * 100).toFixed(0)}%`,
          formatTime(new Date(timeToHack * 1000)),
          formatTime(new Date(timeToGrow * 1000)),
          formatTime(new Date(timeToWeaken * 1000)),
          formatNumber(threadsToHack.toFixed(0)),
          formatNumber(threadsToGrow.toFixed(0)),
          formatNumber(threadsToWeaken.toFixed(0)),
          name,
        ];
      }
    );

  makeTable(
    [
      [
        "",
        "hack",
        "sec/min",
        "money",
        // "money/sec",
        // "grow/sec",
        "grow%",
        "hackt",
        "growt",
        "weakent",
        "hackth",
        "growth",
        "weakenth",
        "",
      ],
    ].concat(table)
  ).forEach((row) => ns.tprint(row));
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

const formatTime = (date: Date) => {
  // const days = date.getUTCMonth() * 30 + (date.getUTCDate() - 1);
  return [
    // days > 99 ? ">" : " ",
    // Math.min(days, 99).toString().padStart(2, " "),
    // "d ",
    date.getUTCHours().toString().padStart(2, "0"),
    ":",
    date.getUTCMinutes().toString().padStart(2, "0"),
    ":",
    date.getUTCSeconds().toString().padStart(2, "0"),
  ].join("");
};
