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

    // Smooth scrolling configuration
    gsap.set(document.documentElement, {
      scrollBehavior: "smooth"
    });

    // Initialize smooth scroll
    gsap.registerPlugin(ScrollTrigger);
    
    // Create scroll animations
    const setupScrollAnimations = () => {
      // Fade in animations for sections
      gsap.utils.toArray('.fade-in').forEach((element: Element) => {
        gsap.fromTo(element, 
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Slide in from left
      gsap.utils.toArray('.slide-in-left').forEach((element: Element) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            x: -100
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Slide in from right
      gsap.utils.toArray('.slide-in-right').forEach((element: Element) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            x: 100
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Scale in animations
      gsap.utils.toArray('.scale-in').forEach((element: Element) => {
        gsap.fromTo(element,
          {
            opacity: 0,
            scale: 0.8
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Stagger animations for grids
      gsap.utils.toArray('.stagger-in').forEach((container: Element) => {
        const children = (container as HTMLElement).children;
        gsap.fromTo(children,
          {
            opacity: 0,
            y: 50,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Parallax effect for background elements
      gsap.utils.toArray('.parallax').forEach((element: Element) => {
        gsap.to(element, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      // Text reveal animations
      gsap.utils.toArray('.text-reveal').forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        const text = htmlElement.textContent || '';
        htmlElement.innerHTML = text.split('').map((char: string) => 
          char === ' ' ? ' ' : `<span class="char">${char}</span>`
        ).join('');

        gsap.fromTo(htmlElement.querySelectorAll('.char'),
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.05,
            ease: "power2.out",
            stagger: 0.02,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Number counter animations
      gsap.utils.toArray('.counter').forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        const target = parseInt(htmlElement.getAttribute('data-target') || '0');
        const obj = { number: 0 };
        
        gsap.to(obj, {
          number: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            htmlElement.textContent = Math.round(obj.number).toLocaleString();
          },
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });
    };

    // Setup animations after a small delay to ensure DOM is ready
    const timer = setTimeout(setupScrollAnimations, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { gsap, ScrollTrigger };
};

export default useGSAP;
