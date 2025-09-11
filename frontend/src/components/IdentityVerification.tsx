import React, { useState, useRef, useCallback } from 'react';
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
  User
} from 'lucide-react';

interface IdentityVerificationProps {
  onComplete: () => void;
}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [idFrontCaptured, setIdFrontCaptured] = useState(false);
  const [idBackCaptured, setIdBackCaptured] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: currentStep === 3 ? 'user' : 'environment'
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to load before trying to play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions and refresh the page.');
    }
  }, [stream, currentStep]);

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
          Complete identity verification to activate your creator privileges
        </p>
      </div>

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

                {stream && !isStepCompleted() && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full aspect-video object-cover bg-black rounded-lg"
                      style={{ transform: currentStep === 3 ? 'scaleX(-1)' : 'none' }}
                    />
                    
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
                        className="flex items-center gap-2"
                        disabled={isCapturing}
                      >
                        <Camera className="w-4 h-4" />
                        {isCapturing ? 'Uploading...' : 'Capture Photo'}
                      </Button>
                    </div>
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
