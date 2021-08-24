import { BitBurner } from "../types/bitburner";
import { formatNumber } from "./shared-format-number";

export async function main(ns: BitBurner) {
  ns.tprint(`maximum server RAM: ${ns.getPurchasedServerMaxRam()}GB`);
  const hackCost = ns.getScriptRam("single-hack.js");
  for (let i = 1; i < 21; i++) {
    ns.tprint(
      `${formatNumber(2 ** i)}GB server cost: $${formatNumber(
        ns.getPurchasedServerCost(2 ** i)
      )}, ${formatNumber(Math.floor(2 ** i / hackCost))} threads`
    );
  }
}
