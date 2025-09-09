import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Configure ScrollTrigger for better performance and less scroll interference
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
      limitCallbacks: true // Reduce callback frequency
    });
    
    // Ensure ScrollTrigger doesn't interfere with natural scrolling
    ScrollTrigger.defaults({
      markers: false,
      anticipatePin: 0, // Reduce pin anticipation to prevent scroll jumping
      invalidateOnRefresh: true,
      fastScrollEnd: true // Improve performance during fast scrolling
    });
    
    // Create scroll animations with better performance
    const setupScrollAnimations = () => {
      // Reduce animation complexity for better scroll performance
      // Fade in animations for sections
      gsap.utils.toArray<HTMLElement>('.fade-in').forEach((element) => {
        gsap.fromTo(element, 
          {
            opacity: 0,
            y: 30
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              // Remove potential scroll blocking settings
              refreshPriority: 0
            }
          }
        );
      });

      // Slide in from left - reduced distance and duration
      gsap.utils.toArray<HTMLElement>('.slide-in-left').forEach((element) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            x: -50
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Slide in from right - reduced distance and duration
      gsap.utils.toArray<HTMLElement>('.slide-in-right').forEach((element) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            x: 50
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Scale in animations - reduced complexity
      gsap.utils.toArray<HTMLElement>('.scale-in').forEach((element) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            scale: 0.9
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Stagger animations - reduced stagger delay
      gsap.utils.toArray<HTMLElement>('.stagger-in').forEach((container) => {
        const children = Array.from(container.children) as HTMLElement[];
        gsap.fromTo(children,
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Simplified parallax effect - less aggressive and better performance
      gsap.utils.toArray<HTMLElement>('.parallax').forEach((element) => {
        gsap.to(element, {
          yPercent: -10, // Reduced from -20 to be less aggressive
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5, // Reduced scrub value for smoother movement
            refreshPriority: -1 // Lower priority to avoid interference
          }
        });
      });

      // Number counter animations - same as before
      gsap.utils.toArray<HTMLElement>('.counter').forEach((element) => {
        const target = parseInt(element.getAttribute('data-target') || '0') || 0;
        const obj = { number: 0 };
        
        gsap.to(obj, {
          number: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = Math.round(obj.number).toLocaleString();
          },
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });
    };

    // Setup animations with a longer delay to ensure smooth loading
    const timer = setTimeout(setupScrollAnimations, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { gsap, ScrollTrigger };
};

export default useGSAP;
