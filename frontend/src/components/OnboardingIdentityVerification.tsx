import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CreditCard, 
  Book, 
  Smartphone, 
  Monitor,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { isDesktop, isMobile } from '@/lib/deviceDetection';
import QRCodeVerification from './QRCodeVerification';
import VerificationV2 from './VerificationV2';

interface OnboardingIdentityVerificationProps {
  onComplete: () => void;
}

type DocumentType = 'id' | 'passport';

const OnboardingIdentityVerification: React.FC<OnboardingIdentityVerificationProps> = ({ 
  onComplete 
}) => {
  const [step, setStep] = useState<'select' | 'verify'>('select');
  const [documentType, setDocumentType] = useState<DocumentType>('id');
  const [showQRCode, setShowQRCode] = useState(false);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setDeviceType(isDesktop() ? 'desktop' : 'mobile');
    // Auto-show QR code for desktop users
    if (isDesktop()) {
      console.log('🖥️ Desktop device detected, showing QR code');
      setShowQRCode(true);
    } else {
      console.log('📱 Mobile device detected, using camera directly');
    }
  }, []);

  const handleDocumentTypeSelect = () => {
    console.log('📋 Document type selected:', documentType);
    console.log('🖥️ Device type:', deviceType);
    setStep('verify');
    
    // Force QR code for desktop users
    if (isDesktop()) {
      console.log('🖥️ Forcing QR code for desktop user');
      setShowQRCode(true);
    }
  };

  const handleVerificationComplete = () => {
    // Store document type preference in localStorage for the verification process
    localStorage.setItem('selectedDocumentType', documentType);
    onComplete();
  };

  if (step === 'select') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
          <p className="text-gray-600">
            To become a verified creator, we need to verify your identity for security and compliance.
          </p>
        </div>

        {/* Device Notice */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                deviceType === 'desktop' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {deviceType === 'desktop' ? (
                  <Monitor className="w-6 h-6 text-blue-600" />
                ) : (
                  <Smartphone className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {deviceType === 'desktop' ? 'Desktop Device Detected' : 'Mobile Device Detected'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {deviceType === 'desktop' 
                    ? 'For the best camera experience, we\'ll provide a QR code to continue on your mobile device.'
                    : 'Perfect! Mobile devices provide the best camera quality for document verification.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Document Type</CardTitle>
            <CardDescription>
              Choose the type of identification document you'll be using for verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={documentType} onValueChange={(value: DocumentType) => setDocumentType(value)}>
              {/* ID Card Option */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="id" id="id" />
                <Label htmlFor="id" className="flex-1 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Government ID / Driver's License</h4>
                      <p className="text-sm text-gray-600">
                        Upload both front and back of your ID card or driver's license
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">2 photos required</Badge>
                        <Badge variant="outline" className="text-xs">Front + Back</Badge>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Passport Option */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="passport" id="passport" />
                <Label htmlFor="passport" className="flex-1 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                      <Book className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Passport</h4>
                      <p className="text-sm text-gray-600">
                        Upload the photo page of your passport
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">1 photo required</Badge>
                        <Badge variant="outline" className="text-xs">Photo page only</Badge>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {/* Continue Button */}
            <div className="pt-4">
              <Button onClick={handleDocumentTypeSelect} className="w-full" size="lg">
                Continue with {documentType === 'id' ? 'Government ID' : 'Passport'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Requirements:</strong> Your document must be current, unexpired, and clearly readable. 
            You'll also need to take a selfie for face verification. All photos are encrypted and processed securely.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Verification step
  if (showQRCode && deviceType === 'desktop') {
    console.log('🖥️ Rendering QR code for desktop user');
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue on Mobile</h2>
          <p className="text-gray-600">
            You selected <strong>{documentType === 'id' ? 'Government ID' : 'Passport'}</strong> verification.
            For the best camera experience, please scan the QR code below with your mobile device.
          </p>
        </div>

        {/* Document Type Reminder */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                documentType === 'id' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {documentType === 'id' ? (
                  <CreditCard className="w-5 h-5 text-blue-600" />
                ) : (
                  <Book className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold">
                  {documentType === 'id' ? 'Government ID Verification' : 'Passport Verification'}
                </h4>
                <p className="text-sm text-gray-600">
                  {documentType === 'id' 
                    ? 'Prepare your ID card - you\'ll need to photograph both front and back'
                    : 'Prepare your passport - you\'ll only need to photograph the main page'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Component */}
        <QRCodeVerification 
          onComplete={handleVerificationComplete}
          onError={(error) => {
            console.error('QR verification error:', error);
            setShowQRCode(false);
          }}
        />

        {/* Fallback Options */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            onClick={() => setShowQRCode(false)}
            className="w-full"
          >
            Use Desktop Camera Instead
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setStep('select')}
            className="w-full"
          >
            Change Document Type
          </Button>
        </div>
      </div>
    );
  }

  // Mobile verification or desktop fallback
  console.log('📱 Rendering camera interface - showQRCode:', showQRCode, 'deviceType:', deviceType);
  return (
    <div className="w-full">
      {/* Header with document type */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
            documentType === 'id' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            {documentType === 'id' ? (
              <CreditCard className="w-4 h-4 text-blue-600" />
            ) : (
              <Book className="w-4 h-4 text-green-600" />
            )}
          </div>
          <span className="font-medium">
            {documentType === 'id' ? 'Government ID Verification' : 'Passport Verification'}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          {documentType === 'id' 
            ? 'Please photograph both the front and back of your ID, then take a selfie'
            : 'Please photograph the main page of your passport, then take a selfie'
          }
        </p>
      </div>

      {/* Enhanced Identity Verification Component */}
      <VerificationV2 onComplete={handleVerificationComplete} />

      {/* Back Button */}
      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          onClick={() => setStep('select')}
        >
          Change Document Type
        </Button>
      </div>
    </div>
  );
};

export default OnboardingIdentityVerification;
