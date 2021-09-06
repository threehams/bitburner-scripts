import { BitBurner } from "../types/bitburner";
import { MinStats, improveStats } from "./shared-improve-stats";

export const main = async (ns: BitBurner) => {
  const {
    min,
    str: strength,
    def: defense,
    dex: dexterity,
    agi: agility,
    cha: charisma,
    combat,
  } = ns.flags([
    ["min", 0],
    ["str", 0],
    ["def", 0],
    ["dex", 0],
    ["agi", 0],
    ["cha", 0],
    ["combat", 0],
  ]);
  ns.tail();

  const minStats: MinStats = {
    strength: min || strength || combat,
    defense: min || defense || combat,
    dexterity: min || dexterity || combat,
    agility: min || agility || combat,
    charisma: min || charisma,
  };

  await improveStats(ns, minStats);
};
