import { BitBurner } from "../types/bitburner";

const stats = [
  "strength",
  "defense",
  "dexterity",
  "agility",
  "charisma",
] as const;
const statNames = {
  strength: "str",
  defense: "def",
  dexterity: "dex",
  agility: "agi",
  charisma: "cha",
} as const;

export type MinStats = { [key in typeof stats[number]]: number };
export const improveStats = async (ns: BitBurner, minStats: MinStats) => {
  ns.getPlayer;
  ns.stopAction();

  while (true) {
    const stat = statToTrain(ns, minStats);
    if (!stat) {
      break;
    }

    if (stat.name === "charisma") {
      if (ns.getPlayer().location !== "Volhaven") {
        ns.travelToCity("Volhaven");
      }
      ns.universityCourse("ZB Institute Of Technology", "Leadership");
    } else {
      if (ns.getPlayer().location !== "Sector-12") {
        ns.travelToCity("Sector-12");
      }
      ns.gymWorkout("Powerhouse Gym", statNames[stat.name]);
    }

    await ns.sleep(20000);
    ns.stopAction();
  }
};

const statToTrain = (
  ns: BitBurner,
  minStats: MinStats
): { name: typeof stats[number]; value: number } | undefined => {
  const player = ns.getPlayer();

  return stats
    .map((stat) => ({ name: stat, value: player[stat] }))
    .filter((stat) => stat.value < minStats[stat.name])
    .sort((a, b) => {
      return a.value < b.value ? -1 : 1;
    })[0];
};
