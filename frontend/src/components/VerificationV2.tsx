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
          } else if (newStatus.results?.overallStatus === 'manual_review') {
            // Handle manual review as partial success
            setTimeout(() => onComplete(), 1500); // Still complete the flow
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

    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
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
          : status.results?.overallStatus === 'manual_review'
          ? 'Verification completed - pending manual review'
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
      return status.results?.overallStatus === 'verified' || status.results?.overallStatus === 'manual_review' 
        ? 'bg-vybe-primary' : 'bg-vybe-accent';
    }
    if (status.status === 'failed') return 'bg-destructive';
    return 'bg-vybe-secondary';
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="w-full max-w-md mx-auto vybe-card">
            <CardContent className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 animate-spin text-vybe-primary" />
                <span className="text-foreground">Setting up verification...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="w-full max-w-md mx-auto vybe-card">
            <CardContent className="p-6">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={createSession} className="w-full btn-glow" disabled={loading}>
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-vybe-primary/20 to-vybe-secondary/20 backdrop-blur-lg border border-vybe-primary/30 rounded-full mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-vybe-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-gradient">Identity Verification</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Complete your creator verification using your mobile device for the best experience
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 vybe-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getProgressColor()}`} />
                <span className="font-semibold text-foreground">
                  {status.status === 'completed' ? 'Complete' : 'In Progress'}
                </span>
              </div>
              {timeLeft > 0 && status.status !== 'completed' && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeLeft(timeLeft)}</span>
                </div>
              )}
            </div>
            
            <Progress 
              value={status.progress} 
              className="h-3 mb-3"
            />
            
            <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
          </CardContent>
        </Card>

        {/* Main Content */}
        {status.status === 'completed' && status.results?.overallStatus === 'verified' ? (
          // Success State
          <Card className="vybe-card bg-gradient-to-br from-vybe-primary/10 to-vybe-secondary/10">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-vybe-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Verification Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your identity has been verified. You can now access all creator features.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-vybe-primary">
                    {status.results.faceMatch ? '✓' : '×'}
                  </div>
                  <div className="text-sm text-muted-foreground">Face Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-vybe-primary">
                    {status.results.liveness ? '✓' : '×'}
                  </div>
                  <div className="text-sm text-muted-foreground">Liveness</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-vybe-primary">
                    {Math.round(status.results.ocrConfidence * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">OCR Score</div>
                </div>
              </div>
              <Button onClick={onComplete} className="w-full btn-glow">
                Continue to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : status.status === 'pending' || status.status === 'id_uploaded' ? (
          // QR Code State
          <Card className="vybe-card">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Smartphone className="h-16 w-16 text-vybe-primary" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-vybe-secondary rounded-full flex items-center justify-center">
                    <QrCode className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">Continue on Mobile</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Scan this QR code with your mobile device camera
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center p-6 bg-card rounded-xl border border-border">
                <div className="p-4 bg-background rounded-lg border border-border/50">
                  <QRCode
                    value={session.mobileUrl}
                    size={220}
                    level="M"
                    style={{ maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>

              {/* Instructions */}
              <Card className="bg-vybe-primary/10 border-vybe-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">How to verify:</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open your phone's camera app</li>
                    <li>Point it at the QR code above</li>
                    <li>Tap the notification to open the verification page</li>
                    <li>Follow the steps to upload your ID and take a selfie</li>
                  </ol>
                </CardContent>
              </Card>

              {/* Alternative */}
              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Can't scan the QR code?</p>
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
          <Card className="vybe-card">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-vybe-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8 text-vybe-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Processing Verification</h2>
              <p className="text-muted-foreground mb-6">
                We're analyzing your documents and running security checks. This usually takes 30-60 seconds.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Document Analysis</span>
                  <CheckCircle className="w-4 h-4 text-vybe-primary" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Face Verification</span>
                  <CheckCircle className="w-4 h-4 text-vybe-primary" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Security Checks</span>
                  <RefreshCw className="w-4 h-4 text-vybe-secondary animate-spin" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            <Shield className="w-4 h-4 text-vybe-primary" />
            <span>Your data is encrypted and processed securely</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationV2;