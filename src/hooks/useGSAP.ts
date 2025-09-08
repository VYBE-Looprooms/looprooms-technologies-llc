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

    // Clean, optimized initialization
    const initializeAnimations = () => {
      // Set initial states immediately to prevent flash
      gsap.set('.fade-in', { opacity: 0, y: 20 });
      gsap.set('.slide-in-left', { opacity: 0, x: -40 });
      gsap.set('.slide-in-right', { opacity: 0, x: 40 });
      gsap.set('.scale-in', { opacity: 0, scale: 0.95 });
      gsap.set('.stagger-in > *', { opacity: 0, y: 30 });

      // Remove loading state and show content
      document.body.classList.remove('gsap-loading');
      document.body.classList.add('gsap-ready');

      // Simplified ScrollTrigger configuration to prevent scroll conflicts
      const setupScrollAnimations = () => {
        // Configure ScrollTrigger for optimal performance
        ScrollTrigger.config({
          limitCallbacks: true,
          syncInterval: 150
        });

        // Batch all similar animations for better performance
        const animationGroups = [
          {
            selector: '.fade-in',
            animation: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          },
          {
            selector: '.slide-in-left',
            animation: { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
          },
          {
            selector: '.slide-in-right',
            animation: { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }
          },
          {
            selector: '.scale-in',
            animation: { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
          }
        ];

        // Apply animations with simplified ScrollTrigger
        animationGroups.forEach(({ selector, animation }) => {
          const elements = gsap.utils.toArray(selector);
          elements.forEach((element: Element) => {
            gsap.to(element, {
              ...animation,
              scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse",
                once: false
              }
            });
          });
        });

        // Optimized stagger animations
        const staggerContainers = gsap.utils.toArray('.stagger-in');
        staggerContainers.forEach((container: Element) => {
          const children = Array.from((container as HTMLElement).children);
          if (children.length > 0) {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            });
          }
        });

        // Simplified text reveal (only if needed)
        const textRevealElements = gsap.utils.toArray('.text-reveal');
        textRevealElements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          if (!htmlElement.dataset.processed) {
            const text = htmlElement.textContent || '';
            htmlElement.innerHTML = text.split('').map((char: string) => 
              char === ' ' ? ' ' : `<span class="char inline-block">${char}</span>`
            ).join('');
            htmlElement.dataset.processed = 'true';

            gsap.to(htmlElement.querySelectorAll('.char'), {
              opacity: 1,
              y: 0,
              duration: 0.03,
              stagger: 0.02,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            });
          }
        });

        // Counter animations (simplified)
        const counterElements = gsap.utils.toArray('.counter');
        counterElements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          const target = parseInt(htmlElement.getAttribute('data-target') || '0');
          
          ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            onEnter: () => {
              const obj = { number: 0 };
              gsap.to(obj, {
                number: target,
                duration: 1.2,
                ease: "power2.out",
                onUpdate: () => {
                  htmlElement.textContent = Math.round(obj.number).toLocaleString();
                }
              });
            }
          });
        });

        // REMOVED: Parallax effects that cause scroll interference
        // The parallax scrub was causing the sticky scroll behavior
      };

      // Execute animations setup
      requestAnimationFrame(() => {
        setupScrollAnimations();
        
        // Single refresh after setup
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      });
    };

    // Initialize when ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAnimations);
    } else {
      initializeAnimations();
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearMatchMedia();
      document.removeEventListener('DOMContentLoaded', initializeAnimations);
    };
  }, []);

  // Utility function to refresh animations when content changes
  const refreshAnimations = () => {
    ScrollTrigger.refresh();
  };

  return { gsap, ScrollTrigger, refreshAnimations };
};

export default useGSAP;
