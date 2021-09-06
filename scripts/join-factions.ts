import { BitBurner, City, FactionName } from "../types/bitburner";
import { canNuke } from "./shared-can-nuke";
import { findPath } from "./shared-find-path";
import { improveStats } from "./shared-improve-stats";
import { nukeAll } from "./shared-nuke-all";
import { range } from "./shared-range";
import { waitFor } from "./shared-wait-for";

export const doc = eval("doc" + "ument");

type FactionInfo = {
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

export async function main(ns: BitBurner) {
  ns.tail();
  const { v: verbose, maxStats } = ns.flags([
    ["v", false],
    ["maxStats", 0],
  ]);
  ns.disableLog("getServerRequiredHackingLevel");
  ns.disableLog("getHackingLevel");
  ns.disableLog("getServerMaxMoney");
  ns.disableLog("getServerMoneyAvailable");
  ns.disableLog("getServerSecurityLevel");
  ns.disableLog("getServerMinSecurityLevel");
  ns.disableLog("sleep");
  ns.disableLog("getServerNumPortsRequired");
  ns.disableLog("fileExists");
  ns.disableLog("scan");

  const player = ns.getPlayer();
  nukeAll(ns);

  for (const faction of factions) {
    if (player.factions.includes(faction.name)) {
      verbose && ns.tprint("Already joined: ", faction.name);
      continue;
    }

    const failures = getFailedRequirements(ns, faction);
    verbose && ns.tprint(`Failed requirements for ${faction.name}: `, failures);

    // nothing to be done here
    if (failures.incompatible) {
      verbose &&
        ns.tprint(`${faction.name} is incompatible with joined factions`);
      continue;
    }

    // handle these over time
    if (
      failures.augs ||
      failures.computerRam ||
      failures.hack ||
      failures.money ||
      failures.reputation
    ) {
      verbose && ns.tprint("Requirements can't be met automatically");
      continue;
    }
    if (failures.hacknet) {
      if (!buyHacknetNodes(ns)) {
        verbose &&
          ns.tprint("Failed to purchase hacknet nodes: ", faction.name);
        continue;
      }
    }

    if (failures.location && faction.requirements.location) {
      if (!ns.travelToCity(faction.requirements.location[0])) {
        verbose && ns.tprint("Failed to travel: ", faction.name);
        continue;
      }
    }
    if (
      failures.strength ||
      failures.defense ||
      failures.dexterity ||
      failures.agility
    ) {
      const {
        strength = 0,
        defense = 0,
        dexterity = 0,
        agility = 0,
      } = faction.requirements;
      if (Math.max(strength, defense, dexterity, agility) > maxStats) {
        verbose && ns.tprint("requirements are higher than max specified");
        continue;
      }
      await improveStats(ns, {
        strength,
        defense,
        dexterity,
        agility,
        charisma: 0,
      });
    }

    if (faction.requirements.server) {
      const { server } = faction.requirements;
      if (!canNuke(ns, server) || !canHack(ns, server)) {
        continue;
      }
      verbose && ns.tprint("Installing backdoor on ", server);

      const path = findPath(ns, "home", undefined, server);
      path.forEach((server) => {
        ns.connect(server);
      });
      await ns.installBackdoor();
      path.reverse().forEach((server) => {
        ns.connect(server);
      });
    }

    if (faction.requirements.kills) {
      while (ns.getPlayer().numPeopleKilled < faction.requirements.kills) {
        const time = ns.commitCrime("homicide");
        await ns.sleep(time + 250);
      }
    }

    if (faction.requirements.karma) {
      while (ns.heart.break() > faction.requirements.karma) {
        const time = ns.commitCrime("homicide");
        await ns.sleep(time + 250);
      }
    }

    try {
      await waitFor(
        ns,
        () => {
          const invitations = ns.checkFactionInvitations();
          if (invitations.includes(faction.name)) {
            ns.tprint("Joined faction: ", faction.name);
            ns.joinFaction(faction.name);
            return true;
          }
        },
        60000
      );
    } catch (err) {
      ns.tprint(`Couldn't join ${faction.name} within 60 seconds, skipping...`);
    }
  }
}

const canHack = (ns: BitBurner, server: string) => {
  return ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel();
};

const getFailedRequirements = (ns: BitBurner, factionInfo: FactionInfo) => {
  const { name: faction, requirements: req } = factionInfo;
  const failures: { [Key in keyof FactionInfo["requirements"]]?: boolean } = {};
  const player = ns.getPlayer();
  if (req.incompatible) {
    for (const incFaction of req.incompatible) {
      if (player.factions.includes(incFaction)) {
        failures.incompatible = true;
      }
    }
  }
  if (req.augs && ns.getOwnedAugmentations().length < req.augs) {
    failures.augs = true;
  }
  if (req.computerRam && ns.getServerMaxRam("home") < req.computerRam) {
    failures.computerRam = true;
  }
  for (const stat of ["strength", "dexterity", "defense", "agility"] as const) {
    if (req[stat] && player[stat] < req[stat]!) {
      failures[stat] = true;
    }
  }
  if (req.hack && ns.getHackingLevel() < req.hack) {
    failures.hack = true;
  }
  if (req.hacknet && ns.hacknet.numNodes() < 8) {
    failures.hacknet = true;
  }
  if (req.karma && ns.heart.break() > req.karma) {
    failures.karma = true;
  }
  if (req.kills && player.numPeopleKilled < req.kills) {
    failures.kills = true;
  }
  if (req.location && !req.location.includes(player.location)) {
    failures.location = true;
  }
  if (req.money && ns.getServerMoneyAvailable("home") < req.money) {
    failures.money = true;
  }
  if (req.reputation && ns.getFactionRep(faction) < req.reputation) {
    failures.reputation = true;
  }
  if (req.server && !ns.hasRootAccess(req.server)) {
    failures.server = true;
  }
  return failures;
};

const buyHacknetNodes = (ns: BitBurner) => {
  const currentNodes = ns.hacknet.numNodes();
  let cost = 0;
  const actions = [];
  for (const index of range(0, 8)) {
    if (index > currentNodes - 1) {
      cost += ns.formulas.hacknetNodes.hacknetNodeCost(index);
      actions.push(() => ns.hacknet.purchaseNode());
      cost += ns.formulas.hacknetNodes.ramUpgradeCost(1, 2);
      actions.push(() => ns.hacknet.upgradeRam(index, 1));
      cost += ns.formulas.hacknetNodes.levelUpgradeCost(1, 13);
      actions.push(() => ns.hacknet.upgradeLevel(index, 12));
      continue;
    }
    const stats = ns.hacknet.getNodeStats(index);
    if (stats.ram < 2) {
      cost += ns.formulas.hacknetNodes.ramUpgradeCost(stats.ram, 2);
      actions.push(() => ns.hacknet.upgradeRam(index, 2 - stats.ram));
    }
    if (stats.level < 13) {
      cost += ns.formulas.hacknetNodes.levelUpgradeCost(stats.level, 13);
      actions.push(() => ns.hacknet.upgradeLevel(index, 13 - stats.level));
    }
  }

  if (ns.getServerMoneyAvailable("home") < cost) {
    return false;
  }

  actions.forEach((action) => {
    action();
  });
  return true;
};
