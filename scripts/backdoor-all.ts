import { BitBurner } from "../types/bitburner";
import { nukeAll } from "./shared-nuke-all";

export const main = async (ns: BitBurner) => {
  await nukeAll(ns, { backdoor: true });
};
