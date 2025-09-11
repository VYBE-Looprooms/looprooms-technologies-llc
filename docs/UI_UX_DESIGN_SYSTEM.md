# VYBE LOOPROOMS™ - UI/UX Design System

> **Version**: 1.0  
> **Date**: September 11, 2025  
> **Design Philosophy**: Emotional-First, Wellness-Centered Design  

## 🎨 Design Philosophy

VYBE LOOPROOMS™ prioritizes **emotional wellbeing** in every design decision. Our interface reduces anxiety, promotes positive interactions, and creates a calming, supportive environment for users on their wellness journey.

### **Core Principles**
1. **Emotional Safety First**: No negative feedback mechanisms, calming interactions
2. **Inclusive Accessibility**: WCAG 2.1 AA compliance, diverse representation
3. **Mindful Interactions**: Reduce cognitive load, promote mindful engagement
4. **Positive Reinforcement**: Celebrate progress, encourage continued growth
5. **Privacy by Design**: Clear privacy controls, anonymous options always available

---

## 🌈 Color System

### **Primary Brand Colors**
```css
:root {
  /* VYBE Brand Colors */
  --vybe-cyan: #06b6d4;      /* Primary brand, energy, clarity */
  --vybe-blue: #3b82f6;      /* Trust, stability, depth */
  --vybe-purple: #8b5cf6;    /* Creativity, transformation */
  --vybe-pink: #ec4899;      /* Compassion, warmth, connection */
  
  /* Wellness Colors */
  --wellness-green: #10b981;  /* Growth, healing, nature */
  --recovery-orange: #f59e0b; /* Strength, courage, renewal */
  --mindful-indigo: #6366f1;  /* Wisdom, introspection */
  --peace-lavender: #c084fc;  /* Calm, serenity, balance */
}
```

### **Semantic Color Palette**
```css
:root {
  /* Positive Feedback */
  --success: #10b981;
  --celebration: #f59e0b;
  --encouragement: #06b6d4;
  
  /* Neutral Information */
  --info: #3b82f6;
  --warning: #f59e0b;
  
  /* Gentle Alerts (no harsh reds) */
  --gentle-alert: #f97316;
  --soft-error: #ef4444;
  
  /* Content Categories */
  --recovery: #10b981;
  --wellness: #3b82f6;
  --meditation: #8b5cf6;
  --fitness: #f59e0b;
  --healthy-living: #06b6d4;
}
```

### **Dark/Light Mode Support**
```css
/* Light Mode (Default) */
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #f8fafc;
  --card-foreground: #1e293b;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
}

/* Dark Mode */
[data-theme="dark"] {
  --background: #0f172a;
  --foreground: #f8fafc;
  --card: #1e293b;
  --card-foreground: #f1f5f9;
  --muted: #334155;
  --muted-foreground: #94a3b8;
  --border: #334155;
}
```

---

## 📝 Typography System

