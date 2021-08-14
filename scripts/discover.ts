import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const servers = ns.scan("home");
  const hackingLevel = ns.getHackingLevel();
  const hackable = servers.filter((server) => {
    return hackingLevel >= ns.getServerRequiredHackingLevel(server);
  });
  hackable.forEach((server) => {
    hack(server, ns);
  });
}

const programs = [
  "brutessh",
  "ftpcrack",
  "relaysmtp",
  "httpworm",
  "sqlinject",
] as const;

const hack = async (server: string, ns: BitBurner) => {
  if (ns.hasRootAccess(server)) {
    return;
  }

  ns.tprint("hacking: ", server);
  for (const program of programs) {
    try {
      const requiredPorts = ns.getServerNumPortsRequired(server);
      if (!requiredPorts) {
        ns.tprint("successfully hacked: ", server);
        return;
      }
      ns[program](server);
    } catch (err) {
      ns.tprint("failed to run ", program);
    }
  }
  ns.tprint("not enough open ports to hack: ", server);
};
