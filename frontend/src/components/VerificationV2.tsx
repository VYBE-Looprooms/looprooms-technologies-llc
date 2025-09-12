import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  QrCode,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAuth } from '@/hooks/useAuth';

interface VerificationV2Props {
  onComplete: () => void;
  onError?: (error: string) => void;
}

interface VerificationSession {
  sessionId: string;
  qrToken: string;
  mobileUrl: string;
  expiresAt: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired' | 'failed';
}

interface VerificationStatus {
  status: 'pending' | 'id_uploaded' | 'selfie_taken' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  results?: {
    faceMatch: boolean;
    liveness: boolean;
    ocrConfidence: number;
    overallStatus: 'verified' | 'manual_review' | 'rejected';
  };
}

const VerificationV2: React.FC<VerificationV2Props> = ({ onComplete, onError }) => {
  const { token } = useAuth();
  const [session, setSession] = useState<VerificationSession | null>(null);
  const [status, setStatus] = useState<VerificationStatus>({
    status: 'pending',
    progress: 0,
    currentStep: 'Preparing verification...'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Create verification session
  const createSession = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/verification/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create verification session');
      }

      setSession(result.data);
      
      // Calculate time left
      const expiresAt = new Date(result.data.expiresAt);
      const now = new Date();
      setTimeLeft(Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)));

      setStatus({
        status: 'pending',
        progress: 10,
        currentStep: 'Scan QR code with your phone'
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token, onError]);

  // Poll verification status
  const pollStatus = React.useCallback(async () => {
    if (!session) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/verification/status/${session.sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        const newStatus = result.data as VerificationStatus;
        setStatus(newStatus);

        // Handle completion
        if (newStatus.status === 'completed') {
          if (newStatus.results?.overallStatus === 'verified') {
            setTimeout(() => onComplete(), 1500); // Small delay to show success
          } else {
            setError(`Verification ${newStatus.results?.overallStatus || 'failed'}. Please try again or contact support.`);
          }
        }
      }
    } catch (err) {
      console.error('Error polling status:', err);
    }
  }, [session, token, onComplete, API_BASE_URL]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setError('Verification session has expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Status polling
  useEffect(() => {
    if (!session || status.status === 'completed') return;

    const interval = setInterval(pollStatus, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [session, status.status, pollStatus]);

  // Initialize session
  useEffect(() => {
    createSession();
  }, [createSession]);

  // Format time left
  const formatTimeLeft = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get step description
  const getStepDescription = () => {
    switch (status.status) {
      case 'pending':
        return 'Scan the QR code with your mobile device to begin verification';
      case 'id_uploaded':
        return 'ID document received. Now take a selfie for face verification';
      case 'selfie_taken':
        return 'Processing your verification. This may take a moment...';
      case 'processing':
        return 'Running security checks and face matching...';
      case 'completed':
        return status.results?.overallStatus === 'verified' 
          ? 'Verification completed successfully!' 
          : 'Verification requires manual review';
      case 'failed':
        return 'Verification failed. Please try again';
      default:
        return status.currentStep;
    }
  };

  // Get progress color
  const getProgressColor = () => {
    if (status.status === 'completed') {
      return status.results?.overallStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500';
    }
    if (status.status === 'failed') return 'bg-red-500';
    return 'bg-blue-500';
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span>Setting up verification...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={createSession} className="w-full" disabled={loading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Identity Verification</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Complete your creator verification using your mobile device for the best experience
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getProgressColor()}`} />
                <span className="font-semibold text-gray-900">
                  {status.status === 'completed' ? 'Complete' : 'In Progress'}
                </span>
              </div>
              {timeLeft > 0 && status.status !== 'completed' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeLeft(timeLeft)}</span>
                </div>
              )}
            </div>
            
            <Progress 
              value={status.progress} 
              className="h-3 mb-3"
            />
            
            <p className="text-sm text-gray-600">{getStepDescription()}</p>
          </CardContent>
        </Card>

        {/* Main Content */}
        {status.status === 'completed' && status.results?.overallStatus === 'verified' ? (
          // Success State
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Verification Successful!</h2>
              <p className="text-green-700 mb-6">
                Your identity has been verified. You can now access all creator features.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {status.results.faceMatch ? '✓' : '×'}
                  </div>
                  <div className="text-sm text-gray-600">Face Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {status.results.liveness ? '✓' : '×'}
                  </div>
                  <div className="text-sm text-gray-600">Liveness</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(status.results.ocrConfidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">OCR Score</div>
                </div>
              </div>
              <Button onClick={onComplete} className="w-full bg-green-600 hover:bg-green-700">
                Continue to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : status.status === 'pending' || status.status === 'id_uploaded' ? (
          // QR Code State
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Smartphone className="h-16 w-16 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <QrCode className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900">Continue on Mobile</CardTitle>
              <CardDescription className="text-base">
                Scan this QR code with your mobile device camera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center p-6 bg-white rounded-xl shadow-inner">
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <QRCode
                    value={session.mobileUrl}
                    size={220}
                    level="M"
                    style={{ maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

              {/* Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">How to verify:</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Open your phone's camera app</li>
                    <li>Point it at the QR code above</li>
                    <li>Tap the notification to open the verification page</li>
                    <li>Follow the steps to upload your ID and take a selfie</li>
                  </ol>
                </CardContent>
              </Card>

              {/* Alternative */}
              <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-600 mb-3">Can't scan the QR code?</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(session.mobileUrl);
                      // Could show a toast here
                    }}
                    className="text-xs"
                  >
                    Copy Mobile Link
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ) : (
          // Processing State
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Verification</h2>
              <p className="text-gray-600 mb-6">
                We're analyzing your documents and running security checks. This usually takes 30-60 seconds.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Document Analysis</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Face Verification</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Security Checks</span>
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            <span>Your data is encrypted and processed securely</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationV2;