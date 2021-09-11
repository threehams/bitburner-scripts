import { BitBurner } from "../types/bitburner";
import { canNuke } from "./shared-can-nuke";
import { FactionInfo, factionList } from "./shared-faction-list";
import { findPath } from "./shared-find-path";
import { improveStats } from "./shared-improve-stats";
import { nukeAll } from "./shared-nuke-all";
import { range } from "./shared-range";
import { waitFor } from "./shared-wait-for";

export async function main(ns: BitBurner) {
  ns.tail();
  const {
    v: verbose,
    maxStats,
    a: all,
  } = ns.flags([
    ["v", false],
    ["maxStats", 0],
    ["a", false],
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
  await nukeAll(ns);

  const factions = factionList(ns);
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
