import { BitBurner } from "../types/bitburner";

export const main = (ns: BitBurner) => {
  ns.tprint("getDivision", ns.corporation.getDivision("Biotech"));
};
