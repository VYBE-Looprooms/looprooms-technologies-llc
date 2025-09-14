import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  Camera,
  Shield,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  User,
  CreditCard,
  FileText,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';

const CreatorVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Document Type
    documentType: '',

    // Step 2: Document Upload
    idFrontFile: null as File | null,
    idBackFile: null as File | null,
    idFrontPreview: '',
    idBackPreview: '',

    // Step 3: Selfie
    selfieFile: null as File | null,
    selfiePreview: '',

    // Step 4: Additional Info
    bio: '',
    experience: '',
    categories: [] as string[],
  });

  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'NATIONAL_ID', label: 'National ID Card', icon: CreditCard },
    { value: 'PASSPORT', label: 'Passport', icon: FileText },
    { value: 'DRIVERS_LICENSE', label: "Driver's License", icon: CreditCard },
  ];

  const categories = [
    { value: 'RECOVERY', label: 'Recovery & Healing' },
    { value: 'FITNESS', label: 'Fitness & Wellness' },
    { value: 'MEDITATION', label: 'Meditation & Mindfulness' },
  ];

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: 'idFront' | 'idBack' | 'selfie'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;

      if (field === 'idFront') {
        setFormData(prev => ({
          ...prev,
          idFrontFile: file,
          idFrontPreview: preview
        }));
      } else if (field === 'idBack') {
        setFormData(prev => ({
          ...prev,
          idBackFile: file,
          idBackPreview: preview
        }));
      } else if (field === 'selfie') {
        setFormData(prev => ({
          ...prev,
          selfieFile: file,
          selfiePreview: preview
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add document type
      formDataToSend.append('documentType', formData.documentType);

      // Add files
      if (formData.idFrontFile) {
        formDataToSend.append('idFront', formData.idFrontFile);
      }
      if (formData.idBackFile) {
        formDataToSend.append('idBack', formData.idBackFile);
      }
      if (formData.selfieFile) {
        formDataToSend.append('selfie', formData.selfieFile);
      }

      // Add additional info
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('categories', JSON.stringify(formData.categories));

      // Send to backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://192.168.3.10:3443';
      const response = await fetch(`${backendUrl}/api/verification/creator/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vybe_token')}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Verification Submitted!",
          description: "Your creator application is being reviewed. We'll notify you within 24-48 hours.",
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (step / 4) * 100;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 mx-auto text-vybe-cyan" />
        <h2 className="text-2xl font-bold">Identity Verification</h2>
        <p className="text-muted-foreground">
          To ensure community safety, we need to verify your identity
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your personal information is encrypted and will never be shared.
          We only use it to verify your identity and keep our community safe.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Label>Select your government-issued ID type</Label>
        <RadioGroup
          value={formData.documentType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}
        >
          {documentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value={type.value} id={type.value} />
                <Label htmlFor={type.value} className="flex items-center space-x-3 cursor-pointer flex-1">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span>{type.label}</span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!formData.documentType}
        className="w-full"
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CreditCard className="w-12 h-12 mx-auto text-vybe-purple" />
        <h2 className="text-2xl font-bold">Upload Your ID</h2>
        <p className="text-muted-foreground">
          Please upload clear photos of both sides of your ID
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Front of ID */}
        <div className="space-y-2">
          <Label>Front of ID *</Label>
          <div
            onClick={() => idFrontInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {formData.idFrontPreview ? (
              <div className="space-y-2">
                <img
                  src={formData.idFrontPreview}
                  alt="ID Front"
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-sm text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">Upload front side</p>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={idFrontInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'idFront')}
          />
        </div>

        {/* Back of ID */}
        <div className="space-y-2">
          <Label>Back of ID *</Label>
          <div
            onClick={() => idBackInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {formData.idBackPreview ? (
              <div className="space-y-2">
                <img
                  src={formData.idBackPreview}
                  alt="ID Back"
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-sm text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">Upload back side</p>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>
          <input
            ref={idBackInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'idBack')}
          />
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Make sure your ID is clearly visible, not expired, and all text is readable.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={!formData.idFrontFile || !formData.idBackFile}
          className="flex-1"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Camera className="w-12 h-12 mx-auto text-vybe-pink" />
        <h2 className="text-2xl font-bold">Take a Selfie</h2>
        <p className="text-muted-foreground">
          This helps us match your face with your ID photo
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-2">
        <Label>Your selfie *</Label>
        <div
          onClick={() => selfieInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        >
          {formData.selfiePreview ? (
            <div className="space-y-2">
              <img
                src={formData.selfiePreview}
                alt="Selfie"
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-sm text-muted-foreground">Click to retake</p>
            </div>
          ) : (
            <div className="space-y-2">
              <User className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Upload a selfie</p>
              <p className="text-xs text-muted-foreground">
                Face forward, good lighting, no sunglasses
              </p>
            </div>
          )}
        </div>
        <input
          ref={selfieInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'selfie')}
        />
      </div>

      <Alert>
        <Camera className="h-4 w-4" />
        <AlertDescription>
          Tips for a good selfie:
          <ul className="mt-2 ml-4 text-sm list-disc">
            <li>Face the camera directly</li>
            <li>Ensure good lighting on your face</li>
            <li>Remove sunglasses or hat</li>
            <li>Keep a neutral expression</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={() => setStep(4)}
          disabled={!formData.selfieFile}
          className="flex-1"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
        <h2 className="text-2xl font-bold">Almost Done!</h2>
        <p className="text-muted-foreground">
          Tell us about your creator journey
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">Why do you want to be a creator? *</Label>
          <Textarea
            id="bio"
            placeholder="Share your motivation and what you hope to achieve..."
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {formData.bio.length}/500 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Relevant experience (optional)</Label>
          <Textarea
            id="experience"
            placeholder="Any certifications, training, or experience in wellness, therapy, fitness..."
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Categories you want to create in *</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.value}
                onClick={() => handleCategoryToggle(category.value)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.categories.includes(category.value)
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.label}</span>
                  {formData.categories.includes(category.value) && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(3)}
          className="flex-1"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.bio || formData.categories.length === 0 || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-2xl mx-auto px-4 py-24">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of 4
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Your data is encrypted and secure.</p>
          <p>Verification usually takes 24-48 hours.</p>
        </div>
      </div>
    </div>
  );
};

export default CreatorVerification;