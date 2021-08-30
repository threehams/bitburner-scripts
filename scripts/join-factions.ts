import { BitBurner } from "../types/bitburner";
import { enterCommand } from "./shared-enter-command";
import { canNuke } from "./shared-can-nuke";
import { findPath } from "./shared-find-path";
import { nukeAll } from "./shared-nuke-all";
import { waitFor } from "./shared-wait-for";

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

const canHack = (ns: BitBurner, server: string) => {
  return ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel();
};
