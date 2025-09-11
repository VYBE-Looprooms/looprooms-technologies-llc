import React from 'react';
import QRCodeVerification from '../components/QRCodeVerification';

const QRTestPage = () => {
  const handleComplete = () => {
    console.log('QR verification completed!');
    alert('QR verification completed successfully!');
  };

  const handleError = (error: string) => {
    console.error('QR verification error:', error);
    alert('QR verification error: ' + error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Verification Test</h1>
          <p className="text-gray-600">
            Testing the desktop-to-mobile handoff for identity verification
          </p>
        </div>
        
        <QRCodeVerification 
          onComplete={handleComplete}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default QRTestPage;
