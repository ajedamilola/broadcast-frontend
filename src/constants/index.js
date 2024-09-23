import { image1, image2, image3 } from "../assets";

export const recentSearch = [
  {
    name: "Page Turner",
    picture: image3,
    friends: 3,
  },
  {
    name: "Jessica Dunner",
    picture: image2,
    friends: 5,
  },
  {
    name: "Jude Adams",
    picture: image1,
    friends: 1,
  },
];

export const messagingABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "sendMessage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRecentMessages",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "msg",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTest",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
export const messagingContractAddress = "0x60bfc3f31da46800918429763135c107b5042987";
