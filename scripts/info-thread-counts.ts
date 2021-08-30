import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  ns.tprint(`maximum server RAM: ${ns.getPurchasedServerMaxRam()}GB`);
  const hackCost = ns.getScriptRam("single-hack.js");
}
