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
  ArrowRight,
  Clock,
  Lock,
  Zap,
  Camera
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
      <div className="w-full max-w-lg mx-auto space-y-6 px-4">
        {/* Mobile-First Header */}
        <div className="text-center animate-in fade-in duration-500">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Verify Your Identity
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Quick verification unlocks creator features and builds trust in our community
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">4 min process</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              <span className="text-purple-600 font-medium">Safe</span>
            </div>
          </div>
        </div>

        {/* Device Notice - Mobile Optimized */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                deviceType === 'desktop' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {deviceType === 'desktop' ? (
                  <Monitor className="w-5 h-5 text-blue-600" />
                ) : (
                  <Smartphone className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {deviceType === 'desktop' ? 'Desktop Device' : 'Mobile Device'}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {deviceType === 'desktop'
                    ? 'We\'ll show a QR code for mobile verification - cameras work better on phones!'
                    : 'Perfect! You\'ll get the best camera experience for document photos.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Type Selection - Mobile Cards */}
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Document</h3>
            <p className="text-gray-600 text-sm">
              Select the ID type you'd like to use for verification
            </p>
          </div>

          {/* Government ID Option */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              documentType === 'id'
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                : 'hover:border-gray-300'
            }`}
            onClick={() => setDocumentType('id')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1">Government ID</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Driver's license or state-issued ID card
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md">
                      <Camera className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">2 photos</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 rounded-md">
                      <Clock className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">3 min</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 border-2 rounded-full transition-all duration-200 ${
                    documentType === 'id'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {documentType === 'id' && (
                      <CheckCircle className="w-full h-full text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passport Option */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              documentType === 'passport'
                ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                : 'hover:border-gray-300'
            }`}
            onClick={() => setDocumentType('passport')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1">Passport</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    International passport document
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 rounded-md">
                      <Camera className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">1 photo</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-md">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">2 min</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 border-2 rounded-full transition-all duration-200 ${
                    documentType === 'passport'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {documentType === 'passport' && (
                      <CheckCircle className="w-full h-full text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Steps Preview */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Take document photos</p>
                  <p className="text-xs text-gray-600">Clear, well-lit photos of your ID</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 font-semibold text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Take a selfie</p>
                  <p className="text-xs text-gray-600">Quick face verification for security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-semibold text-xs">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">AI verification</p>
                  <p className="text-xs text-gray-600">Secure processing (usually under 30 seconds)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-semibold text-xs">4</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Get verified</p>
                  <p className="text-xs text-gray-600">Unlock all creator features</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleDocumentTypeSelect}
            className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            Start Verification
          </Button>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => console.log('Skip verification')}
          >
            <Clock className="w-5 h-5 mr-2" />
            Verify Later
          </Button>
        </div>

        {/* Security Notice */}
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong className="text-blue-900">Privacy Protected:</strong> Your data is encrypted and never shared. Documents are processed securely and deleted after verification.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Verification step - Mobile Optimized
  if (showQRCode && deviceType === 'desktop') {
    console.log('🖥️ Rendering QR code for desktop user');
    return (
      <div className="w-full max-w-lg mx-auto space-y-6 px-4">
        {/* Header */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            Continue on Mobile
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            You selected <strong className="text-gray-900">{documentType === 'id' ? 'Government ID' : 'Passport'}</strong> verification.
          </p>
          <p className="text-gray-600 mb-6">
            For the best camera experience, scan the QR code below with your mobile device.
          </p>
        </div>

        {/* Document Type Reminder */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                documentType === 'id'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                  : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}>
                {documentType === 'id' ? (
                  <CreditCard className="w-6 h-6 text-white" />
                ) : (
                  <Book className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {documentType === 'id' ? 'Government ID Verification' : 'Passport Verification'}
                </h4>
                <p className="text-sm text-gray-600">
                  {documentType === 'id'
                    ? 'Prepare your ID card - you\'ll photograph both front and back'
                    : 'Prepare your passport - you\'ll photograph the main page'
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
            className="w-full border-2 hover:border-orange-500 hover:text-orange-600"
            size="lg"
          >
            <Monitor className="w-5 h-5 mr-2" />
            Use Desktop Camera Instead
          </Button>

          <Button
            variant="ghost"
            onClick={() => setStep('select')}
            className="w-full hover:bg-gray-100"
            size="lg"
          >
            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
            Change Document Type
          </Button>
        </div>
      </div>
    );
  }

  // Mobile verification or desktop fallback - Enhanced Mobile UI
  console.log('📱 Rendering camera interface - showQRCode:', showQRCode, 'deviceType:', deviceType);
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Enhanced Header with document type */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          Identity Verification
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
            documentType === 'id'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : 'bg-gradient-to-br from-green-500 to-green-600'
          }`}>
            {documentType === 'id' ? (
              <CreditCard className="w-5 h-5 text-white" />
            ) : (
              <Book className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="font-semibold text-gray-900">
            {documentType === 'id' ? 'Government ID Verification' : 'Passport Verification'}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed">
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
          className="hover:bg-gray-100"
          size="lg"
        >
          <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
          Change Document Type
        </Button>
      </div>
    </div>
  );
};

export default OnboardingIdentityVerification;
