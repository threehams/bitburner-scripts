import { BitBurner } from "../types/bitburner";

const PROGRAMS = [
  "brutessh.exe",
  "ftpcrack.exe",
  "relaysmtp.exe",
  "httpworm.exe",
  "sqlinject.exe",
] as const;

export const buyPrograms = (ns: BitBurner, count: number) => {
  const player = ns.getPlayer();
  ns.purchaseProgram;
  ns.purchaseTor;
  if (!player.tor && ns.getServerMoneyAvailable("home") >= 200000) {
    ns.purchaseTor();
  }
  for (const program of PROGRAMS.slice(0, count)) {
    if (!ns.fileExists(program, "home")) {
      try {
        ns.purchaseProgram(program);
      } catch (err) {}
    }
  }
};
