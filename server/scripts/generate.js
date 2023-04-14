//Import ethereum-cryptography & utils:

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

//Get a valid ethereum format address:

function getAddress(publicKey) {
  const hash = keccak256(publicKey.slice(1));
  const address = "0x" + toHex(hash.slice(-20));
  return address;
}

//Generate private key:

const privateKey = secp.utils.randomPrivateKey();
console.log("private Key:", toHex(privateKey));

// Generate public key from private key:

const publicKey = secp.getPublicKey(privateKey);
console.log("Public Key:", toHex(publicKey));

// Generate address from public key:
const address = getAddress(publicKey);
console.log("Address:", address);
