import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  ns.purchaseServer("drone", 8);
}
