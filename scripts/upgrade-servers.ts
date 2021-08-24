import { BitBurner } from "../types/bitburner";
import { SERVER_RAM } from "./shared-settings";
import { upgradeServers } from "./shared-upgrade-servers";

export async function main(ns: BitBurner) {
  const ram = ns.args[0] ? Number(ns.args[0]) : SERVER_RAM;

  upgradeServers(ns, ram);
}
