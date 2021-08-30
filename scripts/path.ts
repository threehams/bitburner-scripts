import { BitBurner } from "../types/bitburner";
import { findPath } from "./shared-find-path";

export async function main(ns: BitBurner) {
  const [server1, server2] = ns.args;
  if (!server1) {
    ns.tprint("Usage: run path.js [source] [target]");
    return;
  }

  let source, target;
  if (!server2) {
    source = ns.getHostname();
    target = server1;
  } else {
    source = server1;
    target = server2;
  }

  ns.tprint(findPath(ns, source, undefined, target));
  ns.args;
}
