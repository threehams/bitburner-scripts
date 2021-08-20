import { BitBurner } from "../types/bitburner";
import { formatNumber } from "./shared-format-number";

export async function main(ns: BitBurner) {
  const hackCost = ns.getScriptRam("single-hack.js");
  for (let i = 1; i < 16; i++) {
    ns.tprint(
      `${formatNumber(2 ** i)}GB server cost: $${formatNumber(
        ns.getPurchasedServerCost(2 ** i)
      )}, ${formatNumber(Math.floor(2 ** i / hackCost))} threads`
    );
  }
}
