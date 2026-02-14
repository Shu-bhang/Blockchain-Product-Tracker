import { useState } from "react";
import { getContract } from "../Blockchain";
import QRScanner from "./QRScanner";


function ViewProduct() {
  const [productId, setProductId] = useState("");
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");

  async function fetchHistory() {
    try {
      setStatus("Fetching from blockchain...");
      const contract = await getContract();
      const data = await contract.getProductHistory(productId);
      setHistory(data);
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to fetch data");
    }
  }

  return (
    <div>
      <h3>Track Product</h3>
        <QRScanner onScan={(text) => setProductId(text)} />

      <input
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />

      <button onClick={fetchHistory}>Track</button>

      <p>{status}</p>

      {history.map((item, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          <p><b>Batch Hash:</b> {item.batchHash}</p>
          <p><b>Location:</b> {item.location}</p>
          <p>
            <b>Time:</b>{" "}
            {new Date(Number(item.timestamp) * 1000).toLocaleString()}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ViewProduct;
