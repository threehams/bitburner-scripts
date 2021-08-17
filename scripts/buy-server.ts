import { BitBurner } from "../types/bitburner";
import { findArg } from "./shared-args";
import { buyServer } from "./shared-buy-server";
import { range } from "./shared-range";

export async function main(ns: BitBurner) {
  const ram = findArg(ns.args, { key: "r", defaultValue: 8 });
  const count = findArg(ns.args, { key: "c", defaultValue: 1 });

  for (const _ of range(count)) {
    const hostname = buyServer(ns, ram);
  }
}
