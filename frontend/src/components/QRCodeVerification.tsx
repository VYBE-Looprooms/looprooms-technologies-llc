import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'react-qr-code';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Smartphone, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Smart API URL detection with fallback
const getApiBaseUrl = () => {
  // Always use HTTPS for API calls when frontend is HTTPS
  if (window.location.protocol === 'https:') {
    return 'https://192.168.3.10:3443';
  }
  // Otherwise use HTTP for desktop compatibility
  return 'http://192.168.3.10:3001';
};

// Add error handling for SSL certificate issues
const makeApiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      // Add credentials for CORS
      credentials: 'include'
    });
    return response;
  } catch (error) {
    if (error.message?.includes('certificate') || error.message?.includes('net::ERR_CERT')) {
      throw new Error(`SSL Certificate Error: Please visit ${API_BASE_URL}/health in a new tab and accept the security warning first.`);
    }
    throw error;
  }
};

const API_BASE_URL = getApiBaseUrl();
const MOBILE_BASE_URL = 'https://192.168.3.10:3443';

interface QRCodeVerificationProps {
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface SessionData {
  sessionId: string;
  qrToken: string;
  mobileUrl: string;
  expiresAt: string;
}

interface SessionStatus {
  status: 'pending' | 'completed' | 'expired' | 'not_found';
  completedSteps: string[];
  totalSteps: number;
  lastUpdated?: string;
}

export const QRCodeVerification: React.FC<QRCodeVerificationProps> = ({
  onComplete,
  onError
}) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Create mobile verification session
  const createSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('vybe_token');
      // For testing purposes, we'll proceed without token if not available
      console.log('Token available:', !!token);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Use the smart API URL detection
      const apiUrl = API_BASE_URL;
      
      // If we're on HTTPS, verify backend certificate is trusted
      if (window.location.protocol === 'https:') {
        try {
          await makeApiCall(`${apiUrl}/health`, { method: 'HEAD' });
        } catch (certError) {
          throw new Error(`Backend certificate not trusted. Please visit ${apiUrl}/health in a new tab and accept the security warning first, then try again.`);
        }
      }

      const response = await makeApiCall(`${apiUrl}/api/mobile-verification/create-session`, {
        method: 'POST',
        headers
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create verification session');
      }

      setSessionData(result.data);
      
      // Calculate initial time left
      const expiresAt = new Date(result.data.expiresAt);
      const now = new Date();
      setTimeLeft(Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)));

      console.log('📱 Mobile verification session created:', result.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('❌ Error creating mobile session:', err);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // Check session status
  const checkStatus = useCallback(async () => {
    if (!sessionData) return;

    try {
      const token = localStorage.getItem('vybe_token');
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await makeApiCall(`${API_BASE_URL}/api/mobile-verification/status/${sessionData.sessionId}`, {
        headers
      });

      const result = await response.json();

      if (result.success) {
        setSessionStatus(result.data);

        // Check if verification is completed
        if (result.data.status === 'completed') {
          console.log('✅ Mobile verification completed!');
          onComplete?.();
        } else if (result.data.status === 'expired') {
          setError('Verification session has expired');
        }
      }

    } catch (err) {
      console.error('❌ Error checking session status:', err);
    }
  }, [sessionData, onComplete]);

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
    if (!sessionData || sessionStatus?.status === 'completed') return;

    const interval = setInterval(checkStatus, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [sessionData, sessionStatus?.status, checkStatus]);

  // Initialize session on mount
  useEffect(() => {
    createSession();
  }, [createSession]);

  // Format time left
  const formatTimeLeft = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get progress percentage
  const getProgress = (): number => {
    if (!sessionStatus) return 0;
    return (sessionStatus.completedSteps.length / sessionStatus.totalSteps) * 100;
  };

  // Get step status
  const getStepStatus = (step: string): 'pending' | 'completed' => {
    return sessionStatus?.completedSteps.includes(step) ? 'completed' : 'pending';
  };

  if (loading && !sessionData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Setting up mobile verification...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const isCertError = error.includes('certificate') || error.includes('Certificate');
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          {isCertError && (
            <div className="mt-4 space-y-3">
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold mb-2">Quick Fix:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Click the button below to open the backend in a new tab</li>
                  <li>Accept the security warning (click "Advanced" → "Proceed")</li>
                  <li>Come back here and try again</li>
                </ol>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => window.open('https://192.168.3.10:3443/health', '_blank')}
                className="w-full"
              >
                🔓 Accept Backend Certificate
              </Button>
            </div>
          )}
          
          <Button 
            onClick={createSession} 
            className="w-full mt-3"
            disabled={loading}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!sessionData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* QR Code Card */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Smartphone className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Continue on Mobile</CardTitle>
          <CardDescription>
            Scan this QR code with your mobile device to complete identity verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* QR Code */}
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCode
              value={sessionData.mobileUrl}
              size={200}
              level="M"
            />
          </div>

          {/* Session Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expires in: {formatTimeLeft(timeLeft)}</span>
            </div>
            
            {sessionStatus && (
              <div className="text-sm">
                Progress: {sessionStatus.completedSteps.length}/{sessionStatus.totalSteps} steps
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {sessionStatus && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Card */}
      {sessionStatus && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Verification Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* ID Front */}
            <div className="flex items-center space-x-3">
              {getStepStatus('id_front') === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={getStepStatus('id_front') === 'completed' ? 'text-green-600' : 'text-gray-500'}>
                ID Document (Front)
              </span>
            </div>

            {/* ID Back */}
            <div className="flex items-center space-x-3">
              {getStepStatus('id_back') === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={getStepStatus('id_back') === 'completed' ? 'text-green-600' : 'text-gray-500'}>
                ID Document (Back)
              </span>
            </div>

            {/* Face Verification */}
            <div className="flex items-center space-x-3">
              {getStepStatus('face_verification') === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
              <span className={getStepStatus('face_verification') === 'completed' ? 'text-green-600' : 'text-gray-500'}>
                Face Verification
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your phone's camera app</li>
              <li>Scan the QR code above</li>
              <li>Complete the verification steps on your mobile device</li>
              <li>Return to this page once completed</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Manual URL Option */}
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Can't scan the QR code?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(sessionData.mobileUrl);
                // You could show a toast here
              }}
            >
              Copy Mobile Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeVerification;
