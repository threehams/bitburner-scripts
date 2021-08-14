import { BitBurner } from "../types/bitburner";
import { serverList } from "./shared-server-list";

export async function main(ns: BitBurner) {
  const hackingLevel = ns.getHackingLevel();
  const servers = await serverList(ns);

  const hackable = servers.filter((server) => {
    return hackingLevel >= ns.getServerRequiredHackingLevel(server.name);
  });
  hackable.forEach((server) => {
    hack(server.name, ns);
  });
}

const dive = (source: string, last: string, ns: BitBurner): string[] => {
  return ns
    .scan(source)
    .flatMap((server) => {
      if (server === last) {
        return [];
      }
      return dive(server, source, ns);
    })
    .concat([source]);
};

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
      ns[program](server);
    } catch (err) {
      // ns.tprint("failed to run ", program);
    }
  }

  try {
    ns.nuke(server);
    ns.tprint("successfully hacked: ", server);
  } catch (err) {
    ns.tprint("not enough open ports to hack: ", server);
  }
};
