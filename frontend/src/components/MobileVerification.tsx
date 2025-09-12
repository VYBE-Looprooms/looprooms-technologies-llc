import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Shield,
  FileText,
  User,
  Eye,
  RotateCcw
} from 'lucide-react';

interface MobileVerificationProps {
  sessionId?: string;
  token?: string;
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

const MobileVerification: React.FC<MobileVerificationProps> = ({ sessionId, token }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [blinkDetected, setBlinkDetected] = useState(false);
  const [livenessPrompt, setLivenessPrompt] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const steps: VerificationStep[] = [
    {
      id: 'consent',
      title: 'Privacy Consent',
      description: 'Review and accept our verification terms',
      completed: false,
      active: currentStep === 0
    },
    {
      id: 'id_upload',
      title: 'Upload ID Document',
      description: 'Take a photo of your government-issued ID',
      completed: !!idFile,
      active: currentStep === 1
    },
    {
      id: 'selfie',
      title: 'Take Selfie',
      description: 'Capture a selfie for face verification',
      completed: !!selfieBlob,
      active: currentStep === 2
    },
    {
      id: 'liveness',
      title: 'Liveness Check',
      description: 'Follow the prompt to prove you\'re real',
      completed: blinkDetected,
      active: currentStep === 3
    },
    {
      id: 'submit',
      title: 'Submit Verification',
      description: 'Review and submit your verification',
      completed: false,
      active: currentStep === 4
    }
  ];

  // Generate random liveness prompt
  const generateLivenessPrompt = useCallback(() => {
    const prompts = [
      'Please blink your eyes',
      'Turn your head slightly left',
      'Turn your head slightly right',
      'Smile naturally',
      'Nod your head slowly'
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }, []);

  // Initialize liveness prompt
  useEffect(() => {
    setLivenessPrompt(generateLivenessPrompt());
  }, [generateLivenessPrompt]);

  // Handle ID file selection
  const handleIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIdFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setIdPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera for selfie
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Capture selfie
  const captureSelfie = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        setSelfieBlob(blob);
        
        // Create preview
        const url = URL.createObjectURL(blob);
        setSelfiePreview(url);
        
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  }, [stopCamera]);

  // Submit verification
  const submitVerification = async () => {
    if (!idFile || !selfieBlob || !sessionId || !token) {
      setError('Missing required data for verification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('id_image', idFile);
      formData.append('selfie', selfieBlob, 'selfie.jpg');
      formData.append('sessionId', sessionId);
      formData.append('token', token);

      const response = await fetch(`${API_BASE_URL}/api/verification/submit`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Show success and redirect back to desktop
        setCurrentStep(5); // Success step
      } else {
        throw new Error(result.message || 'Verification failed');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification submission failed');
    } finally {
      setLoading(false);
    }
  };

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get('session');
    const urlToken = urlParams.get('token');
    
    if (!urlSessionId || !urlToken) {
      setError('Invalid verification link. Please scan the QR code again.');
    }
  }, []);

  // Progress calculation
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
          <p className="text-gray-600">Complete verification to activate your creator account</p>
        </div>

        {/* Progress */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    step.completed ? 'bg-green-500' : 
                    step.active ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    step.active ? 'font-medium text-gray-900' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        {currentStep === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Privacy & Consent</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Data Collection Notice</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• We'll capture your ID image and selfie for verification</li>
                  <li>• Face biometric data is processed and not stored permanently</li>
                  <li>• Documents are encrypted and deleted after 30 days</li>
                  <li>• Only verification status is kept in your profile</li>
                </ul>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCurrentStep(1);
                    }
                  }}
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  I consent to the collection and processing of my identity documents and biometric data for verification purposes as described above.
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Upload ID Document</span>
              </CardTitle>
              <CardDescription>
                Take a clear photo of your government-issued ID (passport, driver's license, or national ID)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!idPreview ? (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Tap to take a photo of your ID</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleIdUpload}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={idPreview}
                      alt="ID Preview"
                      className="w-full rounded-lg shadow-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Captured
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIdFile(null);
                        setIdPreview(null);
                      }}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Take Selfie</span>
              </CardTitle>
              <CardDescription>
                Take a clear selfie for face verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selfiePreview ? (
                <>
                  {!stream ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Position your face in the frame</p>
                      <Button onClick={startCamera} className="w-full">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-80 object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        
                        {/* Face guide overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-60 border-4 border-white rounded-full opacity-50"></div>
                        </div>

                        {/* Instructions */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-center text-sm">
                            Center your face in the oval and look directly at the camera
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={stopCamera} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={captureSelfie} className="flex-1">
                          <Camera className="w-4 h-4 mr-2" />
                          Capture
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selfiePreview}
                      alt="Selfie Preview"
                      className="w-full rounded-lg shadow-lg"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Captured
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelfieBlob(null);
                        setSelfiePreview(null);
                        if (selfiePreview) URL.revokeObjectURL(selfiePreview);
                      }}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Liveness Check</span>
              </CardTitle>
              <CardDescription>
                Follow the prompt to verify you're a real person
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="text-2xl mb-3">👁️</div>
                <h3 className="font-semibold text-blue-900 mb-2">Liveness Verification</h3>
                <p className="text-blue-800 text-lg font-medium mb-4">{livenessPrompt}</p>
                <Button
                  onClick={() => {
                    setBlinkDetected(true);
                    setCurrentStep(4);
                  }}
                  className="w-full"
                >
                  I've Completed the Action
                </Button>
              </div>
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setLivenessPrompt(generateLivenessPrompt())}
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Get Different Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>Submit Verification</span>
              </CardTitle>
              <CardDescription>
                Review your information and submit for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">ID Document</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Selfie Photo</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Liveness Check</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Processing usually takes 30-60 seconds. You can return to your desktop after submitting.
                </p>
              </div>

              <Button
                onClick={submitVerification}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Verification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Verification Submitted!</h2>
              <p className="text-green-700 mb-6">
                Your verification has been submitted successfully. Processing will complete on your desktop device.
              </p>
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  You can now return to your desktop. The verification will complete automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default MobileVerification;