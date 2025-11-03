import abi from "./abi/newVoting.json";

export const ABI = abi.abi;
export const PROXY_CONTRACT_ADDRESS: string = process.env.PROXY_CONTRACT_ADDRESS || "0x0906f78029d966d14D7b7eEA4Bf00664D84Ca019";