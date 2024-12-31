"use client"
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';  // Changed to QRCodeSVG import

const QRCodeGenerator = ({ url }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !url) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg">
      <QRCodeSVG 
        value={url} 
        size={256} 
        level="H"
        className="rounded-lg"
        includeMargin={true}
      />
    </div>
  );
};

export default QRCodeGenerator;