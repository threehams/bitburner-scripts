import { BitBurner } from "../types/bitburner";
import { enterCommand } from "./shared-enter-command";
import { findPath } from "./shared-find-path";

export async function main(ns: BitBurner) {
  const target = ns.args[0];
  ns.scp(
    ["connect-direct.js", "shared-enter-command.js", "shared-find-path.js"],
    target
  );

  const path = findPath(ns, ns.getHostname(), undefined, target);
  path.forEach((server) => {
    enterCommand(`connect ${server}`);
  });
}
