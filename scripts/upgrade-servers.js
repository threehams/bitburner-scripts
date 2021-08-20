import { BitBurner } from "../types/bitburner";
import { buyServer, canBuyServer } from "./shared-buy-server";
import { SERVER_RAM } from "./shared-settings";

/**
 * @param ns {BitBurner}
 */
export async function main(ns) {
  ns.getPurchasedServers().forEach((server) => {
    const [maxRam] = ns.getServerRam(server);
    if (
      maxRam < SERVER_RAM &&
      ns.getServerMoneyAvailable("home") >=
        ns.getPurchasedServerCost(SERVER_RAM)
    ) {
      ns.deleteServer(server);
      buyServer(ns, SERVER_RAM);
    }
  });
}
