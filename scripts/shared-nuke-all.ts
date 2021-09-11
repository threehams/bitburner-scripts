import { BitBurner } from "../types/bitburner";
import { canNuke } from "./shared-can-nuke";
import { findPath } from "./shared-find-path";
import { serverList } from "./shared-server-list";

type Options = {
  backdoor: boolean;
};
export const nukeAll = async (
  ns: BitBurner,
  options: Options = { backdoor: false }
) => {
  const hackingLevel = ns.getHackingLevel();
  const servers = await serverList({ ns });

  const hackable = servers.filter((server) => {
    return hackingLevel >= server.hackLevel;
  });

  for (const server of hackable) {
    await hack(ns, server.name, options);
  }
};

const hack = async (ns: BitBurner, target: string, options: Options) => {
  if (
    ns.hasRootAccess(target) &&
    (options.backdoor ? ns.getServer(target).backdoorInstalled : true)
  ) {
    return;
  }

  if (canNuke(ns, target)) {
    ns.fileExists("BruteSSH.exe", "home") && ns.brutessh(target);
    ns.fileExists("FTPCrack.exe", "home") && ns.ftpcrack(target);
    ns.fileExists("relaySMTP.exe", "home") && ns.relaysmtp(target);
    ns.fileExists("HTTPWorm.exe", "home") && ns.httpworm(target);
    ns.fileExists("SQLInject.exe", "home") && ns.sqlinject(target);

    ns.nuke(target);
    ns.scp(["single-hack.js", "single-grow.js", "single-weaken.js"], target);
    if (!ns.getServer(target).backdoorInstalled && options.backdoor) {
      const path = findPath(ns, ns.getHostname(), undefined, target);
      path.forEach((server) => {
        ns.connect(server);
      });
      await ns.installBackdoor();
      path.reverse().forEach((server) => {
        ns.connect(server);
      });
    }

    ns.tprint(`hacked: ${target}`);
  }
};
