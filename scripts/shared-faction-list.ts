import { BitBurner, City, FactionName } from "../types/bitburner";

export const factionList = (ns: BitBurner) => {
  const ownedAugs = ns.getOwnedAugmentations();

  return factions.map((faction) => {
    const favor = ns.getFactionFavor(faction.name);
    const augs = ns.getAugmentationsFromFaction(faction.name);
    return {
      name: faction.name,
      favor,
      nextFavor: ns.getFactionFavorGain(faction.name) + favor,
      augs: augs.length,
      newAugs: augs.filter((aug) => !ownedAugs.includes(aug)).length,
      requirements: faction.requirements,
    };
  });
};

export type FactionInfo = {
  name: FactionName;
  requirements: {
    server?: string;
    money?: number;
    location?: City[];
    hack?: number;
    hacknet?: boolean;
    computerRam?: number;
    reputation?: number;
    karma?: number;
    strength?: number;
    defense?: number;
    dexterity?: number;
    agility?: number;
    kills?: number;
    augs?: number;
    incompatible?: FactionName[];
  };
};
const factions: FactionInfo[] = [
  {
    name: "CyberSec",
    requirements: {
      server: "CSEC",
    },
  },
  {
    name: "NiteSec",
    requirements: {
      server: "avmnite-02h",
      computerRam: 32,
    },
  },
  {
    name: "The Black Hand",
    requirements: {
      server: "I.I.I.I",
      computerRam: 64,
    },
  },
  {
    name: "BitRunners",
    requirements: {
      server: "run4theh111z",
      computerRam: 128,
    },
  },
  {
    name: "Netburners",
    requirements: {
      hacknet: true,
    },
  },
  {
    name: "Tian Di Hui",
    requirements: {
      hack: 50,
      location: ["Chongqing", "New Tokyo", "Ishima"],
    },
  },
  {
    name: "Sector-12",
    requirements: {
      money: 15_000_000,
      location: ["Sector-12"],
      incompatible: ["Chongqing", "New Tokyo", "Ishima", "Volhaven"],
    },
  },
  {
    name: "Chongqing",
    requirements: {
      money: 20_000_000,
      location: ["Chongqing"],
      incompatible: ["Sector-12", "Aevum", "Volhaven"],
    },
  },
  {
    name: "New Tokyo",
    requirements: {
      money: 20_000_000,
      location: ["New Tokyo"],
      incompatible: ["Sector-12", "Aevum", "Volhaven"],
    },
  },
  {
    name: "Ishima",
    requirements: {
      money: 30_000_000,
      location: ["Ishima"],
      incompatible: ["Sector-12", "Aevum", "Volhaven"],
    },
  },
  {
    name: "Aevum",
    requirements: {
      money: 40_000_000,
      location: ["Aevum"],
      incompatible: ["Chongqing", "New Tokyo", "Ishima", "Volhaven"],
    },
  },
  {
    name: "Volhaven",
    requirements: {
      money: 50_000_000,
      location: ["Volhaven"],
      incompatible: ["Sector-12", "Aevum", "Chongqing", "New Tokyo", "Ishima"],
    },
  },
  {
    name: "ECorp",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "MegaCorp",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "KuaiGong International",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "Four Sigma",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "NWO",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "Blade Industries",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "OmniTek Incorporated",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "Bachman & Associates",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "Clarke Incorporated",
    requirements: {
      reputation: 200_000,
    },
  },
  {
    name: "Fulcrum Secret Technologies",
    requirements: {
      reputation: 250_000,
      server: "fulcrumassets",
    },
  },
  {
    name: "Slum Snakes",
    requirements: {
      strength: 30,
      defense: 30,
      dexterity: 30,
      agility: 30,
      karma: -9,
      money: 1_000_000,
    },
  },
  {
    name: "Tetrads",
    requirements: {
      location: ["Chongqing", "New Tokyo", "Ishima"],
      strength: 75,
      defense: 75,
      dexterity: 75,
      agility: 75,
      karma: -18,
    },
  },
  {
    name: "The Syndicate",
    requirements: {
      hack: 200,
      strength: 200,
      defense: 200,
      dexterity: 200,
      agility: 200,
      location: ["Aevum", "Sector-12"],
      money: 10_000_000,
      karma: -90,
    },
  },
  {
    name: "Speakers for the Dead",
    requirements: {
      hack: 100,
      strength: 300,
      defense: 300,
      dexterity: 300,
      agility: 300,
      karma: -45,
      kills: 30,
    },
  },
  {
    name: "The Dark Army",
    requirements: {
      hack: 300,
      strength: 300,
      defense: 300,
      dexterity: 300,
      agility: 300,
      location: ["Chongqing"],
      kills: 5,
      karma: -45,
    },
  },
  {
    name: "The Covenant",
    requirements: {
      augs: 20,
      money: 75_000_000_000,
      hack: 850,
      strength: 850,
      defense: 850,
      dexterity: 850,
      agility: 850,
    },
  },
  {
    name: "Daedalus",
    requirements: {
      augs: 30,
      money: 100_000_000_000,
      hack: 2500,
    },
  },
  {
    name: "Illuminati",
    requirements: {
      augs: 30,
      money: 150_000_000_000,
      hack: 1500,
      strength: 1200,
      defense: 1200,
      dexterity: 1200,
      agility: 1200,
    },
  },
];
