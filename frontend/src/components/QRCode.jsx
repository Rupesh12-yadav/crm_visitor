import { useState, useEffect } from 'react';

const QRCode = ({ text, size = 128 }) => {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (text) {
      // Using QR Server API
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
      setQrUrl(url);
    }
  }, [text, size]);

  if (!text) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <img 
        src={qrUrl} 
        alt="QR Code" 
        className="border-2 border-gray-300 rounded-lg"
      />
      <p className="text-xs text-gray-500">Scan for details</p>
    </div>
  );
};

export default QRCode;
