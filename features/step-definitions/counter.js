const { Given, When, Then } = require('@cucumber/cucumber');
const ethers = require('ethers');
const assert = require('assert');
const Counter = require('../../out/Counter.sol/Counter.json');
require('dotenv').config();

let deployedContractAliasMap = new Map();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

Given('Counter contract is deployed, with alias {string}', async function (alias) {
    let provider = new ethers.providers.JsonRpcProvider();
    let signer = new ethers.Wallet(PRIVATE_KEY,provider);

    const tokenContractFactory = new ethers.ContractFactory(Counter.abi, Counter.bytecode, signer);
    const baseTokenContract = await tokenContractFactory.deploy();

    const deployedContract = await baseTokenContract.deployed();

    deployedContractAliasMap.set(alias, deployedContract);
});

When('the deployed Counter contract {string} is incrimented', async function (alias) {
    await deployedContractAliasMap.get(alias).increment();
});

When('the deployed Counter contract {string} is set to {int}', async function (alias, value) {
    await deployedContractAliasMap.get(alias).setNumber(value);
});

Then('the stored value should be equal to {int} in contract {string}', async function (value, alias) {
    let storedUint = await deployedContractAliasMap.get(alias).number();
    assert.strictEqual(parseInt(storedUint), value);
});

async function signMessage(recipient, amount, nonce, contractAddress) {
    let messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "address"],
        [
            recipient,
            amount,
            nonce,
            contractAddress
        ]
    );
    return await signer.signMessage(messageHash);
}

// "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//             "1986982349",
//             "9875640958",
//             "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"