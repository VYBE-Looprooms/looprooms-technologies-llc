import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerificationV2 from '@/components/VerificationV2';

const IdentityVerificationPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleVerificationComplete = async () => {
    try {
      // The verification is already complete and database is updated by the backend
      // We just need to refresh user data and navigate to dashboard
      
      // Refresh user data to get updated verification status
      await refreshUser();
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Still navigate to dashboard even if refresh fails
      navigate('/dashboard');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <VerificationV2 onComplete={handleVerificationComplete} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IdentityVerificationPage;
