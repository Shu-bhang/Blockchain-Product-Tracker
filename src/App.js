import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./App.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contract";


function App() {
  const [account, setAccount] = useState("");

  // Add Product States
  const [newHash, setNewHash] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");

  // Track Product States
  const [hashInput, setHashInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);

  // 🔗 Connect Wallet
 const connectWallet = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not detected");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);

  } catch (error) {
    console.error("Wallet connection error:", error);
    alert("Connection failed");
  }
};
  // ➕ Add Product (Simulating Blockchain Add)
  const addProduct = async () => {
  if (!newHash || !newName || !newAddress) return;

  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );

    const tx = await contract.addProduct(
      newHash,       // productId
      newName,       // batchHash (you were using name field)
      newAddress     // location
    );

    await tx.wait();

    alert("Product added to blockchain!");

    setNewHash("");
    setNewName("");
    setNewAddress("");

  } catch (error) {
    console.error(error);
    alert("Transaction failed");
  }
};


  // 🔎 Track Product History
  const fetchHistory = async () => {
  if (!hashInput) return;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider
    );

    const history = await contract.getProductHistory(hashInput);

    const formatted = history.map((item) => ({
      hash: item.productId,
      name: item.batchHash,
      address: item.location,
      time: new Date(Number(item.timestamp) * 1000).toLocaleString(),
    }));

    setProducts(formatted);

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Error fetching history");
  }
};



  // 📷 QR Scanner
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          setHashInput(decodedText);
          setShowScanner(false);
          scanner.clear();
        },
        (error) => {}
      );
    }
  }, [showScanner]);
  

  return (
  <div className="app">
    <div className="container">

      {/* ================= HERO ================= */}
      <div className="hero">
        <div>
          <h1>Blockchain Product Tracker</h1>
          <p>Secure Supply Chain Verification using Ethereum</p>
        </div>

        {!account ? (
          <button className="primary-btn large" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-box">
            Connected:
            <span> {account.slice(0, 10)}...</span>
          </div>
        )}
      </div>

      {/* ================= GRID SECTION ================= */}
      <div className="grid">

        {/* -------- ADD PRODUCT -------- */}
        <div className="stats">
        <div>
        <h3>Smart Contract</h3>
        <p>Active</p>
        </div>
        <div>
        <h3>Network</h3>
        <p>Sepolia</p>
        </div>
        <div>
        <h3>Status</h3>
        <p>
        <span className="dot"></span> Connected
        </p>
        </div>
        </div>

        <div className="card">
          <h2>📦 Add Product</h2>

          <input
            type="text"
            placeholder="Product Hash"
            value={newHash}
            onChange={(e) => setNewHash(e.target.value)}
          />

          <input
            type="text"
            placeholder="Product Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Product Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />

          <button className="primary-btn" onClick={addProduct}>
            Add to Blockchain
          </button>
        </div>

        {/* -------- TRACK PRODUCT -------- */}
        <div className="card">
          <h2>🔎 Track Product</h2>

          <div className="input-section">
            <input
              type="text"
              placeholder="Enter Product Hash"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
            />

            <button className="primary-btn" onClick={fetchHistory}>
              Get History
            </button>

            <button
              className="secondary-btn"
              onClick={() => setShowScanner(!showScanner)}
            >
              Scan QR
            </button>
          </div>

          {showScanner && (
            <div id="reader" style={{ marginTop: "20px" }}></div>
          )}

          {products.length > 0 && (
            <table>
              {products.length === 0 && (
                <div className="empty-state">
                No product history loaded yet.
                </div>
                )}
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Product Name</th>
                  <th>Product Address</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={index}>
                    <td>{item.hash}</td>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
    <footer className="footer">
      Blockchain Product Tracker © 2026
    </footer>
  </div>
);
}
export default App;
