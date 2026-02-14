import { useState } from "react";

function ConnectWallet() {
  const [account, setAccount] = useState(null);

  async function handleConnect() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  setAccount(accounts[0]);
}


 return (
  <div className="wallet-box">
    {account ? (
      <p className="wallet-address">Connected: {account}</p>
    ) : (
      <button onClick={handleConnect}>Connect Wallet</button>
    )}
  </div>
);
}

export default ConnectWallet;
