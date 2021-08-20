import { BitBurner } from "../types/bitburner";
import { enterCommand } from "./shared-enter-command";
import { canNuke } from "./shared-can-nuke";
import { findPath } from "./shared-find-path";
import { nukeAll } from "./shared-nuke-all";

export const doc = eval("doc" + "ument");
const factionServers = [
  "CSEC",
  "avmnite-02h",
  "I.I.I.I",
  "run4theh111z",
  ".",
  "The-Cave",
];

export async function main(ns: BitBurner) {
  nukeAll(ns);

  for (const server of factionServers) {
    if (canNuke(ns, server) && canHack(ns, server)) {
      const path = findPath(ns, "home", undefined, server);
      path.forEach((server) => {
        enterCommand(`connect ${server}`);
      });

      let hacked = false;
      while (!hacked) {
        enterCommand("hack");

        hacked = await waitFor(ns, () => {
          const messages = doc.getElementsByClassName(
            "terminal-line"
          ) as HTMLCollectionOf<HTMLTableCellElement>;
          const last = messages[messages.length - 1];
          if (last.innerText?.includes("Hack successful")) {
            return true;
          } else if (last.innerText?.includes("Failed to hack")) {
            return false;
          }
          return;
        });
      }

      path.reverse().forEach((server) => {
        enterCommand(`connect ${server}`);
      });
    }
  }
}

const waitFor = async <T extends unknown>(
  ns: BitBurner,
  callback: () => T | undefined,
  timeout: number = 60000
): Promise<T> => {
  let timer = 0;

  while (timer < timeout) {
    const result = callback();
    if (result !== undefined) {
      return result;
    }
    // silly but works for now
    timer += 500;
    await ns.sleep(500);
  }
  throw new Error(`waitFor failed after ${timeout}s`);
};

const canHack = (ns: BitBurner, server: string) => {
  return ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel();
};
