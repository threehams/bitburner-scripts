import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  for (const server of ns.getPurchasedServers()) {
    ns.killall(server);
  }
  ns.killall("home");
}
