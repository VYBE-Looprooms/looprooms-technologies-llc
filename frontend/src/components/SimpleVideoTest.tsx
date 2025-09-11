import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const SimpleVideoTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startCamera = async () => {
    try {
      setError('');
      addLog('🚀 Starting camera test...');

      // Get user media
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });

      addLog('✅ Got media stream: ' + mediaStream.id);
      addLog(`📊 Tracks: ${mediaStream.getTracks().length}`);
      
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        addLog(`🎥 Video track: ${videoTrack.label}`);
        addLog(`🎥 Track state: ${videoTrack.readyState}`);
        addLog(`🎥 Track enabled: ${videoTrack.enabled}`);
        
        const settings = videoTrack.getSettings();
        addLog(`🎥 Settings: ${settings.width}x${settings.height} @ ${settings.frameRate}fps`);
      }

      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        addLog('🎬 Setting up video element...');

        // Stop any existing stream
        if (video.srcObject) {
          addLog('🧹 Clearing existing video source');
          const oldStream = video.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }

        // Set video properties
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.controls = false;

        addLog(`📺 Video properties set: muted=${video.muted}, playsInline=${video.playsInline}, autoplay=${video.autoplay}`);

        // Set up event listeners BEFORE assigning stream
        video.addEventListener('loadstart', () => addLog('📷 loadstart'));
        video.addEventListener('loadedmetadata', () => {
          addLog(`📐 loadedmetadata: ${video.videoWidth}x${video.videoHeight}`);
          addLog(`📊 readyState: ${video.readyState}, networkState: ${video.networkState}`);
        });
        video.addEventListener('loadeddata', () => addLog('📷 loadeddata'));
        video.addEventListener('canplay', () => addLog('📷 canplay'));
        video.addEventListener('canplaythrough', () => addLog('📷 canplaythrough'));
        video.addEventListener('play', () => addLog('📷 play'));
        video.addEventListener('playing', () => addLog('📷 playing'));
        video.addEventListener('pause', () => addLog('📷 pause'));
        video.addEventListener('ended', () => addLog('📷 ended'));
        video.addEventListener('error', (e) => {
          addLog(`❌ video error: ${JSON.stringify(e)}`);
          if (video.error) {
            addLog(`❌ error details: code=${video.error.code}, message=${video.error.message}`);
          }
        });
        video.addEventListener('stalled', () => addLog('⚠️ stalled'));
        video.addEventListener('suspend', () => addLog('⚠️ suspend'));
        video.addEventListener('waiting', () => addLog('⚠️ waiting'));
        video.addEventListener('timeupdate', () => {
          if (video.currentTime < 1) {
            addLog(`📷 timeupdate: ${video.currentTime.toFixed(3)}s`);
          }
        });

        // Assign the stream
        addLog('🔗 Assigning media stream to video...');
        video.srcObject = mediaStream;

        addLog(`📺 After assignment: srcObject=${!!video.srcObject}`);

        // Try to play
        setTimeout(async () => {
          try {
            addLog('▶️ Attempting to play...');
            await video.play();
            addLog('✅ Play successful!');
          } catch (playError) {
            addLog(`❌ Play failed: ${playError}`);
            setError(`Play failed: ${playError}`);
          }
        }, 500);

        // Force load
        addLog('🔄 Forcing video.load()...');
        video.load();
      }

    } catch (err: unknown) {
      const errorMsg = `Camera access failed: ${err instanceof Error ? err.message : String(err)}`;
      addLog(`❌ ${errorMsg}`);
      setError(errorMsg);
    }
  };

  const stopCamera = () => {
    if (stream) {
      addLog('🛑 Stopping camera...');
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setLogs([]);
  };

  const playVideo = async () => {
    if (videoRef.current) {
      try {
        addLog('🎬 Manual play attempt...');
        await videoRef.current.play();
        addLog('✅ Manual play successful!');
      } catch (err: unknown) {
        addLog(`❌ Manual play failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Video Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Section */}
        <div>
          <div className="mb-4">
            <Button 
              onClick={startCamera} 
              disabled={!!stream}
              className="mr-2"
            >
              Start Camera
            </Button>
            <Button 
              onClick={stopCamera} 
              disabled={!stream}
              variant="outline"
              className="mr-2"
            >
              Stop Camera
            </Button>
            <Button 
              onClick={playVideo} 
              disabled={!stream}
              variant="outline"
            >
              Force Play
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
              {error}
            </div>
          )}

          <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ backgroundColor: '#000' }}
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div>Click "Start Camera" to begin</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logs Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Debug Logs</h3>
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
          <Button 
            onClick={() => setLogs([])} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Clear Logs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleVideoTest;