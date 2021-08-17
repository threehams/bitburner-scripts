import { BitBurner } from "../types/bitburner";
import { canNuke } from "./shared-can-nuke";
import { serverList } from "./shared-server-list";

export const nukeAll = async (ns: BitBurner) => {
  const hackingLevel = ns.getHackingLevel();
  const servers = await serverList({ ns });

  const hackable = servers.filter((server) => {
    return hackingLevel >= server.hackLevel;
  });

  hackable.forEach((server) => {
    hack(server.name, ns);
  });
};

const hack = async (server: string, ns: BitBurner) => {
  if (ns.hasRootAccess(server)) {
    return;
  }

  if (canNuke(ns, server)) {
    ns.fileExists("BruteSSH.exe", "home") && ns.brutessh(server);
    ns.fileExists("FTPCrack.exe", "home") && ns.ftpcrack(server);
    ns.fileExists("relaySMTP.exe", "home") && ns.relaysmtp(server);
    ns.fileExists("HTTPWorm.exe", "home") && ns.httpworm(server);
    ns.fileExists("SQLInject.exe", "home") && ns.sqlinject(server);

    ns.nuke(server);
    ns.tprint(`hacked: ${server}`);
  }
};
