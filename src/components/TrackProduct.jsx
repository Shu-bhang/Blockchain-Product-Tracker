import { useState } from "react";
import { getContract } from "../Blockchain";

export default function TrackProduct() {
  const [productId, setProductId] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleTrack = async () => {
  try {
    setError("");
    setHistory([]);

    const contract = await getContract();

    console.log("Calling contract...");
    const result = await contract.getProductHistory(productId);

    console.log("Raw result:", result);

    if (!result || result.length === 0) {
      throw new Error("No data found");
    }

    const formatted = result.map(p => ({
      productId: p.productId,
      batchHash: p.batchHash,
      location: p.location,
      timestamp: new Date(Number(p.timestamp) * 1000).toLocaleString()
    }));

    setHistory(formatted);
  } catch (err) {
    console.error("TRACK ERROR:", err);
    setError("Failed to fetch data");
  }
};


  return (
    <div className="card">
      <h2>Track Product</h2>

      <input
        type="text"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <button onClick={handleTrack}>Track</button>

      {loading && <p>⏳ Fetching data...</p>}

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {history.map((item, index) => (
        <div key={index} className="history-item">
          <p><b>Product ID:</b> {item.productId}</p>
          <p><b>Batch Hash:</b> {item.batchHash}</p>
          <p><b>Location:</b> {item.location}</p>
          <p><b>Timestamp:</b> {item.timestamp}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
{error && (
  <p style={{ color: "red", marginTop: "10px" }}>
    ❌ {error}
  </p>
)}

{history.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h3>Product History</h3>

    {history.map((item, index) => (
      <div
        key={index}
        style={{
          background: "#1f3a40",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "10px"
        }}
      >
        <p><strong>Product ID:</strong> {item.productId}</p>
        <p><strong>Batch Hash:</strong> {item.batchHash}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Timestamp:</strong> {item.timestamp}</p>
      </div>
    ))}
  </div>
)}
