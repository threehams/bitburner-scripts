import { BitBurner } from "../types/bitburner";
import { nukeAll } from "./shared-nuke-all";

export async function main(ns: BitBurner) {
  nukeAll(ns);
}
