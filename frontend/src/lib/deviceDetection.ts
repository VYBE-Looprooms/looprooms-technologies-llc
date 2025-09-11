/**
 * Device detection utilities for VYBE LOOPROOMS™
 */

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for touch capability and screen size
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasSmallScreen = window.innerWidth <= 768;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 
    'blackberry', 'windows phone', 'mobile'
  ];
  
  const isMobileUserAgent = mobileKeywords.some(keyword => 
    userAgent.includes(keyword)
  );
  
  return isTouchDevice && (hasSmallScreen || isMobileUserAgent);
};

export const isDesktop = (): boolean => {
  return !isMobile();
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
  }
  
  return {
    name: browserName,
    userAgent,
    isMobile: isMobile(),
    isDesktop: isDesktop()
  };
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width <= 768) {
    return 'mobile';
  } else if (width <= 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};
