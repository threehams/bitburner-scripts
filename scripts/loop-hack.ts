import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [target] = ns.args;

  while (true) {
    await ns.hack(target);
    await ns.sleep(50);
  }
}
