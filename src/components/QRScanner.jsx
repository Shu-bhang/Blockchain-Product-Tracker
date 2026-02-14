import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

function QRScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="qr-reader" />;
}

export default QRScanner;
