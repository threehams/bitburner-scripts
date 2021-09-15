import { BitBurner, City, EmployeeJob } from "../types/bitburner";
import { range } from "./shared-range";

const cities: City[] = [
  "Aevum",
  "Chongqing",
  "Ishima",
  "New Tokyo",
  "Sector-12",
  "Volhaven",
];

const JOBS: EmployeeJob[] = [
  "Operations",
  "Engineer",
  "Management",
  "Operations",
  "Management",
  "Operations",
  "Management",
  "Operations",
  "Management",
  "Engineer",
  "Operations",
  "Management",
  "Operations",
  "Operations",
  "Operations",
];
const divisions = ["Biotech", "stuffnfood", "R&D"];

export const main = async (ns: BitBurner) => {
  const { size } = ns.flags([["size", 9]]);
  for (const division of divisions) {
    for (const city of cities) {
      let office;
      try {
        office = ns.corporation.getOffice(division, city);
      } catch (err) {
        continue;
      }
      const current = office.employees.length;
      if (office.size < size) {
        ns.corporation.upgradeOfficeSize(division, city, size - office.size);
      }
      for (const index of range(0, office.size - current)) {
        ns.corporation.hireEmployee(division, city);
      }
      for (const [index, employee] of office.employees.slice().entries()) {
        ns.corporation.assignJob(
          division,
          city,
          employee.name,
          JOBS[index] ?? "Research & Development",
        );
      }
    }
  }
};
