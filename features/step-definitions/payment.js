const { Given, When, Then } = require('@cucumber/cucumber');
const ethers = require('ethers');
const assert = require('assert');
const Payment = require('../../out/Payment.sol/Payment.json');
require('dotenv').config();

let deployedContractAliasMap = new Map();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

let signedMessage = "";
let messageHash = "";

Given('Payment contract is deployed, with alias {string}', async function (alias) {
    let provider = new ethers.providers.JsonRpcProvider();
    let signer = new ethers.Wallet(PRIVATE_KEY,provider);

    const paymentContractFactory = new ethers.ContractFactory(Payment.abi, Payment.bytecode, signer);
    const basePaymentContract = await paymentContractFactory.deploy();

    const deployedContract = await basePaymentContract.deployed();

    deployedContractAliasMap.set(alias, deployedContract);
});

When('A signature is generated for contract {string}'), async function(alias) {
    messageHash = generateMessageHash(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "1986982349",
        "9875640958",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    );
    signedMessage = await signMessage(messageHash);
}

Then('Contract {string} should return recipient address'), function(alias) {
    let reciepientAddress = deployedContractAliasMap.get(alias).recoverSigner(messageHash, signedMessage);
    assert.strictEqual(reciepientAddress, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
}


function generateMessageHash(recipient, amount, nonce, contractAddress) {
    let messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "address"],
        [
            recipient,
            amount,
            nonce,
            contractAddress
        ]
    );
}

async function signMessage(messageHash) {
    let signer = new ethers.Wallet(PRIVATE_KEY,provider);
    return await signer.signMessage(messageHash);
}

// "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//             "1986982349",
//             "9875640958",
//             "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

