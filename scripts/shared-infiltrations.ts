export const infiltrationList = async () => {
  return locations
    .filter(canBeInfiltrated)
    .sort((a, b) => {
      return a.infiltrationData?.startingSecurityLevel >
        b.infiltrationData?.startingSecurityLevel
        ? 1
        : -1;
    })
    .map((loc) => {
      return {
        name: loc.name,
        security: loc.infiltrationData.startingSecurityLevel,
        levels: loc.infiltrationData.maxClearanceLevel,
        city: loc.city,
      };
    });
};

/**
 * Names of all locations
 */
export enum LocationName {
  // Cities
  Aevum = "Aevum",
  Chongqing = "Chongqing",
  Ishima = "Ishima",
  NewTokyo = "New Tokyo",
  Sector12 = "Sector-12",
  Volhaven = "Volhaven",

  // Aevum Locations
  AevumAeroCorp = "AeroCorp",
  AevumBachmanAndAssociates = "Bachman & Associates",
  AevumClarkeIncorporated = "Clarke Incorporated",
  AevumCrushFitnessGym = "Crush Fitness Gym",
  AevumECorp = "ECorp",
  AevumFulcrumTechnologies = "Fulcrum Technologies",
  AevumGalacticCybersystems = "Galactic Cybersystems",
  AevumNetLinkTechnologies = "NetLink Technologies",
  AevumPolice = "Aevum Police Headquarters",
  AevumRhoConstruction = "Rho Construction",
  AevumSnapFitnessGym = "Snap Fitness Gym",
  AevumSummitUniversity = "Summit University",
  AevumWatchdogSecurity = "Watchdog Security",
  AevumCasino = "Iker Molina Casino",

  // Chongqing locations
  ChongqingKuaiGongInternational = "KuaiGong International",
  ChongqingSolarisSpaceSystems = "Solaris Space Systems",

  // Sector 12
  Sector12AlphaEnterprises = "Alpha Enterprises",
  Sector12BladeIndustries = "Blade Industries",
  Sector12CIA = "Central Intelligence Agency",
  Sector12CarmichaelSecurity = "Carmichael Security",
  Sector12CityHall = "Sector-12 City Hall",
  Sector12DeltaOne = "DeltaOne",
  Sector12FoodNStuff = "FoodNStuff",
  Sector12FourSigma = "Four Sigma",
  Sector12IcarusMicrosystems = "Icarus Microsystems",
  Sector12IronGym = "Iron Gym",
  Sector12JoesGuns = "Joe's Guns",
  Sector12MegaCorp = "MegaCorp",
  Sector12NSA = "National Security Agency",
  Sector12PowerhouseGym = "Powerhouse Gym",
  Sector12RothmanUniversity = "Rothman University",
  Sector12UniversalEnergy = "Universal Energy",

  // New Tokyo
  NewTokyoDefComm = "DefComm",
  NewTokyoGlobalPharmaceuticals = "Global Pharmaceuticals",
  NewTokyoNoodleBar = "Noodle Bar",
  NewTokyoVitaLife = "VitaLife",

  // Ishima
  IshimaNovaMedical = "Nova Medical",
  IshimaOmegaSoftware = "Omega Software",
  IshimaStormTechnologies = "Storm Technologies",

  // Volhaven
  VolhavenCompuTek = "CompuTek",
  VolhavenHeliosLabs = "Helios Labs",
  VolhavenLexoCorp = "LexoCorp",
  VolhavenMilleniumFitnessGym = "Millenium Fitness Gym",
  VolhavenNWO = "NWO",
  VolhavenOmniTekIncorporated = "OmniTek Incorporated",
  VolhavenOmniaCybersystems = "Omnia Cybersystems",
  VolhavenSysCoreSecurities = "SysCore Securities",
  VolhavenZBInstituteOfTechnology = "ZB Institute of Technology",

  // Generic locations
  Hospital = "Hospital",
  Slums = "The Slums",
  TravelAgency = "Travel Agency",
  WorldStockExchange = "World Stock Exchange",

  // Default name for Location objects
  Void = "The Void",
}

/**
 * All possible Cities in the game. Names only, not actual "City" object
 * Implemented as an enum for typing purposes
 */
export enum CityName {
  Aevum = "Aevum",
  Chongqing = "Chongqing",
  Ishima = "Ishima",
  NewTokyo = "New Tokyo",
  Sector12 = "Sector-12",
  Volhaven = "Volhaven",
}

