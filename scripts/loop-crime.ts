import { BitBurner, Crime } from "../types/bitburner";

export async function main(ns: BitBurner) {
  const crime = ns.args.join(" ") as Crime;
  ns.tail();
  while (true) {
    if (!ns.isBusy()) {
      ns.commitCrime(crime);
    }
    await ns.sleep(1000);
  }
}
