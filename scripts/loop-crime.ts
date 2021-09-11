import { BitBurner, Crime } from "../types/bitburner";
import { crimeList } from "./shared-crime-list";

export async function main(ns: BitBurner) {
  const crime = ns.args.join(" ") as Crime;

  ns.tail();
  while (true) {
    const targetCrime =
      crime ||
      crimeList(ns)
        .slice()
        .filter((crime) => crime.chance > 0.25 || crime.time < 10)
        .sort((a, b) => {
          return b.incomeRate - a.incomeRate;
        })[0].name;
    if (!ns.isBusy()) {
      ns.commitCrime(targetCrime);
    }
    await ns.sleep(1000);
  }
}
