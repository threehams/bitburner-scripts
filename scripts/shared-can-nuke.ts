import { BitBurner } from "../types/bitburner";

export const canNuke = (ns: BitBurner, server: string) => {
  const requiredPorts = ns.getServerNumPortsRequired(server);
  const availablePrograms = [
    ns.fileExists("BruteSSH.exe", "home"),
    ns.fileExists("FTPCrack.exe", "home"),
    ns.fileExists("relaySMTP.exe", "home"),
    ns.fileExists("HTTPWorm.exe", "home"),
    ns.fileExists("SQLInject.exe", "home"),
  ].filter(Boolean).length;

  return availablePrograms >= requiredPorts;
};
