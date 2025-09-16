import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  User,
  Heart,
  Brain,
  Dumbbell,
  Upload,
  Camera,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApplicationForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  interestedCategories: string[];
  primaryCategory: string;
  experience: string;
  socialMediaLinks: string[];
  identityDocumentType: 'national_id' | 'passport' | 'drivers_license';
  identityDocument: File | null;
  identityDocumentBack: File | null;
  faceVerification: File | null;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

const categories = [
  {
    id: 'recovery',
    label: 'Recovery',
    icon: Heart,
    description: 'Addiction recovery, mental health support, trauma healing'
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: Brain,
    description: 'Mindfulness, breathwork, spiritual practices'
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: Dumbbell,
    description: 'Physical wellness, yoga, movement therapy'
  }
];

const documentTypes = [
  { value: 'national_id', label: 'National ID Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: 'Driver\'s License' }
];

const CreatorApplication: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    interestedCategories: [],
    primaryCategory: '',
    experience: '',
    socialMediaLinks: [''],
    identityDocumentType: 'national_id',
    identityDocument: null,
    identityDocumentBack: null,
    faceVerification: null,
    termsAccepted: false,
    privacyAccepted: false
  });

  const updateForm = (field: keyof ApplicationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryId: string) => {
    const currentCategories = form.interestedCategories;
    if (currentCategories.includes(categoryId)) {
      updateForm('interestedCategories', currentCategories.filter(id => id !== categoryId));
      if (form.primaryCategory === categoryId) {
        updateForm('primaryCategory', '');
      }
    } else {
      updateForm('interestedCategories', [...currentCategories, categoryId]);
      if (!form.primaryCategory) {
        updateForm('primaryCategory', categoryId);
      }
    }
  };

  const handleFileUpload = (field: 'identityDocument' | 'identityDocumentBack' | 'faceVerification', file: File) => {
    updateForm(field, file);
  };

  const addSocialMediaLink = () => {
    updateForm('socialMediaLinks', [...form.socialMediaLinks, '']);
  };

  const updateSocialMediaLink = (index: number, value: string) => {
    const newLinks = [...form.socialMediaLinks];
    newLinks[index] = value;
    updateForm('socialMediaLinks', newLinks);
  };

  const removeSocialMediaLink = (index: number) => {
    const newLinks = form.socialMediaLinks.filter((_, i) => i !== index);
    updateForm('socialMediaLinks', newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.termsAccepted || !form.privacyAccepted) {
      alert('Please accept the terms and privacy policy');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual creator application submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying to become a VYBE creator. Our team will review your application and get back to you within 2-3 business days.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Creator Application</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Step 1 of 1
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Introduction */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to the Creator Program</h3>
                  <p className="text-muted-foreground mb-4">
                    VYBE creators lead live Looprooms and create guided Loopchains to support our community's wellness journey.
                    As a creator, you'll have the ability to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Host live interactive sessions in Recovery, Meditation, or Fitness</li>
                    <li>Create structured journey paths (Loopchains) for participants</li>
                    <li>Build a following and earn through our creator fund program</li>
                    <li>Access creator-only tools and analytics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => updateForm('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Why do you want to become a creator? *</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => updateForm('bio', e.target.value)}
                  placeholder="Tell us about your motivation and what you hope to bring to the VYBE community..."
                  className="mt-1 resize-none"
                  rows={4}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {500 - form.bio.length} characters remaining
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categories & Expertise */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle>Categories & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base">Which categories are you interested in? *</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select all that apply. You can create content in multiple categories.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = form.interestedCategories.includes(category.id);
                    return (
                      <div
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h4 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {category.label}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {form.interestedCategories.length > 0 && (
                <div>
                  <Label htmlFor="primaryCategory">Primary Category *</Label>
                  <select
                    id="primaryCategory"
                    value={form.primaryCategory}
                    onChange={(e) => updateForm('primaryCategory', e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  >
                    <option value="">Select your main focus area</option>
                    {categories
                      .filter(cat => form.interestedCategories.includes(cat.id))
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  value={form.experience}
                  onChange={(e) => updateForm('experience', e.target.value)}
                  placeholder="Describe your experience in wellness, coaching, therapy, fitness, or related fields..."
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <Label>Social Media Links (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Help us understand your existing presence and style
                </p>
                {form.socialMediaLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={link}
                      onChange={(e) => updateSocialMediaLink(index, e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialMediaLink(index)}
                      disabled={form.socialMediaLinks.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSocialMediaLink}
                  disabled={form.socialMediaLinks.length >= 3}
                >
                  Add Another Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Identity Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Identity Verification Required</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    To maintain trust and safety in our community, all creators must verify their identity.
                    Your documents are securely encrypted and only reviewed by our verification team.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="documentType">Document Type *</Label>
                <select
                  id="documentType"
                  value={form.identityDocumentType}
                  onChange={(e) => updateForm('identityDocumentType', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Upload Document *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a clear photo of your {documentTypes.find(t => t.value === form.identityDocumentType)?.label}
                </p>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {form.identityDocument ? form.identityDocument.name : 'Click to upload document front'}
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('identityDocument', file);
                    }}
                    className="hidden"
                    id="identity-document"
                  />
                  <Label htmlFor="identity-document" className="cursor-pointer">
                    <Button type="button" variant="outline" className="rounded-xl">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </Label>
                </div>
              </div>

              {form.identityDocumentType !== 'passport' && (
                <div>
                  <Label>Document Back (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload the back of your document if it contains additional information
                  </p>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {form.identityDocumentBack ? form.identityDocumentBack.name : 'Click to upload document back'}
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('identityDocumentBack', file);
                      }}
                      className="hidden"
                      id="identity-document-back"
                    />
                    <Label htmlFor="identity-document-back" className="cursor-pointer">
                      <Button type="button" variant="outline" className="rounded-xl">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </Label>
                  </div>
                </div>
              )}

              <div>
                <Label>Face Verification (Recommended)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Take a clear selfie for additional security verification
                </p>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {form.faceVerification ? form.faceVerification.name : 'Click to upload selfie'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('faceVerification', file);
                    }}
                    className="hidden"
                    id="face-verification"
                  />
                  <Label htmlFor="face-verification" className="cursor-pointer">
                    <Button type="button" variant="outline" className="rounded-xl">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Selfie
                    </Button>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={form.termsAccepted}
                  onCheckedChange={(checked) => updateForm('termsAccepted', checked)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I accept the <a href="/terms" className="text-primary hover:underline">Creator Terms of Service</a> and
                  understand my responsibilities as a VYBE creator, including maintaining professional conduct and
                  adhering to community guidelines.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={form.privacyAccepted}
                  onCheckedChange={(checked) => updateForm('privacyAccepted', checked)}
                  className="mt-1"
                />
                <Label htmlFor="privacy" className="text-sm leading-relaxed">
                  I acknowledge that I have read and accept the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and
                  consent to the processing of my personal data for verification purposes.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !form.termsAccepted || !form.privacyAccepted || !form.identityDocument}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl px-8"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorApplication;