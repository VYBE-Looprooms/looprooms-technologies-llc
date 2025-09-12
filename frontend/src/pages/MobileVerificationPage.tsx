import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MobileVerification from '@/components/MobileVerification';

const MobileVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const token = searchParams.get('token');

  return (
    <MobileVerification 
      sessionId={sessionId || undefined} 
      token={token || undefined} 
    />
  );
};

export default MobileVerificationPage;