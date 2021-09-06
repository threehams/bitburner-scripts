import { BitBurner } from "../types/bitburner";

export const factionList = (ns: BitBurner) => {
  const ownedAugs = ns.getOwnedAugmentations();

  return factions.map((factionName) => {
    const favor = ns.getFactionFavor(factionName);
    const augs = ns.getAugmentationsFromFaction(factionName);
    return {
      name: factionName,
      favor,
      nextFavor: ns.getFactionFavorGain(factionName) + favor,
      augs: augs.length,
      newAugs: augs.filter((aug) => !ownedAugs.includes(aug)).length,
    };
  });
};

const factions = [
  "Aevum",
  "Bachman & Associates",
  "BitRunners",
  "Blade Industries",
  "Bladeburners",
  "Chongqing",
  "Clarke Incorporated",
  "CyberSec",
  "Daedalus",
  "ECorp",
  "Four Sigma",
  "Fulcrum Secret Technologies",
  "Illuminati",
  "Ishima",
  "KuaiGong International",
  "MegaCorp",
  "Netburners",
  "New Tokyo",
  "NiteSec",
  "NWO",
  "OmniTek Incorporated",
  "Sector-12",
  "Silhouette",
  "Slum Snakes",
  "Speakers for the Dead",
  "Tetrads",
  "The Black Hand",
  "The Covenant",
  "The Dark Army",
  "The Syndicate",
  "Tian Di Hui",
  "Volhaven",
] as const;
