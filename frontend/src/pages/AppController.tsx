import { useState, useEffect } from 'react';
import Index from './Index';
import Waitlist from './Waitlist';

const AppController = () => {
  const [showWaitlist, setShowWaitlist] = useState(true);

  useEffect(() => {
    // Check if waitlist should be enabled
    const enableWaitlist = import.meta.env.VITE_ENABLE_WAITLIST === 'true';
    const appMode = import.meta.env.VITE_APP_MODE;
    
    // In production mode, always show waitlist unless explicitly disabled
    // In development mode, show full app unless explicitly enabled
    if (appMode === 'waitlist' || enableWaitlist) {
      setShowWaitlist(true);
    } else {
      setShowWaitlist(false);
    }
  }, []);

  return showWaitlist ? <Waitlist /> : <Index />;
};

export default AppController;
