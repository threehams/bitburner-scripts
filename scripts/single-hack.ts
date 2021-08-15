import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [target] = ns.args;

  await ns.hack(target);
}
