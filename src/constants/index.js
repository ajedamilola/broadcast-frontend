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
      },
      {
        "internalType": "uint128",
        "name": "date",
        "type": "uint128"
      },
      {
        "internalType": "string",
        "name": "replying",
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
        "internalType": "uint64",
        "name": "message_id",
        "type": "uint64"
      }
    ],
    "name": "reactToMessage",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const messagingContractAddress = "0xc5af4fdeb6adb5b8b668ec94e5e63162a9ab854c";
