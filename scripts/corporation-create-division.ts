import { BitBurner, City } from "../types/bitburner";

const cities: City[] = [
  "Aevum",
  "Chongqing",
  "Ishima",
  "New Tokyo",
  "Sector-12",
  "Volhaven",
];
export const main = async (ns: BitBurner) => {
  for (const city of cities) {
    const office = ns.corporation.getOffice("R&D", city);
    const current = office.employees.length;
    const max = office.size;
    ns.tprint(city, current, max);
  }
};

const hireEmployee = () => {};
