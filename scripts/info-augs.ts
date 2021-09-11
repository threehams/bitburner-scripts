import { AugmentationStats, BitBurner } from "../types/bitburner";
import { factionList } from "./shared-faction-list";
import { makeTable } from "./shared-make-table";

export const main = (ns: BitBurner) => {
  const player = ns.getPlayer();
  const {
    a: all,
    c: corp,
    f: filter,
  } = ns.flags([
    ["a", false],
    ["c", false],
    ["f", ""],
  ]);

  const factions = all
    ? factionList(ns)
        .filter((faction) => {
          if (!corp) {
            return !faction.requirements.reputation;
          }
          return true;
        })
        .map((faction) => faction.name)
    : player.factions;
  const augList = factions.flatMap((faction) => {
    const owned = ns.getOwnedAugmentations();
    return ns
      .getAugmentationsFromFaction(faction)
      .filter((aug) => !owned.includes(aug))
      .map((aug) => {
        const [repRequired, cost] = ns.getAugmentationCost(aug);
        return {
          factionName: faction,
          factionJoined: player.factions.includes(faction),
          factionRep: ns.getFactionRep(faction),
          name: aug,
          repRequired,
          cost,
          stats: ns.getAugmentationStats(aug),
        };
      })
      .filter((aug) => {
        const stats = ns.getAugmentationStats(aug.name);
        if (filter) {
          return !!stats[filter as keyof AugmentationStats];
        }
        return true;
      })
      .map((aug) => {
        const available =
          aug.factionJoined && aug.factionRep >= aug.repRequired
            ? "🟩"
            : aug.factionJoined
            ? "🟧"
            : "🟥";

        return [
          available,
          aug.factionName,
          ns.nFormat(aug.cost, "$0,0"),
          ns.nFormat(aug.repRequired, "0,0"),
          aug.name,
        ];
      });
  });

  makeTable([["", "faction", "cost", "rep", "name"]].concat(augList)).forEach(
    (row) => {
      ns.tprint(row);
    }
  );
};
