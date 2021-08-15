import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const [server] = ns.args;

  await ns.grow(server);
}
