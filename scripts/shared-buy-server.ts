import { BitBurner } from "../types/bitburner";
import { formatNumber } from "./shared-format-number";

export const buyServer = (ns: BitBurner, ram: number) => {
  const cost = ns.getPurchasedServerCost(ram);
  if (canBuyServer(ns, ram)) {
    ns.print(`buying server with ${ram}GB RAM for $${formatNumber(cost)}`);
    const hostname = ns.purchaseServer("drone", ram);
    ns.scp(["single-hack.js", "single-grow.js", "single-weaken.js"], hostname);
  }
};

export const canBuyServer = (ns: BitBurner, ram: number) => {
  const cost = ns.getPurchasedServerCost(ram);
  return (
    ns.getServerMoneyAvailable("home") >= cost &&
    ns.getPurchasedServers().length < 25
  );
};
