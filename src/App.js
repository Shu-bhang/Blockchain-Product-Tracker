import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./App.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contract";
import { QRCodeCanvas } from "qrcode.react";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("auth") === "true"
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [account, setAccount] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState("");

  // Add Product States
  const [newHash, setNewHash] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [addStatus, setAddStatus] = useState(null); // null | "pending" | "success" | "error"
  const [addError, setAddError] = useState("");

  // Track Product States
  const [hashInput, setHashInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  // ── Login ──────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if (loginEmail === "admin@test.com" && loginPassword === "1234") {
      localStorage.setItem("auth", "true");
      localStorage.setItem("userId", loginEmail);
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setAccount("");
    setProducts([]);
    setGeneratedQR("");
  };

  // ── Connect Wallet ─────────────────────────────────────
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }
    try {
      setWalletLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setWalletLoading(false);
    }
  };

  // ── Add Product ────────────────────────────────────────
  const handleAddFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setAddStatus(null);
  };

  const addProduct = async () => {
    if (!newHash || !newName || !newAddress) return;
    if (!window.ethereum) {
      setAddStatus("error");
      setAddError("MetaMask is required to add products.");
      return;
    }

    setAddStatus("pending");
    setAddError("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.addProduct(newHash, newName, newAddress);
      await tx.wait();

      setGeneratedQR(newHash);

      await fetch("http://localhost:5000/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          productHash: newHash,
          name: newName,
          location: newAddress,
        }),
      }).catch((dbError) => {
        console.warn("Database sync failed (blockchain transaction succeeded):", dbError);
      });

      setAddStatus("success");
      setNewHash("");
      setNewName("");
      setNewAddress("");
    } catch (error) {
      console.error(error);
      setAddStatus("error");
      setAddError(error?.reason || error?.message || "Transaction failed. Please try again.");
    }
  };

  // ── Track Product History ──────────────────────────────
  const fetchHistory = async () => {
    if (!hashInput) return;
    setTrackLoading(true);
    setTrackError("");
    setProducts([]);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const history = await contract.getProductHistory(hashInput);

      const formatted = history.map((item) => ({
        hash: item.productId,
        name: item.batchHash,
        address: item.location,
        time: new Date(Number(item.timestamp) * 1000).toLocaleString(),
      }));

      setProducts(formatted);
      if (formatted.length === 0) {
        setTrackError("No history found for this product hash.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setTrackError("Failed to fetch product history. Check the hash and try again.");
    } finally {
      setTrackLoading(false);
    }
  };

  // ── QR Scanner ─────────────────────────────────────────
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
        () => {}
      );
    }
  }, [showScanner]);

  // ── Login Screen ───────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <span className="brand-icon">🔗</span>
          <h2>Blockchain Product Tracker</h2>
          <p>Secure Supply Chain Verification</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            {loginError && <p className="login-error">⚠ {loginError}</p>}
            <button type="submit" className="primary-btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main App ───────────────────────────────────────────
  return (
    <div className="app">
      {/* NAV / HERO */}
      <div className="hero">
        <div>
          <h1>🔗 Blockchain Product Tracker</h1>
          <p>Secure Supply Chain Verification using Ethereum</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!account ? (
            <button
              className="primary-btn large"
              onClick={connectWallet}
              disabled={walletLoading}
            >
              {walletLoading ? (
                <><span className="spinner" /> Connecting…</>
              ) : (
                "🦊 Connect Wallet"
              )}
            </button>
          ) : (
            <div className="wallet-box">
              🟢<span>{account.slice(0, 6)}…{account.slice(-4)}</span>
            </div>
          )}
          <button className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="grid">

          {/* STATS BAR */}
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
              <p><span className="dot" /> Connected</p>
            </div>
          </div>

          {/* ADD PRODUCT */}
          <div className="card">
            <h2>📦 Add Product</h2>

            <input
              type="text"
              placeholder="Product Hash"
              value={newHash}
              onChange={handleAddFieldChange(setNewHash)}
            />
            <input
              type="text"
              placeholder="Product Name"
              value={newName}
              onChange={handleAddFieldChange(setNewName)}
            />
            <input
              type="text"
              placeholder="Product Location / Address"
              value={newAddress}
              onChange={handleAddFieldChange(setNewAddress)}
            />

            <button
              className="primary-btn"
              onClick={addProduct}
              disabled={addStatus === "pending" || !newHash || !newName || !newAddress}
            >
              {addStatus === "pending" ? (
                <><span className="spinner" /> Submitting Transaction…</>
              ) : (
                "Add to Blockchain"
              )}
            </button>

            {addStatus === "success" && (
              <div className="alert alert-success">✅ Product added to blockchain successfully!</div>
            )}
            {addStatus === "error" && (
              <div className="alert alert-error">❌ {addError}</div>
            )}
            {addStatus === "pending" && (
              <div className="alert alert-pending">⏳ Transaction pending — awaiting blockchain confirmation…</div>
            )}
          </div>

          {/* GENERATED QR */}
          {generatedQR && (
            <div className="card">
              <h2>📱 Product QR Code</h2>
              <div className="qr-wrapper">
                <QRCodeCanvas value={generatedQR} size={200} />
                <div className="qr-hash">{generatedQR}</div>
              </div>
            </div>
          )}

          {/* TRACK PRODUCT */}
          <div className="card" style={{ gridColumn: generatedQR ? "span 1" : "span 1" }}>
            <h2>🔎 Track Product</h2>

            <div className="input-section">
              <input
                type="text"
                placeholder="Enter Product Hash"
                value={hashInput}
                onChange={(e) => { setHashInput(e.target.value); setTrackError(""); }}
              />
              <button
                className="primary-btn"
                onClick={fetchHistory}
                disabled={trackLoading || !hashInput}
              >
                {trackLoading ? <><span className="spinner" /> Fetching…</> : "Get History"}
              </button>
              <button
                className="secondary-btn"
                onClick={() => setShowScanner(!showScanner)}
              >
                {showScanner ? "Close Scanner" : "📷 Scan QR"}
              </button>
            </div>

            {showScanner && <div id="reader" />}

            {trackError && (
              <div className="alert alert-error">⚠ {trackError}</div>
            )}

            {products.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Hash</th>
                      <th>Product Name</th>
                      <th>Location</th>
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
              </div>
            )}

            {!trackLoading && !trackError && products.length === 0 && hashInput === "" && (
              <div className="empty-state">
                Enter a product hash above to view its blockchain history.
              </div>
            )}
          </div>

        </div>
      </div>

      <footer className="footer">
        Blockchain Product Tracker © 2026 — Powered by Ethereum
      </footer>
    </div>
  );
}

export default App;

