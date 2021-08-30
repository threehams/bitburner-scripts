import { BitBurner } from "../types/bitburner";
import { crimeList } from "./shared-crime-list";
import { formatNumber } from "./shared-format-number";
import { makeTable } from "./shared-make-table";

export async function main(ns: BitBurner) {
  const crimes = crimeList(ns)
    .slice()
    .sort((a, b) => {
      return a.incomeRate < b.incomeRate ? 1 : -1;
    });

  makeTable(
    [
      [
        "chance",
        "income rate",
        "rate (ideal)",
        "hack",
        "str",
        "def",
        "dex",
        "agi",
        "cha",
        "name",
      ],
    ].concat(
      crimes.map((crime) => {
        return [
          `${Math.floor(crime.chance * 100)}%`,
          `$${formatNumber(Math.round(crime.incomeRate))}/sec`,
          `$${formatNumber(Math.round(crime.idealIncomeRate))}/sec`,
          `${formatNumber(crime.statRates.hacking.toFixed(2))}/sec`,
          `${formatNumber(crime.statRates.strength.toFixed(2))}/sec`,
          `${formatNumber(crime.statRates.defense.toFixed(2))}/sec`,
          `${formatNumber(crime.statRates.dexterity.toFixed(2))}/sec`,
          `${formatNumber(crime.statRates.agility.toFixed(2))}/sec`,
          `${formatNumber(crime.statRates.charisma.toFixed(2))}/sec`,
          crime.name,
        ];
      })
    )
  ).forEach((row) => ns.tprint(row));
}
