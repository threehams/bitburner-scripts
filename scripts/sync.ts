import { BitBurner } from "../types/bitburner";

export async function main(ns: BitBurner) {
  await ns.wget("http://localhost:18718/manifest.json", "manifest.txt");
  const manifest = JSON.parse(ns.read("manifest.txt") as string);
  ns.rm("manifest.txt");
  for (const file of manifest) {
    await ns.wget(`http://localhost:18718/${file}`, file.split("_").pop());
  }
  for (const server of ns.getPurchasedServers()) {
    for (const file of manifest) {
      ns.scp(file, server);
    }
  }
}
