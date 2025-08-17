import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';

function QRScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScanSuccess(result.data);
          scanner.stop();
          setScanning(false);
        },
        {
          highlightScanRegion: true,
        }
      );
      scannerRef.current = scanner;
      await scanner.start();
      setScanning(true);
    } catch (err) {
      console.error(err);
      setError('Could not start scanner. Please ensure camera access is granted.');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setScanning(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
      <video ref={videoRef} style={{ width: '100%', height: 'auto', border: '1px solid #ccc' }} />
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {scanning ? (
          <button className="btn btn-danger" onClick={stopScanner}>Stop Scanning</button>
        ) : (
          <button className="btn btn-primary" onClick={startScanner}>Start Scanning</button>
        )}
      </div>
    </div>
  );
}

export default QRScanner;