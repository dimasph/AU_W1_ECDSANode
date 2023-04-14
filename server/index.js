const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// Private Keys, Public Keys and Addresses created for testing:

// Account 1:

// private key: b6cec80a404266dc8c64f3f94f5e73dd23aaf2810fe263791691659e30fe3030
// public key: 040e0f18f33f40b11d853318134e556533a269dc0aff6590b01b5b09505c63a289dcaf6a8f14f7bdeb5771c331ee3428976c740c94a79e22605e5fc8a8b196321a
// address: 0xc33d03eb9faa09ad4cea2b8328bf4892adc2b914

// Account 2:

// private key: 66c1906d9ad1930ed511d2cc8bcac9679fac703241cc425f5a1f7b32a2ea7011
// public key: 04072ff11cc71f9b190dc6719ca4c0651ddeec5404b0ea5e671725efd3fb4a17f542a163ec022d497912998ad071ee7a99cbb0f16b0b70bbd9ccdbb249697e0691
// address: 0x621f5fc6c07053a13fb63eacd109373b2b39b4a6

// Account 3:

// private key: ed514ecfee493bb4fa1a9291d5a57939110700c87dbe206e175f81c0c42f8231
// public key: 0428cb874f47517a552af2399e8846ead912cb8978e1fb25e635a981b095aa890d5aab6ac2729c53c7226c4f57175fbb7e215e15220d75b3312ccb504df760c763
// address: 0x5019f1c71cb993efe882a1aaa8f851651166654a

const balances = {
  "0xc33d03eb9faa09ad4cea2b8328bf4892adc2b914": 150, // Ben
  "0x621f5fc6c07053a13fb63eacd109373b2b39b4a6": 100, // Alice
  "0x5019f1c71cb993efe882a1aaa8f851651166654a": 75, // Bob
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
