import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  CheckCircle, 
  Shield, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileText,
  User,
  Monitor,
  Smartphone
} from 'lucide-react';
import { isDesktop, isMobile } from '@/lib/deviceDetection';
import QRCodeVerification from './QRCodeVerification';

interface IdentityVerificationProps {
  onComplete: () => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [idFrontCaptured, setIdFrontCaptured] = useState(false);
  const [idBackCaptured, setIdBackCaptured] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showQRVerification, setShowQRVerification] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [documentDetected, setDocumentDetected] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Detection functions
  const detectDocument = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Simple document detection based on edge detection and rectangular shapes
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let edges = 0;
    let totalPixels = 0;
    
    // Simple edge detection - look for high contrast areas
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      
      // Check adjacent pixel for edge detection
      const nextIndex = i + 4;
      if (nextIndex < data.length) {
        const nextR = data[nextIndex];
        const nextG = data[nextIndex + 1];
        const nextB = data[nextIndex + 2];
        const nextBrightness = (nextR + nextG + nextB) / 3;
        
        if (Math.abs(brightness - nextBrightness) > 50) {
          edges++;
        }
      }
      totalPixels++;
    }
    
    const edgeRatio = edges / totalPixels;
    
    // If we detect enough edges (indicating a document), mark as detected
    const detected = edgeRatio > 0.1 && edgeRatio < 0.4; // Adjust thresholds as needed
    setDocumentDetected(detected);
    
    if (detected) {
      console.log('📄 Document detected! Edge ratio:', edgeRatio.toFixed(3));
    }
  }, []);

  const detectFace = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Simple face detection based on skin tone and oval shapes
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let skinPixels = 0;
    let totalPixels = 0;
    
    // Look for skin-tone colored pixels in the center area
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 4;
    
    for (let y = centerY - radius; y < centerY + radius; y++) {
      for (let x = centerX - radius; x < centerX + radius; x++) {
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const index = (y * canvas.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Basic skin tone detection
          if (r > 95 && g > 40 && b > 20 && 
              r > b && r > g && 
              r - g > 15 && 
              Math.abs(r - g) > 15) {
            skinPixels++;
          }
          totalPixels++;
        }
      }
    }
    
    const skinRatio = skinPixels / totalPixels;
    const detected = skinRatio > 0.15; // Adjust threshold as needed
    setFaceDetected(detected);
    
    if (detected) {
      console.log('👤 Face detected! Skin ratio:', skinRatio.toFixed(3));
    }
  }, []);

  const startDetection = useCallback(() => {
    if (detectionInterval) clearInterval(detectionInterval);
    
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return;
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        if (currentStep === 3) {
          // Face detection for selfie
          detectFace(canvas, ctx);
        } else {
          // Document detection for ID/passport
          detectDocument(canvas, ctx);
        }
      }
    }, 500); // Check every 500ms
    
    setDetectionInterval(interval);
  }, [currentStep, detectionInterval, detectDocument, detectFace]);

  const stopDetection = useCallback(() => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
    setDocumentDetected(false);
    setFaceDetected(false);
  }, [detectionInterval]);

  // Check if we should show QR code verification on desktop
  useEffect(() => {
    console.log('Device detection check:', {
      width: window.innerWidth,
      height: window.innerHeight,
      touchPoints: navigator.maxTouchPoints,
      userAgent: navigator.userAgent,
      isDesktop: isDesktop(),
      isMobile: isMobile()
    });
    
    // For now, force QR code for wider screens or non-mobile user agents
    const shouldShowQR = window.innerWidth > 768 && !navigator.userAgent.toLowerCase().includes('mobile');
    console.log('Should show QR code:', shouldShowQR);
    
    setShowQRVerification(shouldShowQR);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: currentStep === 3 ? 'user' : 'environment'
        }
      };

      console.log('📷 Starting camera with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Got media stream:', mediaStream);
      
      // Set stream first to trigger re-render
      setStream(mediaStream);
      
      // Wait for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoRef.current) {
        const video = videoRef.current;
        console.log('🎬 Setting up video element...');
        console.log('📺 Video element exists:', !!video);
        console.log('📺 Video element dimensions:', video.offsetWidth, 'x', video.offsetHeight);
        
        // Stop any existing stream
        if (video.srcObject) {
          console.log('🧹 Clearing existing video source');
          const oldStream = video.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }

        // Set video properties
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.controls = false;

        console.log(`📺 Video properties set: muted=${video.muted}, playsInline=${video.playsInline}, autoplay=${video.autoplay}`);

        // Simple event listeners for debugging
        video.onloadedmetadata = () => {
          console.log(`📐 loadedmetadata: ${video.videoWidth}x${video.videoHeight}`);
          console.log(`📊 readyState: ${video.readyState}, networkState: ${video.networkState}`);
        };
        
        video.oncanplay = () => {
          console.log('📷 canplay event - trying to play');
          video.play().catch(err => console.log('Play failed on canplay:', err));
        };
        
        video.onplaying = () => {
          console.log('📷 playing - SUCCESS! Video is now playing');
          setIsVideoPlaying(true);
          startDetection();
        };
        
        video.onpause = () => {
          console.log('📷 video paused');
          setIsVideoPlaying(false);
          stopDetection();
        };
        
        video.onended = () => {
          console.log('📷 video ended');
          setIsVideoPlaying(false);
          stopDetection();
        };
        
        video.onwaiting = () => {
          console.log('⚠️ waiting');
        };
        
        video.onerror = (e) => {
          console.error('❌ video error:', e);
          if (video.error) {
            console.error('❌ error details:', video.error.code, video.error.message);
          }
        };

        // Assign the stream
        console.log('🔗 Assigning media stream to video...');
        video.srcObject = mediaStream;

        console.log(`📺 After assignment: srcObject=${!!video.srcObject}`);

        // Multiple play attempts
        setTimeout(async () => {
          try {
            console.log('▶️ Attempting to play (attempt 1)...');
            await video.play();
            console.log('✅ Play successful!');
          } catch (playError) {
            console.log(`❌ Play failed: ${playError}`);
            
            // Try again with fresh video element
            setTimeout(async () => {
              try {
                console.log('▶️ Attempting to play (attempt 2)...');
                video.load();
                await video.play();
                console.log('✅ Play successful on retry!');
              } catch (retryError) {
                console.log(`❌ Retry play failed: ${retryError}`);
                console.log('🔧 Use the manual Play button to start video');
              }
            }, 1000);
          }
        }, 500);

        // Force load
        console.log('🔄 Forcing video.load()...');
        video.load();
      } else {
        console.error('❌ Video element not found after stream set!');
      }

    } catch (error) {
      console.error('❌ Camera access error:', error);
      alert(`Camera error: ${error.message}`);
    }
  }, [stream, currentStep, startDetection, stopDetection]);

  // Detection functions
  // Cleanup detection on unmount
  React.useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  // Start/stop detection based on video playing state
  useEffect(() => {
    if (isVideoPlaying) {
      console.log('🔍 Starting detection...');
      startDetection();
    } else {
      console.log('⏹️ Stopping detection...');
      stopDetection();
    }
  }, [isVideoPlaying, startDetection, stopDetection]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    setIsCapturing(true);

    try {
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);

        // Upload to backend
        try {
          const formData = new FormData();
          formData.append('document', blob, 'document.jpg');
          
          let endpoint = '';
          let documentType = '';
          let side = '';

          if (currentStep === 1) {
            endpoint = '/api/identity/upload-document';
            documentType = 'NATIONAL_ID';
            side = 'front';
            formData.append('documentType', documentType);
            formData.append('side', side);
          } else if (currentStep === 2) {
            endpoint = '/api/identity/upload-document';
            documentType = 'NATIONAL_ID';
            side = 'back';
            formData.append('documentType', documentType);
            formData.append('side', side);
          } else if (currentStep === 3) {
            endpoint = '/api/identity/upload-face';
            formData.append('face', blob, 'face.jpg');
            formData.delete('document'); // Remove document field for face upload
          }

          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${endpoint}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('vybe_token')}`,
            },
            body: formData,
          });

          const result = await response.json();

          if (result.success) {
            // Mark current step as captured
            if (currentStep === 1) {
              setIdFrontCaptured(true);
            } else if (currentStep === 2) {
              setIdBackCaptured(true);
            } else if (currentStep === 3) {
              setFaceVerified(true);
            }
          } else {
            throw new Error(result.message || 'Upload failed');
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          alert('Failed to upload photo. Please try again.');
          setCapturedImage(null);
        }

        stopCamera();
        setIsCapturing(false);
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Capture error:', error);
      setIsCapturing(false);
    }
  }, [currentStep, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    if (currentStep === 1) {
      setIdFrontCaptured(false);
    } else if (currentStep === 2) {
      setIdBackCaptured(false);
    } else if (currentStep === 3) {
      setFaceVerified(false);
    }
    startCamera();
  }, [currentStep, startCamera]);

  const nextStep = () => {
    stopCamera();
    setCapturedImage(null);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    stopCamera();
    setCapturedImage(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "ID Document - Front";
      case 2: return "ID Document - Back";
      case 3: return "Face Verification";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Position your ID or passport front side in the camera frame and take a clear photo";
      case 2: return "Now position the back side of your ID or passport in the camera frame";
      case 3: return "Look directly at the camera and take a selfie for face verification";
      default: return "";
    }
  };

  const isStepCompleted = () => {
    switch (currentStep) {
      case 1: return idFrontCaptured;
      case 2: return idBackCaptured;
      case 3: return faceVerified;
      default: return false;
    }
  };

  // Show QR code verification for desktop users
  if (showQRVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              For the best camera experience, please continue on your mobile device
            </p>
          </div>

          {/* Device Type Notice */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Desktop Device Detected</h3>
                  <p className="text-gray-600">
                    Mobile devices provide better camera quality for document scanning and face verification.
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Verification Component */}
          <QRCodeVerification 
            onComplete={onComplete}
            onError={(error) => {
              console.error('QR verification error:', error);
              // Optionally fall back to camera on desktop
              setShowQRVerification(false);
            }}
          />

          {/* Fallback Option */}
          <Card className="mt-6">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Having trouble with mobile verification?
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowQRVerification(false)}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                Try Desktop Camera Instead
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">Identity Verification</div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Secure Your Creator Account
        </h1>
        <p className="text-lg text-gray-600">
          {isMobile() ? 
            "Complete identity verification to activate your creator privileges" :
            "Using desktop camera - for better experience, scan QR code to use mobile device"
          }
        </p>
      </div>

      {/* Force QR Code Button */}
      {!showQRVerification && (
        <Card className="mb-6">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Prefer to use your mobile device for better camera quality?
            </p>
            <Button 
              onClick={() => setShowQRVerification(true)}
              className="w-full"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Show QR Code for Mobile Verification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {currentStep === 3 ? (
                <User className="w-8 h-8 text-blue-600" />
              ) : (
                <FileText className="w-8 h-8 text-blue-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{getStepTitle()}</h2>
            <p className="text-lg text-gray-600 mb-8">{getStepDescription()}</p>
            
            <div className="max-w-md mx-auto">
              {/* Camera View or Captured Image */}
              <div className="relative mb-6">
                {!isStepCompleted() && !stream && (
                  <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-8 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Click below to start your camera</p>
                      <Button onClick={startCamera} className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Start Camera
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video element - always render when not completed, hide with CSS if no stream */}
                {!isStepCompleted() && (
                  <div className={`relative bg-gray-900 rounded-lg overflow-hidden border-4 transition-colors duration-300 ${
                    currentStep === 3 
                      ? (faceDetected ? 'border-green-500' : 'border-white') 
                      : (documentDetected ? 'border-green-500' : 'border-white')
                  }`} style={{ aspectRatio: '16/9' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      controls={false}
                      className="w-full h-full object-cover"
                      onPlay={() => {
                        setIsVideoPlaying(true);
                        console.log('🎬 Video started playing - starting detection');
                      }}
                      onPause={() => {
                        setIsVideoPlaying(false);
                        console.log('⏸️ Video paused - stopping detection');
                      }}
                      style={{ 
                        backgroundColor: '#000',
                        transform: currentStep === 3 ? 'scaleX(-1)' : 'none',
                        display: !stream ? 'none' : 'block'
                      }}
                    />
                    {!stream && (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <div>Video will appear here</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Manual play button for debugging */}
                    {stream && (
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={async () => {
                            if (videoRef.current) {
                              try {
                                console.log('🎯 Manual play button clicked');
                                videoRef.current.muted = true;
                                await videoRef.current.play();
                                console.log('✅ Manual play successful');
                              } catch (err) {
                                console.error('❌ Manual play failed:', err);
                              }
                            }
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          ▶️ Play
                        </button>
                      </div>
                    )}
                    
                    {/* Show controls when stream is active */}
                    {stream && (
                      <>
                        {/* Detection status indicator */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className={`bg-black/70 text-white px-4 py-2 rounded-lg text-center transition-all duration-300 ${
                            currentStep === 3 
                              ? (faceDetected ? 'bg-green-600/90' : 'bg-black/70') 
                              : (documentDetected ? 'bg-green-600/90' : 'bg-black/70')
                          }`}>
                            {currentStep === 3 ? (
                              faceDetected ? '✅ Face detected! Ready to capture' : '👤 Position your face in the frame'
                            ) : (
                              documentDetected ? '✅ Document detected! Ready to capture' : '📄 Position your ID document in the frame'
                            )}
                          </div>
                        </div>

                        {/* Camera overlay for ID documents */}
                        {currentStep !== 3 && (
                          <div className="absolute inset-4 border-2 border-white rounded-lg flex items-center justify-center">
                            <div className="bg-black/50 text-white px-3 py-1 rounded text-sm">
                              Position your ID within this frame
                            </div>
                          </div>
                        )}
                        
                        {/* Face outline for selfie */}
                        {currentStep === 3 && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-64 border-4 border-white rounded-full opacity-50"></div>
                          </div>
                        )}
                        
                        <div className="flex gap-3 justify-center mt-4">
                          <Button variant="outline" onClick={stopCamera}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            onClick={capturePhoto} 
                            className={`flex items-center gap-2 transition-all duration-300 ${
                              (currentStep === 3 ? faceDetected : documentDetected)
                                ? 'bg-green-600 hover:bg-green-700 border-green-600' 
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                            disabled={isCapturing || !(currentStep === 3 ? faceDetected : documentDetected)}
                          >
                            <Camera className="w-4 h-4" />
                            {isCapturing ? 'Uploading...' : 
                             (currentStep === 3 ? faceDetected : documentDetected) ? 'Capture Photo!' : 
                             currentStep === 3 ? 'Position face in frame' : 'Position document in frame'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {isStepCompleted() && capturedImage && (
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured document" 
                      className="w-full aspect-video object-cover rounded-lg"
                      style={{ transform: currentStep === 3 ? 'scaleX(-1)' : 'none' }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Captured
                      </div>
                    </div>
                    <div className="flex gap-3 justify-center mt-4">
                      <Button variant="outline" onClick={retakePhoto}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </Button>
                      <Button onClick={nextStep} className="flex items-center gap-2">
                        {currentStep === 3 ? 'Complete Verification' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {isStepCompleted() && !capturedImage && (
                  <div className="border-2 border-green-300 bg-green-50 rounded-lg p-8 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-800 font-semibold mb-2">Photo captured successfully!</p>
                      <Button onClick={nextStep} className="flex items-center gap-2 mx-auto">
                        {currentStep === 3 ? 'Complete Verification' : 'Continue to Next Step'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation buttons */}
              {currentStep > 1 && !stream && (
                <div className="flex justify-center mb-4">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Security Notice */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Your photos are encrypted and processed securely</span>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;