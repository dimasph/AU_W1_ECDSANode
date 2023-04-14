import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        signature={signature}
        setSignature={setSignature}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
        recoveryBit={recoveryBit}
        setRecoveryBit={setRecoveryBit}
      />
      <Transfer setBalance={setBalance} address={address} />
    </div>
  );
}

export default App;
