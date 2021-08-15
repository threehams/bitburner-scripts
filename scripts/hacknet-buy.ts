import { BitBurner } from "../types/bitburner";

const range = (count: number) => Array.from(Array(count).keys());

const LEVEL_VALUE = 1.649;
// 0.057
1.706;
// 0.122
1.828;

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
