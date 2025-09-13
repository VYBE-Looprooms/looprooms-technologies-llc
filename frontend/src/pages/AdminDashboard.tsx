import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  X,
  Eye,
  MessageSquare,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Bell,
  Filter,
  Search,
  Download,
  Mail
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreatorApplication {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  bio: string;
  interestedCategories: string[];
  primaryCategory: string;
  identityDocumentType: string;
  identityDocumentUrl?: string;
  faceVerificationCompleted: boolean;
  faceVerificationScore?: number;
  submittedAt: string;
  reviewNotes?: string;
  rejectionReason?: string;
  additionalInfoRequested?: string;
}

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [additionalInfoRequest, setAdditionalInfoRequest] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - will be replaced with API calls
    const mockApplications: CreatorApplication[] = [
      {
        id: '1',
        user: {
          id: '1',
          email: 'sarah.m@example.com',
          firstName: 'Sarah',
          lastName: 'Martinez',
          avatar: '/api/placeholder/40/40'
        },
        status: 'UNDER_REVIEW',
        bio: 'Licensed therapist with 8 years of experience in trauma recovery. Specialized in EMDR and somatic therapies. Passionate about creating safe healing spaces.',
        interestedCategories: ['RECOVERY', 'MEDITATION'],
        primaryCategory: 'RECOVERY',
        identityDocumentType: 'DRIVERS_LICENSE',
        identityDocumentUrl: '/uploads/identity/sarah-dl.jpg',
        faceVerificationCompleted: true,
        faceVerificationScore: 0.94,
        submittedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        user: {
          id: '2',
          email: 'marcus.chen@example.com',
          firstName: 'Marcus',
          lastName: 'Chen',
          avatar: '/api/placeholder/40/40'
        },
        status: 'PENDING',
        bio: 'Certified personal trainer and wellness coach. 5 years helping people overcome addiction through fitness and mindfulness.',
        interestedCategories: ['FITNESS', 'RECOVERY'],
        primaryCategory: 'FITNESS',
        identityDocumentType: 'PASSPORT',
        faceVerificationCompleted: false,
        submittedAt: '2024-01-16T14:20:00Z'
      },
      {
        id: '3',
        user: {
          id: '3',
          email: 'lisa.wong@example.com',
          firstName: 'Lisa',
          lastName: 'Wong',
          avatar: '/api/placeholder/40/40'
        },
        status: 'APPROVED',
        bio: 'Mindfulness instructor and meditation guide. 10+ years teaching various meditation techniques and breathwork.',
        interestedCategories: ['MEDITATION', 'RECOVERY'],
        primaryCategory: 'MEDITATION',
        identityDocumentType: 'NATIONAL_ID',
        identityDocumentUrl: '/uploads/identity/lisa-id.jpg',
        faceVerificationCompleted: true,
        faceVerificationScore: 0.98,
        submittedAt: '2024-01-14T09:15:00Z',
        reviewNotes: 'Excellent qualifications and verification scores. Approved for creator status.'
      }
    ];
    
    setApplications(mockApplications);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return Clock;
      case 'UNDER_REVIEW': return Eye;
      case 'APPROVED': return CheckCircle;
      case 'REJECTED': return X;
      default: return Clock;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = 
      app.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = async (applicationId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'APPROVED' as const, reviewNotes } 
            : app
        )
      );
      setSelectedApplication(null);
      setReviewNotes('');
      setLoading(false);
    }, 1000);
  };

  const handleReject = async (applicationId: string) => {
    if (!rejectionReason.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                status: 'REJECTED' as const, 
                rejectionReason,
                additionalInfoRequested: additionalInfoRequest
              } 
            : app
        )
      );
      setSelectedApplication(null);
      setRejectionReason('');
      setAdditionalInfoRequest('');
      setLoading(false);
    }, 1000);
  };

  const handleRequestMoreInfo = async (applicationId: string) => {
    if (!additionalInfoRequest.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                status: 'PENDING' as const, 
                additionalInfoRequested: additionalInfoRequest
              } 
            : app
        )
      );
      setSelectedApplication(null);
      setAdditionalInfoRequest('');
      setLoading(false);
    }, 1000);
  };

  const pendingCount = applications.filter(app => app.status === 'PENDING').length;
  const underReviewCount = applications.filter(app => app.status === 'UNDER_REVIEW').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-vybe-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8 text-vybe-primary" />
                Admin Dashboard
              </h1>
              <p className="text-lg text-foreground/70">
                Manage creator applications and content moderation
              </p>
            </div>
            
            {/* Notification Badge */}
            <div className="flex items-center gap-4">
              {(pendingCount > 0 || underReviewCount > 0) && (
                <div className="flex items-center gap-2 bg-vybe-primary/10 border border-vybe-primary/20 rounded-lg px-4 py-2">
                  <Bell className="w-5 h-5 text-vybe-primary" />
                  <span className="text-sm font-medium">
                    {pendingCount + underReviewCount} applications need attention
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="vybe-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="vybe-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold text-blue-600">{underReviewCount}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="vybe-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'APPROVED').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="vybe-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {applications.filter(app => app.status === 'REJECTED').length}
                  </p>
                </div>
                <X className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <Card className="vybe-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const StatusIcon = getStatusIcon(application.status);
                
                return (
                  <Card 
                    key={application.id} 
                    className={`vybe-card cursor-pointer transition-all hover:shadow-lg ${
                      selectedApplication?.id === application.id 
                        ? 'ring-2 ring-vybe-primary border-vybe-primary' 
                        : ''
                    }`}
                    onClick={() => setSelectedApplication(application)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={application.user.avatar} alt={application.user.firstName} />
                            <AvatarFallback>
                              {application.user.firstName.charAt(0)}{application.user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {application.user.firstName} {application.user.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">{application.user.email}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {application.primaryCategory}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(application.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="text-sm text-foreground line-clamp-2">
                              {application.bio}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(application.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {application.status.replace('_', ' ')}
                          </Badge>
                          
                          {application.faceVerificationCompleted && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              Verified ({Math.round((application.faceVerificationScore || 0) * 100)}%)
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Application Details & Actions */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <Card className="vybe-card sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Application Review
                  </CardTitle>
                  <CardDescription>
                    Review and manage creator application
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Application Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Personal Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {selectedApplication.user.firstName} {selectedApplication.user.lastName}</p>
                        <p><strong>Email:</strong> {selectedApplication.user.email}</p>
                        <p><strong>Document:</strong> {selectedApplication.identityDocumentType.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Background</h4>
                      <p className="text-sm text-muted-foreground">{selectedApplication.bio}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedApplication.interestedCategories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedApplication.identityDocumentUrl && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Identity Documents</h4>
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          View Documents
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  {selectedApplication.status !== 'APPROVED' && selectedApplication.status !== 'REJECTED' && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Review Notes (Optional)
                        </label>
                        <Textarea
                          placeholder="Add internal notes about this review..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(selectedApplication.id)}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Rejection Reason
                          </label>
                          <Textarea
                            placeholder="Explain why the application is being rejected..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Request Additional Information
                          </label>
                          <Textarea
                            placeholder="What additional information is needed?..."
                            value={additionalInfoRequest}
                            onChange={(e) => setAdditionalInfoRequest(e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReject(selectedApplication.id)}
                            disabled={loading || !rejectionReason.trim()}
                            variant="destructive"
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          
                          <Button
                            onClick={() => handleRequestMoreInfo(selectedApplication.id)}
                            disabled={loading || !additionalInfoRequest.trim()}
                            variant="outline"
                            className="flex-1"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Info
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show existing review notes/reasons */}
                  {(selectedApplication.reviewNotes || selectedApplication.rejectionReason) && (
                    <div className="pt-4 border-t">
                      {selectedApplication.reviewNotes && (
                        <div className="mb-3">
                          <h4 className="font-medium text-foreground mb-2">Review Notes</h4>
                          <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                            {selectedApplication.reviewNotes}
                          </p>
                        </div>
                      )}
                      
                      {selectedApplication.rejectionReason && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Rejection Reason</h4>
                          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            {selectedApplication.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="vybe-card">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-vybe-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-vybe-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Select an Application</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose an application from the list to review details and take action.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;