import { BitBurner } from "../types/bitburner";
import { buyServer } from "./shared-buy-server";

export const upgradeServers = (ns: BitBurner, ram: number) => {
  ns.getPurchasedServers()
    .filter((server) => {
      const [maxRam] = ns.getServerRam(server);
      return maxRam < ram;
    })
    .sort((a, b) => {
      return ns.getServerRam(a)[0] < ns.getServerRam(b)[0] ? -1 : 1;
    })
    .forEach((server) => {
      if (
        ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)
      ) {
        ns.killall(server);
        ns.deleteServer(server);
        buyServer(ns, ram);
      }
    });
};