export enum LocationType {
  Company,
  Gym,
  Hospital,
  Slums,
  Special, // This location has special options/activities (e.g. Bladeburner, Re-sleeving)
  StockMarket,
  TechVendor,
  TravelAgency,
  University,
  Casino,
}

const locations = [
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 12,
      startingSecurityLevel: 8.18,
    },
    name: LocationName.AevumAeroCorp,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 15,
      startingSecurityLevel: 8.19,
    },
    name: LocationName.AevumBachmanAndAssociates,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 18,
      startingSecurityLevel: 9.55,
    },
    name: LocationName.AevumClarkeIncorporated,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    costMult: 3,
    expMult: 2,
    name: LocationName.AevumCrushFitnessGym,
    types: [LocationType.Gym],
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 37,
      startingSecurityLevel: 17.02,
    },
    name: LocationName.AevumECorp,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 512,
    techVendorMinRam: 128,
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 15.54,
    },
    name: LocationName.AevumFulcrumTechnologies,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 1024,
    techVendorMinRam: 256,
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 12,
      startingSecurityLevel: 7.89,
    },
    name: LocationName.AevumGalacticCybersystems,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 6,
      startingSecurityLevel: 3.29,
    },
    name: LocationName.AevumNetLinkTechnologies,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 64,
    techVendorMinRam: 8,
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 6,
      startingSecurityLevel: 5.35,
    },
    name: LocationName.AevumPolice,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 5,
      startingSecurityLevel: 5.02,
    },
    name: LocationName.AevumRhoConstruction,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    costMult: 10,
    expMult: 5,
    name: LocationName.AevumSnapFitnessGym,
    types: [LocationType.Gym],
  },
  {
    city: CityName.Aevum,
    costMult: 4,
    expMult: 3,
    name: LocationName.AevumSummitUniversity,
    types: [LocationType.University],
  },
  {
    city: CityName.Aevum,
    infiltrationData: {
      maxClearanceLevel: 7,
      startingSecurityLevel: 5.85,
    },
    name: LocationName.AevumWatchdogSecurity,
    types: [LocationType.Company],
  },
  {
    city: CityName.Aevum,
    name: LocationName.AevumCasino,
    types: [LocationType.Casino],
  },
  {
    city: CityName.Chongqing,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 16.25,
    },
    name: LocationName.ChongqingKuaiGongInternational,
    types: [LocationType.Company],
  },
  {
    city: CityName.Chongqing,
    infiltrationData: {
      maxClearanceLevel: 18,
      startingSecurityLevel: 12.59,
    },
    name: LocationName.ChongqingSolarisSpaceSystems,
    types: [LocationType.Company],
  },
  {
    city: CityName.Ishima,
    infiltrationData: {
      maxClearanceLevel: 12,
      startingSecurityLevel: 5.02,
    },
    name: LocationName.IshimaNovaMedical,
    types: [LocationType.Company],
  },
  {
    city: CityName.Ishima,
    infiltrationData: {
      maxClearanceLevel: 10,
      startingSecurityLevel: 3.2,
    },
    name: LocationName.IshimaOmegaSoftware,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 128,
    techVendorMinRam: 4,
  },
  {
    city: CityName.Ishima,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 5.38,
    },
    name: LocationName.IshimaStormTechnologies,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 512,
    techVendorMinRam: 32,
  },
  {
    city: CityName.NewTokyo,
    infiltrationData: {
      maxClearanceLevel: 17,
      startingSecurityLevel: 7.18,
    },
    name: LocationName.NewTokyoDefComm,
    types: [LocationType.Company],
  },
  {
    city: CityName.NewTokyo,
    infiltrationData: {
      maxClearanceLevel: 20,
      startingSecurityLevel: 5.9,
    },
    name: LocationName.NewTokyoGlobalPharmaceuticals,
    types: [LocationType.Company],
  },
  {
    city: CityName.NewTokyo,
    infiltrationData: {
      maxClearanceLevel: 5,
      startingSecurityLevel: 2.5,
    },
    name: LocationName.NewTokyoNoodleBar,
    types: [LocationType.Company, LocationType.Special],
  },
  {
    city: CityName.NewTokyo,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 5.52,
    },
    name: LocationName.NewTokyoVitaLife,
    types: [LocationType.Company, LocationType.Special],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 10,
      startingSecurityLevel: 3.62,
    },
    name: LocationName.Sector12AlphaEnterprises,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 8,
    techVendorMinRam: 2,
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 10.59,
    },
    name: LocationName.Sector12BladeIndustries,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    name: LocationName.Sector12CIA,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 15,
      startingSecurityLevel: 4.66,
    },
    name: LocationName.Sector12CarmichaelSecurity,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    name: LocationName.Sector12CityHall,
    types: [LocationType.Special],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 12,
      startingSecurityLevel: 5.9,
    },
    name: LocationName.Sector12DeltaOne,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    name: LocationName.Sector12FoodNStuff,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 8.18,
    },
    name: LocationName.Sector12FourSigma,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 17,
      startingSecurityLevel: 6.02,
    },
    name: LocationName.Sector12IcarusMicrosystems,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    expMult: 1,
    costMult: 1,
    name: LocationName.Sector12IronGym,
    types: [LocationType.Gym],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 5,
      startingSecurityLevel: 3.13,
    },
    name: LocationName.Sector12JoesGuns,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 31,
      startingSecurityLevel: 16.36,
    },
    name: LocationName.Sector12MegaCorp,
    types: [LocationType.Company],
  },
  {
    city: CityName.Sector12,
    name: LocationName.Sector12NSA,
    types: [LocationType.Company, LocationType.Special],
  },
  {
    city: CityName.Sector12,
    costMult: 20,
    expMult: 10,
    name: LocationName.Sector12PowerhouseGym,
    types: [LocationType.Gym],
  },
  {
    city: CityName.Sector12,
    costMult: 3,
    expMult: 2,
    name: LocationName.Sector12RothmanUniversity,
    types: [LocationType.University],
  },
  {
    city: CityName.Sector12,
    infiltrationData: {
      maxClearanceLevel: 12,
      startingSecurityLevel: 5.9,
    },
    name: LocationName.Sector12UniversalEnergy,
    types: [LocationType.Company],
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 15,
      startingSecurityLevel: 3.59,
    },
    name: LocationName.VolhavenCompuTek,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 256,
    techVendorMinRam: 8,
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 18,
      startingSecurityLevel: 7.28,
    },
    name: LocationName.VolhavenHeliosLabs,
    types: [LocationType.Company],
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 15,
      startingSecurityLevel: 4.35,
    },
    name: LocationName.VolhavenLexoCorp,
    types: [LocationType.Company],
  },
  {
    city: CityName.Volhaven,
    costMult: 7,
    expMult: 4,
    name: LocationName.VolhavenMilleniumFitnessGym,
    types: [LocationType.Gym],
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 50,
      startingSecurityLevel: 8.53,
    },
    name: LocationName.VolhavenNWO,
    types: [LocationType.Company],
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 25,
      startingSecurityLevel: 7.74,
    },
    name: LocationName.VolhavenOmniTekIncorporated,
    types: [LocationType.Company, LocationType.TechVendor],
    techVendorMaxRam: 1024,
    techVendorMinRam: 128,
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 22,
      startingSecurityLevel: 6,
    },
    name: LocationName.VolhavenOmniaCybersystems,
    types: [LocationType.Company],
  },
  {
    city: CityName.Volhaven,
    infiltrationData: {
      maxClearanceLevel: 18,
      startingSecurityLevel: 4.77,
    },
    name: LocationName.VolhavenSysCoreSecurities,
    types: [LocationType.Company],
  },
  {
    city: CityName.Volhaven,
    costMult: 5,
    expMult: 4,
    name: LocationName.VolhavenZBInstituteOfTechnology,
    types: [LocationType.University],
  },
  {
    city: null,
    name: LocationName.Hospital,
    types: [LocationType.Hospital],
  },
  {
    city: null,
    name: LocationName.Slums,
    types: [LocationType.Slums],
  },
  {
    city: null,
    name: LocationName.TravelAgency,
    types: [LocationType.TravelAgency],
  },
  {
    city: null,
    name: LocationName.WorldStockExchange,
    types: [LocationType.StockMarket],
  },
];

type Loc = typeof locations[number];
type InfiltrationLoc = Required<Loc>;

const canBeInfiltrated = (loc: Loc): loc is InfiltrationLoc => {
  return !!loc.infiltrationData?.startingSecurityLevel;
};
