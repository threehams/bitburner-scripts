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
  "Business",
  "Operations",
  "Management",
  "Operations",
  "Business",
  "Management",
  "Operations",
  "Management",
  "Business",
  "Engineer",
  "Operations",
  "Management",
  "Business",
  "Operations",
  "Operations",
  "Operations",
  "Business",
];

export const main = async (ns: BitBurner) => {
  const {
    size,
    r: research,
    buyRealEstate,
    buyMaterials,
    sellMaterials,
    divisions,
    storage,
  } = ns.flags([
    ["size", 9],
    ["r", false],
    ["buyRealEstate", false],
    ["buyMaterials", false],
    ["sellMaterials", false],
    [
      "divisions",
      [
        "Biotech",
        "stuffnfood",
        "R&D",
        "Mobile Homes",
        "Automation",
        "Pollution",
      ],
    ],
    ["storage", 0],
  ]);
  for (const division of divisions) {
    for (const city of cities) {
      let office;
      try {
        office = ns.corporation.getOffice(division, city);
      } catch (err) {
        ns.corporation.expandCity(division, city);
        office = ns.corporation.getOffice(division, city);
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
          (research ? "Research & Development" : JOBS[index]) ?? "Training",
        );
      }
      let lastSize = 0;
      while (true) {
        let warehouse;
        try {
          warehouse = ns.corporation.getWarehouse(division, city);
        } catch (err) {
          ns.corporation.purchaseWarehouse(division, city);
          warehouse = ns.corporation.getWarehouse(division, city);
        }
        ns.corporation.setSmartSupply(division, city, true);
        if (warehouse.size > storage || warehouse.size === lastSize) {
          break;
        }
        lastSize = warehouse.size;
        ns.corporation.upgradeWarehouse(division, city);
      }
      if (division === "Biotech") {
        ns.corporation.buyMaterial(
          division,
          city,
          "Hardware",
          buyMaterials ? 7 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "Robots",
          buyMaterials ? 1 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "AICores",
          buyMaterials ? 8 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "RealEstate",
          buyMaterials || buyRealEstate ? 10 : 0,
        );
        if (sellMaterials) {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "MAX", "MP");
          }
        } else {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "", "");
          }
        }
      }
      if (division === "R&D") {
        ns.corporation.buyMaterial(
          division,
          city,
          "Robots",
          buyMaterials ? 10 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "AICores",
          buyMaterials ? 80 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "RealEstate",
          buyMaterials || buyRealEstate ? 40 : 0,
        );
        if (sellMaterials) {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "MAX", "MP");
          }
        } else {
          for (const material of [
            "Hardware",
            "Robots",
            "AICores",
            "RealEstate",
          ] as const) {
            ns.corporation.sellMaterial(division, city, material, "", "");
          }
        }
      }

      if (division === "stuffnfood") {
        ns.corporation.buyMaterial(
          division,
          city,
          "Hardware",
          buyMaterials ? 300 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "Robots",
          buyMaterials ? 100 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "AICores",
          buyMaterials ? 700 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "RealEstate",
          buyMaterials || buyRealEstate ? 1000 : 0,
        );
        if (sellMaterials) {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "MAX", "MP");
          }
        } else {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "", "");
          }
        }
      }

      if (division === "Mobile Homes") {
        ns.corporation.buyMaterial(
          division,
          city,
          "Robots",
          buyMaterials ? 100 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "AICores",
          buyMaterials ? 700 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "RealEstate",
          buyMaterials || buyRealEstate ? 400 : 0,
        );
        if (sellMaterials) {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "MAX", "MP");
          }
        } else {
          for (const material of ["Hardware", "Robots", "AICores"] as const) {
            ns.corporation.sellMaterial(division, city, material, "", "");
          }
        }
      }

      if (division === "Automation") {
        ns.corporation.buyMaterial(
          division,
          city,
          "AICores",
          buyMaterials ? 700 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "RealEstate",
          buyMaterials || buyRealEstate ? 10000 : 0,
        );
        if (sellMaterials) {
          for (const material of ["AICores", "RealEstate"] as const) {
            ns.corporation.sellMaterial(division, city, material, "MAX", "MP");
          }
        } else {
          for (const material of ["AICores", "RealEstate"] as const) {
            ns.corporation.sellMaterial(division, city, material, "", "");
          }
        }
      }

      if (division === "Pollution") {
        ns.corporation.buyMaterial(
          division,
          city,
          "Robots",
          buyMaterials || buyRealEstate ? 50 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "AICores",
          buyMaterials ? 700 : 0,
        );
        ns.corporation.buyMaterial(
          division,
          city,
          "RealEstate",
          buyMaterials || buyRealEstate ? 10000 : 0,
        );
        if (sellMaterials) {
          for (const material of ["Robots", "AICores", "RealEstate"] as const) {
            ns.corporation.sellMaterial(division, city, material, "MAX", "MP");
          }
        } else {
          for (const material of ["Robots", "AICores", "RealEstate"] as const) {
            ns.corporation.sellMaterial(division, city, material, "", "");
          }
        }
      }
    }
  }
};

export const MaterialSizes = {
  Water: 0.05,
  Energy: 0.01,
  Food: 0.03,
  Plants: 0.05,
  Metal: 0.1,
  Hardware: 0.06,
  Chemicals: 0.05,
  Drugs: 0.02,
  Robots: 0.5,
  AICores: 0.1,
  RealEstate: 0,
} as const;
