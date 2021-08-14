import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [server] = ns.args;

  while (true) {
    const chance = ns.hackChance(server);
    const moneyPercent =
      ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server);
    ns.print(`hack chance: ${chance.toFixed(2)}`);
    ns.print(`server money percent: ${moneyPercent}`);

    if (chance < 0.75) {
      await ns.weaken(server);
    } else if (moneyPercent < 0.5) {
      ns.print();
      await ns.grow(server);
    } else {
      await ns.hack(server);
    }

    await ns.sleep(50);
  }
}
