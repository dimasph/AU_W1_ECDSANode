import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

async function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const message = await hashMessage("Transaction under approval");
    const retrievedPublicKey = secp.recoverPublicKey(
      message,
      signature,
      parseInt(recoveryBit)
    );
    if (publicKey !== toHex(retrievedPublicKey)) {
      alert("Invalid Public Key");
      console.log("Retrieved public key differs from input public key");
    } else {
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
          signature,
          recoveryBit: parseInt(recoveryBit),
          publicKey,
        });
        console.log(`${parseInt(sendAmount)} ETH transferred successfully.`);
        setBalance(balance);
      } catch (ex) {
        console.log("Transfer did not go through", ex);
        alert(ex.response.data.message);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Transaction Details</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient Address
        <input
          placeholder="Type a valid address (0x..)"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Sender Signature
        <input
          placeholder="Type a valid signature..."
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        Sender Recovery Bit
        <input
          placeholder="Type the recovery bit..."
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>

      <label>
        Sender Public Key
        <input
          placeholder="Type your public key..."
          value={publicKey}
          onChange={setValue(setPublicKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
