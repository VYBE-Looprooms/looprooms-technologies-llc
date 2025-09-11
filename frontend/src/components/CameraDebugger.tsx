import React, { useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const CameraDebugger: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [debug, setDebug] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const addDebug = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebug(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[CameraDebug] ${message}`);
  }, []);

  const startCamera = useCallback(async () => {
    addDebug('🔍 Starting camera debug...');
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addDebug('❌ getUserMedia not supported');
        return;
      }

      addDebug('✅ getUserMedia is supported');

      // Get available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      addDebug(`📷 Found ${videoDevices.length} video devices`);

      // Try to get a simple video stream
      addDebug('📡 Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      addDebug(`✅ Got media stream with ${mediaStream.getVideoTracks().length} video tracks`);
      
      // Log stream details
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        addDebug(`📊 Video track: ${settings.width}x${settings.height}, ${settings.frameRate}fps`);
      }

      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        addDebug('🎬 Setting video source...');
        
        video.srcObject = mediaStream;
        
        video.onloadedmetadata = () => {
          addDebug(`📐 Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
        };

        video.oncanplay = () => {
          addDebug('▶️ Video can play');
        };

        video.onplaying = () => {
          addDebug('🎥 Video is playing');
          setIsStreaming(true);
        };

        video.onerror = (e) => {
          addDebug(`❌ Video error: ${e}`);
        };

        try {
          await video.play();
          addDebug('✅ Video.play() succeeded');
        } catch (err) {
          addDebug(`❌ Video.play() failed: ${err.message}`);
        }
      }

    } catch (err) {
      addDebug(`❌ Camera error: ${err.message}`);
    }
  }, [addDebug]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        addDebug(`🛑 Stopped track: ${track.kind}`);
      });
      setStream(null);
      setIsStreaming(false);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream, addDebug]);

  const clearDebug = () => {
    setDebug([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Camera Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={startCamera} disabled={isStreaming}>
            Start Camera
          </Button>
          <Button onClick={stopCamera} disabled={!isStreaming}>
            Stop Camera
          </Button>
          <Button onClick={clearDebug} variant="outline">
            Clear Log
          </Button>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 bg-black border rounded"
            style={{ backgroundColor: '#000000' }}
          />
          {isStreaming && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
              LIVE
            </div>
          )}
        </div>

        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-48 overflow-y-auto">
          {debug.length === 0 ? (
            <div className="text-gray-500">Debug log will appear here...</div>
          ) : (
            debug.map((line, index) => (
              <div key={index}>{line}</div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraDebugger;