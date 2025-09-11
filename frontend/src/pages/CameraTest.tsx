import React from 'react';
import CameraDebugger from '../components/CameraDebugger';

const CameraTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Camera Test & Debug</h1>
        <CameraDebugger />
        
        <div className="mt-8 text-center text-gray-600">
          <p>This page helps debug camera issues.</p>
          <p>Check the console for additional debug information.</p>
        </div>
      </div>
    </div>
  );
};

export default CameraTestPage;