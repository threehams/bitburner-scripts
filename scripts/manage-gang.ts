import { BitBurner } from "../types/bitburner";

export const main = async (ns: BitBurner) => {
  ns.tail();
  const { dryRun, v } = ns.flags([
    ["dryRun", false],
    ["v", false],
  ]);
  const verbose = v || dryRun;

  while (true) {
    if (ns.gang.canRecruitMember()) {
      const current = ns.gang.getMemberNames();
      const nextName = sample(names.filter((name) => !current.includes(name)));
      verbose && ns.tprint("recruiting member with name: ", nextName);
      !dryRun && ns.gang.recruitMember(nextName);
      !dryRun && ns.gang.setMemberTask(nextName, "Train Hacking");
    }
    for (const dude of ns.gang.getMemberNames()) {
      const dudeStats = ns.gang.getMemberInformation(dude);
      const ascensionMultiplier =
        getAscensionMultiplier(
          dudeStats.hack_asc_points - 1000 + dudeStats.hack_exp,
        ) / getAscensionMultiplier(dudeStats.hack_asc_points - 1000);
      ns.tprint(ascensionMultiplier);
      if (ascensionMultiplier > 2) {
        verbose && ns.tprint("ascending: ", dude);
        !dryRun && ns.gang.ascendMember(dude);
      }
      const owned = dudeStats.upgrades;
      const upgrades = ns.gang.getEquipmentNames().filter((equipment) => {
        return ["Rootkit", "Augmentation"].includes(
          ns.gang.getEquipmentType(equipment),
        );
      });
    }

    // now what to do...

    // phases:
    const stats = ns.gang.getGangInformation();
    const dudes = ns.gang.getMemberNames();
    if (dudes.length < 5) {
      if (stats.wantedLevelGainRate < -10) {
        for (const dude of dudes) {
          ns.gang.setMemberTask(dude, "Ethical Hacking");
        }
      } else {
        for (const dude of dudes) {
          ns.gang.setMemberTask(dude, "Ransomware");
        }
      }
    } else {
      for (const dude of dudes) {
        const stats = ns.gang.getMemberInformation(dude);
        ns.gang.setMemberTask(dude, "Ethical Hacking");
      }
    }
    // build up respect, recruit to 5 (?)
    // build up stats to hacking 1400 (?)
    // commit terrorism, get respect, recruit to 11
    // balance terrorism with laundering
    await ns.sleep(10000);
  }
};

const sample = <T extends unknown>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getAscensionMultiplier = (points: number) => {
  return Math.max(Math.pow(points / 4000, 0.7), 1);
};

const names = [
  "Beethoven",
  "Mozart",
  "Bach",
  "Chopin",
  "Tchaikovsky",
  "Brahms",
  "Debussy",
  "Handel",
  "Vivaldi",
  "Haydn",
  "Verdi",
  "Widor",
  "Schubert",
  "Stravinsky",
  "Mahler",
  "Grieg",
  "Liszt",
  "Schumann",
  "Rachmaninoff",
  "Gershwin",
  "Bernstein",
  "Mendelssohn",
  "Wagner",
  "Korsakov",
  "Dvorak",
  "Elgar",
  "Shostakovich",
  "Strauss",
  "Prokofiev",
  "Britten",
  "Rossini",
  "Ravel",
  "Purcell",
  "Puccini",
];
