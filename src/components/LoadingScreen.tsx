import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

export const LoadingScreen = ({ children, minLoadTime = 300 }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    // Ensure minimum loading time for smooth transition
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, minLoadTime);

    // Also check if document is ready
    const checkReady = () => {
      if (document.readyState === 'complete') {
        setTimeout(() => setIsContentReady(true), Math.max(0, minLoadTime - Date.now()));
      }
    };

    if (document.readyState === 'complete') {
      checkReady();
    } else {
      document.addEventListener('readystatechange', checkReady);
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener('readystatechange', checkReady);
    };
  }, [minLoadTime]);

  useEffect(() => {
    if (isContentReady) {
      // Small delay to ensure GSAP has set initial states
      const fadeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(fadeTimer);
    }
  }, [isContentReady]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          {/* VYBE Logo Animation */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-muted animate-spin">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-vybe-cyan animate-spin"></div>
            </div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-vybe-cyan/20 to-vybe-purple/20 animate-pulse"></div>
          </div>
          
          {/* Loading Text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gradient">VYBE LOOPROOMS</h3>
            <p className="text-sm text-muted-foreground mt-1">Loading experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingScreen;
