import { BitBurner } from "../types/bitburner";
import { allServers } from "./shared-all-servers";

export async function main(ns: BitBurner) {
  for (const server of allServers(ns)) {
    ns.killall(server);
  }
  ns.killall("home");
}
