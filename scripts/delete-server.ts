import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const hostname = ns.args[0];
  ns.deleteServer(hostname);
}
