import { BitBurner } from "../types/bitburner";
import { factionList } from "./shared-faction-list";
import { makeTable } from "./shared-make-table";

export const main = async (ns: BitBurner) => {
  const factions = factionList(ns).map((faction) => {
    return [
      ns.nFormat(faction.favor, "0,0"),
      ns.nFormat(faction.nextFavor, "0,0"),
      ns.nFormat(faction.augs, "0,0"),
      ns.nFormat(faction.newAugs, "0,0"),
      faction.name,
    ];
  });

  makeTable(
    [["favor", "next favor", "augs", "newAugs", "name"]].concat(factions)
  ).forEach((row) => {
    ns.tprint(row);
  });
};
