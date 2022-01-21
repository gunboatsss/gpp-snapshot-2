require('dotenv').config();
const { ethers } = require("ethers");
const fs = require('fs');
const provider = new ethers.providers.InfuraProvider(1, process.env.INFURA_KEY);
const address = "0x2CA8723B766fFEd1FDA5eC9Ff925f564CE5AB28e";
const abi = [{ "inputs": [{ "internalType": "address", "name": "token_", "type": "address" }, { "internalType": "bytes32", "name": "merkleRoot_", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "recipient", "type": "address" }], "name": "Withdraw", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }, { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32[]", "name": "merkleProof", "type": "bytes32[]" }], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "isClaimed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "merkleRoot", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const contract = new ethers.Contract(address, abi, provider);
let eventFilter = contract.filters.Claimed();

async function getClaimedAddress() {
    return await contract.queryFilter(eventFilter, 13514985).then(
        x => {
            y = new Map();
            x.forEach(element => {
                y.set(element.args[1], element.transactionHash);
            });
            return y;
        }
    );
}

async function printClaimedAddress() {
    fs.mkdirSync('snapshot', {recursive: true});
    let claimedWriteStream = fs.createWriteStream('./snapshot/claimed.csv');
    claimedWriteStream.write("address,txHash\n");
    let txMap = await getClaimedAddress();
    console.log(txMap.size);
    txMap.forEach((value, key) => {
        claimedWriteStream.write(key + ',' + value + '\n');
    });
}
printClaimedAddress();