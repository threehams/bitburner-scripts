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
  ns.getBitNodeMultipliers;
  const multipliers = ns.getBitNodeMultipliers();

  return crimes.map((crime) => {
    const stats = ns.getCrimeStats(crime);
    const chance = ns.getCrimeChance(crime);
    const incomeRate =
      (stats.money / (stats.time / 1000)) * chance * multipliers.CrimeMoney;

    return {
      name: crime,
      time: stats.time,
      chance,
      idealIncomeRate: stats.money / (stats.time / 1000),
      incomeRate,
      statRates: {
        dexterity:
          statRate(stats.dexterity_exp, stats.time, chance) *
          multipliers.CrimeExpGain,
        strength:
          statRate(stats.strength_exp, stats.time, chance) *
          multipliers.CrimeExpGain,
        hacking:
          statRate(stats.hacking_exp, stats.time, chance) *
          multipliers.CrimeExpGain,
        defense:
          statRate(stats.defense_exp, stats.time, chance) *
          multipliers.CrimeExpGain,
        agility:
          statRate(stats.agility_exp, stats.time, chance) *
          multipliers.CrimeExpGain,
        charisma:
          statRate(stats.charisma_exp, stats.time, chance) *
          multipliers.CrimeExpGain,
        karma: statRate(stats.karma * chance, stats.time, 1),
      },
    };
  });
};

const statRate = (stat: number, time: number, chance: number) => {
  const amount = stat * chance + stat * 0.25 * (1 - chance);
  return amount / (time / 1000);
};
