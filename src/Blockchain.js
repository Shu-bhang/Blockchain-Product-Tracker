import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x4978cD8148404F0f485AFdaA404a31C216Ace249";

const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_productId", "type": "string" },
      { "internalType": "string", "name": "_batchHash", "type": "string" },
      { "internalType": "string", "name": "_location", "type": "string" }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_productId", "type": "string" }
    ],
    "name": "getProductHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "productId", "type": "string" },
          { "internalType": "string", "name": "batchHash", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct ProductTracker.Product[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
}
