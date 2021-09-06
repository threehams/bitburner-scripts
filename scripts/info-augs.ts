import { BitBurner } from "../types/bitburner";
import { makeTable } from "./shared-make-table";

export const main = (ns: BitBurner) => {
  const player = ns.getPlayer();
  const augList = player.factions.flatMap((faction) => {
    const owned = ns.getOwnedAugmentations();
    return ns
      .getAugmentationsFromFaction(faction)
      .filter((aug) => !owned.includes(aug))
      .map((aug) => {
        const [repRequired, cost] = ns.getAugmentationCost(aug);
        return {
          factionName: faction,
          name: aug,
          repRequired,
          cost,
          stats: ns.getAugmentationStats(aug),
        };
      })
      .map((aug) => {
        return [
          aug.factionName,
          ns.nFormat(aug.cost, "$0,0"),
          ns.nFormat(aug.repRequired, "0,0"),
          aug.name,
        ];
      });
  });

  makeTable([["faction", "cost", "rep", "name"]].concat(augList)).forEach(
    (row) => {
      ns.tprint(row);
    }
  );
};
