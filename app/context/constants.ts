import abi from "./abi/Voting2.json";

export const ABI = abi.abi;
export const PROXY_CONTRACT_ADDRESS: string = process.env.PROXY_CONTRACT_ADDRESS || "0xE9171CB8331182906042551fe6F758680B7EF270";