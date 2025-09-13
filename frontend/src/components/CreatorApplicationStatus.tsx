import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Timer,
  FileCheck,
  UserCheck
} from 'lucide-react';

interface CreatorApplicationStatusProps {
  application: {
    id: string;
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REQUIRES_ADDITIONAL_INFO';
    faceVerificationCompleted?: boolean;
    identityDocumentUrl?: string;
    reviewNotes?: string;
    rejectionReason?: string;
    additionalInfoRequested?: string;
    submittedAt?: string;
  };
  identityVerified: boolean;
  onStartVerification: () => void;
}

const CreatorApplicationStatus: React.FC<CreatorApplicationStatusProps> = ({
  application,
  identityVerified,
  onStartVerification
}) => {
  const getStatusInfo = () => {
    switch (application.status) {
      case 'PENDING':
        return {
          color: 'bg-amber-500',
          icon: Clock,
          title: 'Application Pending',
          description: 'Complete identity verification to proceed',
          progress: identityVerified ? 66 : 33
        };
      case 'UNDER_REVIEW':
        return {
          color: 'bg-blue-500',
          icon: Eye,
          title: 'Under Review',
          description: 'Our team is reviewing your application',
          progress: 85
        };
      case 'APPROVED':
        return {
          color: 'bg-green-500',
          icon: CheckCircle,
          title: 'Approved',
          description: 'Welcome to the creator community!',
          progress: 100
        };
      case 'REJECTED':
        return {
          color: 'bg-red-500',
          icon: AlertCircle,
          title: 'Application Rejected',
          description: application.rejectionReason || 'Application was not approved',
          progress: 0
        };
      case 'REQUIRES_ADDITIONAL_INFO':
        return {
          color: 'bg-orange-500',
          icon: AlertCircle,
          title: 'Additional Information Required',
          description: application.additionalInfoRequested || 'Please provide additional information',
          progress: 50
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: Clock,
          title: 'Processing',
          description: 'Please wait...',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getEstimatedTime = () => {
    if (application.status === 'UNDER_REVIEW') {
      return '2-3 business days';
    }
    if (application.status === 'PENDING' && !identityVerified) {
      return '5 minutes';
    }
    return null;
  };

  const estimatedTime = getEstimatedTime();

  return (
    <Card className="border-l-4 border-l-vybe-primary bg-gradient-to-r from-vybe-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${statusInfo.color} bg-opacity-20`}>
              <StatusIcon className={`w-5 h-5 text-${statusInfo.color.split('-')[1]}-600`} />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{statusInfo.title}</CardTitle>
              <CardDescription className="text-sm">
                {statusInfo.description}
              </CardDescription>
            </div>
          </div>
          
          <Badge 
            variant={application.status === 'APPROVED' ? 'default' : 'secondary'}
            className="shrink-0"
          >
            Creator Application
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{statusInfo.progress}%</span>
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
        </div>

        {/* Status-specific content */}
        {application.status === 'PENDING' && !identityVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-950/20 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-amber-900 dark:text-amber-100">Identity Verification Required</h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Complete identity verification to move your application forward.
                </p>
                <Button size="sm" onClick={onStartVerification} className="mt-2">
                  Start Verification
                </Button>
              </div>
            </div>
          </div>
        )}

        {application.status === 'UNDER_REVIEW' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950/20 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Review in Progress</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Your identity has been verified successfully. Our team is now reviewing your creator application.
                </p>
                {estimatedTime && (
                  <div className="flex items-center gap-2 mt-2">
                    <Timer className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Estimated time: {estimatedTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {application.status === 'APPROVED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-950/20 dark:border-green-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">Application Approved!</h4>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Congratulations! You now have access to creator tools and can start building content.
                </p>
              </div>
            </div>
          </div>
        )}

        {application.status === 'REJECTED' && application.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-950/20 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Additional Information Needed</h4>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  {application.rejectionReason}
                </p>
                {application.additionalInfoRequested && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm text-red-800 dark:text-red-200">
                    <strong>Required:</strong> {application.additionalInfoRequested}
                  </div>
                )}
                <Button size="sm" variant="outline" className="mt-2">
                  Update Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatorApplicationStatus;