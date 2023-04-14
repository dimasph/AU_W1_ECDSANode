import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

//Helper function to hash a message:

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

//Helper function to get address:

function getAddress(publicKey) {
  const publicKeyValue = publicKey.slice(1);
  const hash = keccak256(publicKeyValue);
  const address = "0x" + toHex(hash.slice(-20));
  return address;
}

//Helper function to get signature:

async function getSignature(privateKey) {
  const message = hashMessage("Transaction under approval");
  let response = await secp.sign(message, privateKey, { recovered: true });
  return response;
}

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  signature,
  setSignature,
  publicKey,
  setPublicKey,
  recoveryBit,
  setRecoveryBit,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    console.log("Private Key:", privateKey);

    //Get public key from private key:
    const publicKey = secp.getPublicKey(privateKey);
    setPublicKey(toHex(publicKey));
    console.log("Public Key:", publicKey);

    //Get address from private key:
    const address = getAddress(publicKey);
    setAddress(address);
    console.log("Address:", address);

    //Get signature from private key:

    const response = await getSignature(privateKey);
    const [signature, recoveryBit] = response;
    console.log("Signature:", signature);
    console.log("Recovery Bit:", recoveryBit);
    setSignature(toHex(signature));
    setRecoveryBit(recoveryBit);

    //Get balance from address:
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Sign Transaction</h1>

      <label>
        Enter Private Key
        <input
          placeholder="Type your Private Key..."
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="result">Balance: {balance}</div>
      <div className="result">Public Key: {publicKey}</div>
      <div className="result">Address: {address}</div>
      <div className="result">Signature: {signature}</div>
      <div className="result">Recovery Bit: {recoveryBit}</div>
    </div>
  );
}

export default Wallet;
