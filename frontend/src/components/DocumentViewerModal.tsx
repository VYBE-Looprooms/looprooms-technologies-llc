import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    user: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    identityDocumentUrl?: string;
    identityDocumentBackUrl?: string;
    faceVerificationUrl?: string;
    identityDocumentType: string;
    faceVerificationScore?: number;
    faceVerificationCompleted: boolean;
  };
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/api/placeholder/600/400';
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://192.168.3.10:3443';
    return url.startsWith('http') ? url : `${backendUrl}${url}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Identity Verification Documents</span>
            <div className="flex items-center gap-2">
              {application.faceVerificationCompleted && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <Check className="w-3 h-3 mr-1" />
                  Face Verified ({Math.round((application.faceVerificationScore || 0) * 100)}%)
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            {application.user.firstName || 'Unknown'} {application.user.lastName || 'User'} - {application.user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="id-front" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="id-front">ID Front</TabsTrigger>
              <TabsTrigger value="id-back">ID Back</TabsTrigger>
              <TabsTrigger value="selfie">Selfie Verification</TabsTrigger>
            </TabsList>

            {/* Document Controls */}
            <div className="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-lg my-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                >
                  Reset
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {application.identityDocumentType.replace('_', ' ')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>

            <TabsContent value="id-front" className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
              {application.identityDocumentUrl ? (
                <div
                  className="relative flex items-center justify-center w-full h-full overflow-auto"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <img
                    src={getImageUrl(application.identityDocumentUrl)}
                    alt="ID Front"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p>No front document uploaded</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="id-back" className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
              {application.identityDocumentBackUrl ? (
                <div
                  className="relative flex items-center justify-center w-full h-full overflow-auto"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <img
                    src={getImageUrl(application.identityDocumentBackUrl)}
                    alt="ID Back"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p>No back document uploaded (optional)</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="selfie" className="h-[500px] flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
              {application.faceVerificationUrl ? (
                <div
                  className="relative flex items-center justify-center w-full h-full overflow-auto"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <img
                    src={getImageUrl(application.faceVerificationUrl)}
                    alt="Selfie Verification"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p>No selfie uploaded</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerModal;