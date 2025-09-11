import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  CheckCircle, 
  Shield, 
  ArrowRight,
  RotateCcw,
  FileText,
  User,
  Smartphone,
  AlertCircle,
  Home,
  CreditCard,
  Book
} from 'lucide-react';

// Use network IP for mobile access
const API_BASE_URL = 'http://192.168.3.10:3001';

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

interface SessionInfo {
  sessionId: string;
  user: UserInfo;
  status: string;
  completedSteps: string[];
}

const MobileVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session');
  const token = searchParams.get('token');

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [documentType, setDocumentType] = useState<'id' | 'passport'>('id');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Get document type from localStorage (set by onboarding)
  useEffect(() => {
    const savedDocumentType = localStorage.getItem('selectedDocumentType') as 'id' | 'passport';
    if (savedDocumentType) {
      setDocumentType(savedDocumentType);
    }
  }, []);

  // Dynamic steps based on document type
  const steps = documentType === 'passport' ? [
    { id: 1, title: 'Passport', description: 'Take a photo of your passport main page', step: 'passport_main', icon: Book },
    { id: 2, title: 'Face Verification', description: 'Take a selfie for face verification', step: 'face_verification', icon: User }
  ] : [
    { id: 1, title: 'ID Front', description: 'Take a photo of the front of your ID', step: 'id_front', icon: CreditCard },
    { id: 2, title: 'ID Back', description: 'Take a photo of the back of your ID', step: 'id_back', icon: CreditCard },
    { id: 3, title: 'Face Verification', description: 'Take a selfie for face verification', step: 'face_verification', icon: User }
  ];

  const validateSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/mobile-verification/validate/${sessionId}?token=${token}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Session validation failed');
      }

      setSessionInfo(result.data);
      
      // Determine current step based on completed steps
      const completedSteps = result.data.completedSteps || [];
      if (completedSteps.includes('face_verification')) {
        setCurrentStep(4); // All done
      } else if (completedSteps.includes('id_back')) {
        setCurrentStep(3); // Face verification
      } else if (completedSteps.includes('id_front')) {
        setCurrentStep(2); // ID back
      } else {
        setCurrentStep(1); // ID front
      }

      console.log('📱 Session validated:', result.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Session validation failed';
      setError(errorMessage);
      console.error('❌ Session validation error:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId, token]);

  // Validate session on mount
  useEffect(() => {
    if (!sessionId || !token) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    validateSession();
  }, [sessionId, token, validateSession]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
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
        videoRef.current.play();
      }

      setIsCapturing(true);

    } catch (err) {
      console.error('❌ Camera error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  }, [currentStep, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('Canvas not supported');
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);

    // Stop camera
    stopCamera();

    console.log('📷 Photo captured for step:', currentStep);
  }, [currentStep, stopCamera]);

  const uploadPhoto = async () => {
    if (!capturedImage || !sessionInfo) {
      setError('No photo to upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentStepInfo = steps[currentStep - 1];
      let endpoint = '';
      const payload: { token: string; imageData: string; side?: string } = {
        token: token!,
        imageData: capturedImage
      };

      if (currentStepInfo.step === 'face_verification') {
        endpoint = `${API_BASE_URL}/api/mobile-verification/${sessionId}/upload-face`;
      } else {
        endpoint = `${API_BASE_URL}/api/mobile-verification/${sessionId}/upload-document`;
        // Handle different document types
        if (documentType === 'passport') {
          payload.side = 'main';
        } else {
          payload.side = currentStepInfo.step === 'id_front' ? 'front' : 'back';
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      console.log('✅ Upload successful:', result.data);

      // Move to next step or complete
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        setCapturedImage(null);
      } else {
        // Complete verification
        await completeVerification();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('❌ Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const completeVerification = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/mobile-verification/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Completion failed');
      }

      console.log('✅ Verification completed:', result.data);
      setCurrentStep(4); // Show completion screen

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Completion failed';
      setError(errorMessage);
      console.error('❌ Completion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  if (loading && !sessionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Validating verification session...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !sessionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion screen
  if (currentStep === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Complete!
            </h1>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You can now return to your desktop to continue.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Return to your desktop browser. The verification should complete automatically.
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepInfo = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mobile Verification</h1>
          {sessionInfo && (
            <p className="text-sm text-gray-600">
              Welcome, {sessionInfo.user.name}
            </p>
          )}
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="mb-4" />
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <currentStepInfo.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{currentStepInfo.title}</h3>
                <p className="text-sm text-gray-600">{currentStepInfo.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camera Interface */}
        <Card>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Camera View */}
            {!capturedImage && !isCapturing && (
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Ready to capture {currentStepInfo.title.toLowerCase()}
                  </p>
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              </div>
            )}

            {/* Video Stream */}
            {isCapturing && !capturedImage && (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  {currentStep < 3 && (
                    <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg"></div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={stopCamera} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={capturePhoto} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            )}

            {/* Captured Image */}
            {capturedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Captured
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={retakePhoto} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button 
                    onClick={uploadPhoto} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Uploading...' : (currentStep === 3 ? 'Complete' : 'Continue')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Your photos are encrypted and processed securely</span>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MobileVerificationPage;
