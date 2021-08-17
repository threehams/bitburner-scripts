// import { BitBurner } from "../types/bitburner";
// import { formatNumber } from "./formatNumber";
// import { findArg } from "./shared-args";

// const PROGRAMS = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe"];

// export const buyProgram = (ns: BitBurner, ram: number) => {
//   const count = findArg(ns.args, { key: "c", defaultValue: 1 });

//   const cost = ns.getPurchasedServerCost(ram);
//   if (canBuyProgram(ns, ram)) {
//     ns.print(
//       `buying ${count} server with ${ram}GB RAM for $${formatNumber(cost)}`
//     );
//     ns.purchaseServer("drone", ram);
//   }
// };

// export const canBuyProgram = (ns: BitBurner, ram: number) => {
//   return (
//     ns.getServerMoneyAvailable("home") >= cost &&
//     ns.getPurchasedServers().length < 25
//   );
// };