### **Font Stack**
```css
/* Primary Font - Readable, friendly */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings - Strong, confident */
--font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - Technical content */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### **Type Scale**
```css
:root {
  /* Display (Hero titles) */
  --text-display-lg: 4.5rem;    /* 72px */
  --text-display-md: 3.75rem;   /* 60px */
  --text-display-sm: 3rem;      /* 48px */
  
  /* Headlines */
  --text-h1: 2.25rem;           /* 36px */
  --text-h2: 1.875rem;          /* 30px */
  --text-h3: 1.5rem;            /* 24px */
  --text-h4: 1.25rem;           /* 20px */
  --text-h5: 1.125rem;          /* 18px */
  --text-h6: 1rem;              /* 16px */
  
  /* Body Text */
  --text-body-lg: 1.125rem;     /* 18px */
  --text-body: 1rem;            /* 16px */
  --text-body-sm: 0.875rem;     /* 14px */
  --text-caption: 0.75rem;      /* 12px */
}
```

### **Text Styles**
```css
.text-gradient {
  background: linear-gradient(135deg, var(--vybe-cyan), var(--vybe-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-reverse {
  background: linear-gradient(135deg, var(--vybe-purple), var(--vybe-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-wellness {
  color: var(--wellness-green);
  font-weight: 600;
}
```

---

## 🔘 Component Library

### **Button System**
```tsx
// Primary action buttons
const ButtonVariants = {
  // Main CTA - gradient, prominent
  primary: "bg-gradient-to-r from-vybe-cyan to-vybe-purple text-white hover:shadow-lg transition-all duration-300",
  
  // Secondary actions - outlined
  secondary: "border-2 border-vybe-cyan text-vybe-cyan hover:bg-vybe-cyan hover:text-white transition-all",
  
  // Gentle actions - soft background
  gentle: "bg-vybe-cyan/10 text-vybe-cyan hover:bg-vybe-cyan/20 transition-colors",
  
  // Success states - positive reinforcement
  success: "bg-wellness-green text-white hover:bg-wellness-green/90",
  
  // Destructive (rare) - soft, not harsh
  destructive: "bg-soft-error/10 text-soft-error hover:bg-soft-error/20"
};

// Button component with wellness-focused design
export const Button = ({ variant = "primary", size = "md", children, ...props }) => (
  <button 
    className={`
      ${ButtonVariants[variant]}
      ${size === "sm" ? "px-3 py-1.5 text-sm" : "px-6 py-3 text-base"}
      ${size === "lg" ? "px-8 py-4 text-lg" : ""}
      rounded-lg font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-vybe-cyan/50
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
    {...props}
  >
    {children}
  </button>
);
```

### **Card Components**
```tsx
// Content cards with soft shadows and rounded corners
export const LooproomCard = ({ looproom, userEngagement }) => (
  <div className="vybe-card group hover:scale-[1.02] transition-transform duration-300">
    {/* Thumbnail with gradient overlay */}
    <div className="relative aspect-video rounded-t-lg overflow-hidden">
      <img 
        src={looproom.thumbnail} 
        alt={looproom.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <PlayIcon className="w-6 h-6 text-vybe-cyan ml-1" />
        </button>
      </div>
      
      {/* Duration badge */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {formatDuration(looproom.duration)}
      </div>
    </div>
    
    {/* Content */}
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-vybe-cyan/10 text-vybe-cyan">
          {looproom.category.name}
        </span>
        <div className="flex items-center space-x-1">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-foreground/70">{looproom.averageRating}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{looproom.title}</h3>
      <p className="text-foreground/70 text-sm line-clamp-3 mb-3">{looproom.description}</p>
      
      {/* Creator info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src={looproom.creator.avatarUrl} 
            alt={looproom.creator.displayName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-foreground/70">{looproom.creator.displayName}</span>
        </div>
        
        {/* Engagement indicators */}
        <div className="flex items-center space-x-3">
          <button className="text-foreground/50 hover:text-vybe-pink transition-colors">
            <HeartIcon className={`w-5 h-5 ${userEngagement.hasReacted ? 'text-vybe-pink fill-current' : ''}`} />
          </button>
          <button className="text-foreground/50 hover:text-vybe-cyan transition-colors">
            <BookmarkIcon className={`w-5 h-5 ${userEngagement.isSaved ? 'text-vybe-cyan fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
```

### **Social Feed Components**
```tsx
// Shared VYBE post component
export const SharedVybePost = ({ vybe, onReact, onComment }) => (
  <article className="vybe-card border-l-4 border-l-vybe-cyan/30">
    {/* Author header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        {!vybe.isAnonymous ? (
          <>
            <img 
              src={vybe.author.avatarUrl} 
              alt={vybe.author.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{vybe.author.displayName}</p>
              <p className="text-sm text-foreground/60">{formatTimeAgo(vybe.createdAt)}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vybe-purple/20 to-vybe-cyan/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-vybe-purple" />
            </div>
            <div>
              <p className="font-medium text-vybe-purple">Anonymous VYBER</p>
              <p className="text-sm text-foreground/60">{formatTimeAgo(vybe.createdAt)}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Vybe type badge */}
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${vybeTypeBadgeStyles[vybe.type]}`}>
        {vybeTypeLabels[vybe.type]}
      </span>
    </div>
    
    {/* Content */}
    <div className="mb-4">
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{vybe.content}</p>
      
      {/* Linked Looproom */}
      {vybe.looproom && (
        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-vybe-cyan/20">
          <div className="flex items-center space-x-3">
            <img 
              src={vybe.looproom.thumbnail} 
              alt={vybe.looproom.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="font-medium text-sm">{vybe.looproom.title}</p>
              <p className="text-xs text-foreground/60">Looproom Experience</p>
            </div>
          </div>
        </div>
      )}
    </div>
    
    {/* Engagement actions */}
    <div className="flex items-center justify-between pt-3 border-t border-border">
      <div className="flex items-center space-x-4">
        {positiveReactions.map((reaction) => (
          <button
            key={reaction.type}
            onClick={() => onReact(reaction.type)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors ${
              vybe.userEngagement?.reaction === reaction.type
                ? 'bg-vybe-pink/20 text-vybe-pink'
                : 'hover:bg-muted text-foreground/60'
            }`}
          >
            <reaction.icon className="w-4 h-4" />
            <span className="text-sm">{reaction.count || 0}</span>
          </button>
        ))}
      </div>
      
      <button 
        onClick={onComment}
        className="flex items-center space-x-1 text-foreground/60 hover:text-vybe-cyan transition-colors"
      >
        <MessageCircleIcon className="w-4 h-4" />
        <span className="text-sm">{vybe.commentCount} comments</span>
      </button>
    </div>
  </article>
);
```

---

## 🎭 Animation System

### **GSAP Integration**
```typescript
// Smooth, wellness-focused animations
export const useVybeAnimations = () => {
  const fadeInUp = (element: HTMLElement, delay = 0) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        delay,
        ease: "power2.out"
      }
    );
  };
  
  const gentleHover = (element: HTMLElement) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(element, { 
      scale: 1.05, 
      duration: 0.3, 
      ease: "power2.out" 
    });
    
    element.addEventListener('mouseenter', () => tl.play());
    element.addEventListener('mouseleave', () => tl.reverse());
  };
  
  const celebrationPulse = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };
  
  return { fadeInUp, gentleHover, celebrationPulse };
};
```

### **Micro-Interactions**
```css
/* Gentle loading states */
.loading-shimmer {
  background: linear-gradient(90deg, 
    var(--muted) 0%, 
    var(--muted-foreground)/10 50%, 
    var(--muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Positive feedback animations */
.success-bounce {
  animation: gentle-bounce 0.6s ease-out;
}

@keyframes gentle-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Progress animations */
.progress-fill {
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📱 Responsive Design

### **Breakpoint System**
```css
:root {
  --breakpoint-sm: 640px;   /* Mobile large */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Desktop large */
  --breakpoint-2xl: 1536px; /* Desktop XL */
}

/* Mobile-first responsive utilities */
.container {
  width: 100%;
  max-width: var(--breakpoint-2xl);
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

### **Mobile Optimizations**
```tsx
// Touch-friendly sizing and spacing
const mobileOptimizations = {
  // Minimum touch target size: 44x44px
  touchTarget: "min-h-[44px] min-w-[44px]",
  
  // Comfortable spacing for thumbs
  bottomNavigation: "pb-safe-area-inset-bottom h-16",
  
  // Easy-to-reach interaction zones
  floatingAction: "fixed bottom-6 right-6 w-14 h-14",
  
  // Readable text sizes on mobile
  mobileText: {
    hero: "text-3xl sm:text-4xl md:text-6xl",
    heading: "text-xl sm:text-2xl md:text-3xl",
    body: "text-base sm:text-lg"
  }
};
```

---

## ♿ Accessibility Guidelines

### **Color Contrast**
```css
/* WCAG 2.1 AA compliance - minimum 4.5:1 contrast ratio */
:root {
  --contrast-primary: #0f172a;      /* 21:1 on white */
  --contrast-secondary: #334155;    /* 8.5:1 on white */
  --contrast-muted: #64748b;        /* 4.6:1 on white */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border: #000000;
    --foreground: #000000;
    --background: #ffffff;
  }
}
```

### **Focus Management**
```css
/* Visible focus indicators */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-vybe-cyan/50 focus:ring-offset-2;
}

/* Skip navigation for screen readers */
.skip-nav {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
         bg-vybe-cyan text-white px-4 py-2 rounded z-50;
}

/* High contrast mode indicators */
@media (prefers-contrast: high) {
  .focus-ring {
    @apply focus:ring-black focus:ring-4;
  }
}
```

### **Semantic HTML & ARIA**
```tsx
// Accessible component examples
export const LooproomPlayer = ({ looproom, isPlaying, onPlay, onPause }) => (
  <div 
    role="region" 
    aria-label={`${looproom.title} player`}
    className="relative"
  >
    <video
      ref={videoRef}
      aria-label={looproom.title}
      aria-describedby="looproom-description"
    >
      <track 
        kind="captions" 
        src={looproom.captionsUrl} 
        srcLang="en" 
        label="English captions" 
        default 
      />
    </video>
    
    <div id="looproom-description" className="sr-only">
      {looproom.description}
    </div>
    
    <button
      onClick={isPlaying ? onPause : onPlay}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="focus-ring"
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  </div>
);
```

---

## 🌙 Dark Mode Implementation

### **Theme Switching**
```tsx
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Respect user's system preference
    return localStorage.getItem('vybe-theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vybe-theme', theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme toggle component
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="focus-ring p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
```

---

## 📊 Design Tokens

### **Spacing System**
```css
:root {
  --space-px: 1px;
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### **Border Radius**
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius: 0.25rem;        /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-full: 9999px;    /* Fully rounded */
}
```

### **Shadow System**
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Special VYBE shadows with brand colors */
  --shadow-vybe: 0 4px 14px 0 rgb(6 182 212 / 0.15);
  --shadow-wellness: 0 4px 14px 0 rgb(16 185 129 / 0.15);
}
```

---

This design system ensures VYBE LOOPROOMS™ maintains a consistent, accessible, and emotionally supportive visual experience across all interfaces while supporting the platform's wellness-focused mission.
