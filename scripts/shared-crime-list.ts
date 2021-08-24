import { BitBurner, Crime } from "../types/bitburner";

const crimes: Crime[] = [
  "shoplift",
  "rob store",
  "mug",
  "larceny",
  "deal drugs",
  "bond forgery",
  "traffick arms",
  "homicide",
  "grand theft auto",
  "kidnap",
  "assassinate",
  "heist",
];
export const crimeList = (ns: BitBurner) => {
  ns.getCrimeStats;
  ns.getCrimeChance;

  return crimes.map((crime) => {
    const stats = ns.getCrimeStats(crime);
    const chance = ns.getCrimeChance(crime);
    const incomeRate = (stats.money / (stats.time / 1000)) * chance;

    return {
      name: stats.name,
      time: stats.time,
      chance,
      idealIncomeRate: stats.money / (stats.time / 1000),
      incomeRate,
      statRates: {
        dexterity: statRate(stats.dexterity_exp, stats.time),
        strength: statRate(stats.strength_exp, stats.time),
        hacking: statRate(stats.hacking_exp, stats.time),
        defense: statRate(stats.defense_exp, stats.time),
        agility: statRate(stats.agility_exp, stats.time),
        charisma: statRate(stats.charisma_exp, stats.time),
      },
    };
  });
};

const statRate = (stat: number, time: number) => {
  return stat / (time / 1000);
};
