import { useState } from "react";
import { getContract } from "../Blockchain";

export default function addProduct() {
  const [productId, setProductId] = useState("");
  const [batchHash, setBatchHash] = useState("");
  const [location, setLocation] = useState("");

  const [status, setStatus] = useState(""); // idle | pending | success | error
  const [error, setError] = useState("");

  const handleAddProduct = async () => {
    try {
      setStatus("pending");
      setError("");

      const contract = await getContract();

      // Send transaction
      const tx = await contract.addProduct(
        productId,
        batchHash,
        location
      );

      // WAIT for blockchain confirmation
      await tx.wait();

      // Only after confirmation
      setStatus("success");

      // Clear form
      setProductId("");
      setBatchHash("");
      setLocation("");
    } catch (err) {
      console.error("AddProduct error:", err);
      setStatus("error");
      setError(err?.message || "Transaction failed");
    }
  };

  return (
    <div className="card">
      <h2>Add Product</h2>

      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Batch Hash"
        value={batchHash}
        onChange={(e) => setBatchHash(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={handleAddProduct}>
        Add to Blockchain
      </button>

      {/* STATUS MESSAGES */}
      {status === "pending" && (
        <p style={{ color: "orange" }}>⏳ Transaction pending...</p>
      )}

      {status === "success" && (
        <p style={{ color: "lightgreen" }}>✅ Product added successfully</p>
      )}

      {status === "error" && (
        <p style={{ color: "red" }}>❌ {error}</p>
      )}
    </div>
  );
}
