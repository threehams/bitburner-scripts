import { BitBurner } from "../types/bitburner";
import { range } from "./shared-range";

export async function main(ns: BitBurner) {
  const purchaseCost = ns.hacknet.getPurchaseNodeCost();

  const nodes = range(ns.hacknet.numNodes()).map((index) => {
    const stats = ns.hacknet.getNodeStats(index);
    return {
      levelCost: ns.hacknet.getLevelUpgradeCost(index, 1),
      ramCost: ns.hacknet.getRamUpgradeCost(index, 1),
      coreCost: ns.hacknet.getCoreUpgradeCost(index, 1),
    };
  });
}
