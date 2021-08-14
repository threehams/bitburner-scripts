import { BitBurner } from "../types/bitburner";
import { serverList } from "./shared-server-list";

const RAM_USAGE = 1.7;

export async function main(ns: BitBurner) {
  let sources: string[], target: string;
  const serverArgs = ns.args.filter((arg) => !arg.startsWith("-"));
  const hackAll = ns.args.includes("-a");

  if (serverArgs.length === 1) {
    const availableServers = getAvailableServers(ns, RAM_USAGE);
    if (!availableServers.length) {
      ns.tprint("No servers available with free RAM");
      return;
    }
    sources = hackAll ? availableServers : [availableServers[0]];
    target = serverArgs[0];
  } else if (serverArgs.length === 2) {
    sources = [serverArgs[0]];
    target = serverArgs[1];
  } else {
    const availableServers = getAvailableServers(ns, RAM_USAGE);
    if (!availableServers.length) {
      ns.tprint("No servers available with free RAM");
      return;
    }
    sources = hackAll ? availableServers : [availableServers[0]];
    target = (await serverList(ns, "incomeRate", "desc"))[0].name;
  }

  ns.tprint(`running hack from against ${target}`);

  for (const source of sources) {
    ns.exec(
      "loop-hack.js",
      source,
      getThreadCount(ns, source, RAM_USAGE),
      target
    );
  }
}

const getAvailableServers = (ns: BitBurner, ram: number) => {
  return ns.getPurchasedServers().filter((server) => {
    return !!getThreadCount(ns, server, ram);
  });
};

const getThreadCount = (ns: BitBurner, server: string, ram: number) => {
  const [totalRam, usedRam] = ns.getServerRam(server);
  return Math.floor((totalRam - usedRam) / ram);
};
