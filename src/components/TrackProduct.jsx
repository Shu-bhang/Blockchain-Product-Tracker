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
      setLoading(true);

      const contract = await getContract();
      const result = await contract.getProductHistory(productId);

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
    } finally {
      setLoading(false);
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

      <button onClick={handleTrack} disabled={loading || !productId}>
        {loading ? "⏳ Fetching…" : "Track"}
      </button>

      {error && (
        <div className="alert alert-error" style={{ marginTop: "12px" }}>
          ❌ {error}
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: "20px" }}>
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
      )}
    </div>
  );
}

