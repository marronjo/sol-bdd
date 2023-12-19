const { Given, When, Then } = require('@cucumber/cucumber');

const assert = require('assert');
const { ethers, JsonRpcProvider } = require('ethers');

const Counter = require('../../out/Counter.sol/Counter.json');
require('dotenv').config();

// Alias -> Deployed Contract Address
// e.g A -> 0x123....
let contractAliasMap = new Map();

//anvil private key
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

Given('Counter contract is deployed, with alias {string}', async function (alias) {
    let provider =  new JsonRpcProvider();
    let signer = new ethers.Wallet(PRIVATE_KEY,provider);

    const tokenContract = new ethers.ContractFactory(Counter.abi, Counter.bytecode, signer);

    const deployedContract = await tokenContract.deploy();
    contractAliasMap.set(alias, await deployedContract.getAddress())
});

When('The counter on deployed Counter contract {string} is incrimented', async function (alias) {
    let provider =  new JsonRpcProvider();
    let signer = new ethers.Wallet(PRIVATE_KEY,provider);

    let contract = new ethers.Contract(
        contractAliasMap.get(alias),
        Counter.abi,
        signer
    );

    await contract.increment();
});

Then('Then the stored value should be {int} in contract {string}', async function (value, alias) {
    let provider =  new JsonRpcProvider();
    let signer = new ethers.Wallet(PRIVATE_KEY,provider);

    let contract = new ethers.Contract(
        contractAliasMap.get(alias),
        Counter.abi,
        signer
    );
    
    assert.strictEqual(parseInt(await contract.number()), value);
});