import { BitBurner } from "../types/bitburner";
import { infiltrationList } from "./shared-infiltrations";
import { makeTable } from "./shared-make-table";

export const main = async (ns: BitBurner) => {
  const infiltrations = infiltrationList();

  const table = (await infiltrations).map((loc) => {
    return [
      loc.security.toFixed(2),
      loc.levels.toFixed(0),
      loc.city ?? "",
      loc.name,
    ];
  });

  makeTable([["security", "levels", "city", "name"]].concat(table)).forEach(
    (line) => {
      ns.tprint(line);
    }
  );
};
