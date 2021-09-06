import { BitBurner } from "../types/bitburner";
import { buyPrograms } from "./shared-buy-programs";

export const main = async (ns: BitBurner) => {
  buyPrograms(ns, 5);
};
