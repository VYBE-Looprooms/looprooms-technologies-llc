# VYBE LOOPROOMS™ - Technical Architecture

> **Version**: 1.0  
> **Date**: September 11, 2025  
> **Environment**: Development Phase  

## 🏗️ System Architecture Overview

VYBE LOOPROOMS™ follows a modern **microservices-inspired monolithic architecture** with clear separation of concerns, optimized for rapid development while maintaining scalability for future growth.

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web App<br/>React + TypeScript]
        MOBILE[Mobile App<br/>React Native]
    end
    
    subgraph "CDN & Static Assets"
        CDN[CloudFlare CDN]
        MEDIA[Media Storage<br/>AWS S3/Cloudinary]
    end
    
    subgraph "API Gateway & Load Balancer"
        LB[Load Balancer<br/>Nginx]
        GATEWAY[API Gateway<br/>Rate Limiting]
    end
    
    subgraph "Application Layer"
        API[VYBE API Server<br/>Node.js + Express]
        AUTH[Auth Service<br/>JWT + OAuth]
        SOCIAL[Social Feed Service]
        CONTENT[Content Service]
        PAYMENT[Payment Service<br/>Stripe]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Primary Database)]
        REDIS[(Redis<br/>Cache + Sessions)]
        SEARCH[Elasticsearch<br/>Search + Analytics]
    end
    
    subgraph "External Services"
        STRIPE[Stripe<br/>Payments]
        OAUTH[OAuth Providers<br/>Google, Apple]
        EMAIL[Email Service<br/>SendGrid/Gmail]
        PUSH[Push Notifications<br/>Firebase]
    end
    
    WEB --> CDN
    MOBILE --> CDN
    CDN --> LB
    LB --> GATEWAY
    GATEWAY --> API
    
    API --> AUTH
    API --> SOCIAL
    API --> CONTENT
    API --> PAYMENT
    
    API --> DB
    API --> REDIS
    API --> SEARCH
    
    PAYMENT --> STRIPE
    AUTH --> OAUTH
    API --> EMAIL
    MOBILE --> PUSH
    
    CONTENT --> MEDIA
```

---

## 🔧 Technology Stack

### **Frontend**
```yaml
Framework: React 18 + TypeScript
Build Tool: Vite with SWC
UI Library: Tailwind CSS + shadcn/ui
State Management: 
  - React Query (server state)
  - Zustand (client state)
  - React Context (auth state)
Routing: React Router v6
Animations: GSAP + Framer Motion
Testing: Vitest + React Testing Library
```

### **Backend**
```yaml
Runtime: Node.js 18+
Framework: Express.js + TypeScript
Database ORM: Prisma
Authentication: JWT + Passport.js
Validation: Zod + express-validator
File Upload: Multer + Sharp (image processing)
Rate Limiting: express-rate-limit
Security: Helmet + CORS
Documentation: Swagger/OpenAPI
Testing: Jest + Supertest
```

### **Database & Storage**
```yaml
Primary Database: PostgreSQL 14+
Cache & Sessions: Redis 7+
Search Engine: Elasticsearch 8+ (future)
File Storage: AWS S3 / Cloudinary
CDN: CloudFlare
```

### **DevOps & Infrastructure**
```yaml
Production API: Oracle Cloud VPS
Frontend Hosting: Vercel
Domain Management: Cloudflare
CI/CD: GitHub Actions
Monitoring: Sentry + Datadog
Logging: Winston + ELK Stack
Backup: Automated PostgreSQL backups
```

---

## 📊 Database Architecture

### **Connection Strategy**
```typescript
// Prisma connection with pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'error', 'warn'],
})

// Connection pooling configuration
DATABASE_URL="postgresql://user:pass@host:5432/vybe_db?connection_limit=20&pool_timeout=20"
```

### **Performance Optimizations**
```sql
-- Critical indexes for performance
CREATE INDEX CONCURRENTLY idx_users_active_last_active ON users(is_active, last_active_at DESC);
CREATE INDEX CONCURRENTLY idx_looprooms_discovery ON looprooms(status, category_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_shared_vybes_feed ON shared_vybes(privacy_level, created_at DESC) WHERE privacy_level IN ('PUBLIC', 'FRIENDS_ONLY');
CREATE INDEX CONCURRENTLY idx_reactions_aggregation ON reactions(reactable_type, reactable_id, type);

-- Search optimization
CREATE INDEX CONCURRENTLY idx_looprooms_search ON looprooms USING gin(to_tsvector('english', title || ' ' || description));
```

### **Data Partitioning Strategy**
```sql
-- Partition analytics tables by date for performance
CREATE TABLE content_analytics_2025 PARTITION OF content_analytics
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Archive old social feed data
CREATE TABLE shared_vybes_archive AS 
SELECT * FROM shared_vybes WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## 🔐 Security Architecture

### **Authentication Flow**
```typescript
// JWT token structure
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  iat: number;
  exp: number;
}

// OAuth integration
const oauthStrategies = {
  google: new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }),
  apple: new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    callbackURL: "/auth/apple/callback",
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: process.env.APPLE_PRIVATE_KEY
  })
};
```

### **Data Protection**
```typescript
// Sensitive data encryption
import crypto from 'crypto';

class DataEncryption {
  private key = process.env.ENCRYPTION_KEY;
  
  encrypt(data: string): string {
    const cipher = crypto.createCipher('aes-256-gcm', this.key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  decrypt(encryptedData: string): string {
    const decipher = crypto.createDecipher('aes-256-gcm', this.key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

### **API Security Middleware**
```typescript
// Comprehensive security setup
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting by user role
const createRateLimit = (windowMs: number, max: number) => 
  rateLimit({
    windowMs,
    max: (req) => {
      const user = req.user;
      if (user?.role === 'ADMIN') return max * 10;
      if (user?.subscriptionTier?.includes('PREMIUM')) return max * 2;
      return max;
    },
    message: { error: 'Rate limit exceeded' }
  });
```

---

## ⚡ Performance Architecture

### **Caching Strategy**
```typescript
// Multi-layer caching
class CacheManager {
  private redis = new Redis(process.env.REDIS_URL);
  
  // Cache user sessions
  async getUserSession(userId: string) {
    const cached = await this.redis.get(`session:${userId}`);
    if (cached) return JSON.parse(cached);
    return null;
  }
  
  // Cache popular content
  async getPopularLooprooms(category?: string) {
    const key = `popular:looprooms:${category || 'all'}`;
    const cached = await this.redis.get(key);
    
    if (cached) return JSON.parse(cached);
    
    // Fetch from database and cache for 1 hour
    const looprooms = await prisma.looproom.findMany({
      where: { categoryId: category },
      orderBy: { viewCount: 'desc' },
      take: 20
    });
    
    await this.redis.setex(key, 3600, JSON.stringify(looprooms));
    return looprooms;
  }
  
  // Cache social feed
  async getFeedCache(userId: string, cursor?: string) {
    const key = `feed:${userId}:${cursor || 'latest'}`;
    return this.redis.get(key);
  }
}
```

### **Database Query Optimization**
```typescript
// Optimized queries with Prisma
class LooproomService {
  async getDiscoveryFeed(userId: string, options: FeedOptions) {
    return prisma.looproom.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { isPremium: false },
          { 
            isPremium: true,
            AND: {
              user: {
                subscription: {
                  status: 'ACTIVE',
                  tier: { in: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY'] }
                }
              }
            }
          }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            profile: {
              select: { displayName: true, avatarUrl: true }
            }
          }
        },
        category: true,
        tags: { include: { tag: true } },
        _count: {
          select: {
            reactions: true,
            looplistItems: true
          }
        }
      },
      orderBy: [
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: options.limit,
      cursor: options.cursor ? { id: options.cursor } : undefined
    });
  }
}
```

---

## 🔄 Real-time Features

### **WebSocket Implementation**
```typescript
// Socket.IO for real-time features
import { Server } from 'socket.io';

class RealtimeService {
  private io: Server;
  
  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      }
    });
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      // Join user-specific room for notifications
      socket.on('join:user', (userId) => {
        socket.join(`user:${userId}`);
      });
      
      // Join Looproom for real-time engagement
      socket.on('join:looproom', (looproomId) => {
        socket.join(`looproom:${looproomId}`);
      });
      
      // Handle real-time reactions
      socket.on('reaction:add', async (data) => {
        const reaction = await this.addReaction(data);
        this.io.to(`looproom:${data.looproomId}`)
             .emit('reaction:added', reaction);
      });
    });
  }
  
  // Broadcast new social feed posts
  broadcastNewVybe(vybe: SharedVybe) {
    this.io.emit('vybe:new', vybe);
  }
  
  // Send real-time notifications
  sendNotification(userId: string, notification: Notification) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }
}
```

---

## 📱 Mobile Architecture (Future)

### **React Native Setup**
```typescript
// Shared code between web and mobile
// Using metro-config for monorepo support

// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add shared packages
config.watchFolders = [
  path.resolve(__dirname, '../shared'),
  path.resolve(__dirname, '../frontend/src/lib')
];

// Resolve shared modules
config.resolver.alias = {
  '@shared': path.resolve(__dirname, '../shared'),
  '@lib': path.resolve(__dirname, '../frontend/src/lib')
};

module.exports = config;
```

---

## 🚀 Deployment Architecture

### **CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy VYBE Platform

on:
  push:
    branches: [main, development]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd frontend && npm run test
          cd ../backend && npm run test
      
      - name: Run linting
        run: |
          cd frontend && npm run lint
          cd ../backend && npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Oracle Cloud
        run: |
          # SSH into Oracle Cloud VPS and deploy
          ssh -i ${{ secrets.ORACLE_SSH_KEY }} user@api.feelyourvybe.com << 'EOF'
            cd /app/vybe-backend
            git pull origin main
            npm ci --production
            npm run build
            pm2 restart vybe-api
          EOF
```

### **Environment Configuration**
```bash
# Production environment variables
# Backend (.env.production)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@oracle-db:5432/vybe_prod
REDIS_URL=redis://oracle-redis:6379
JWT_SECRET=ultra-secure-production-secret
ENCRYPTION_KEY=32-byte-encryption-key
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://feelyourvybe.com

# Frontend (.env.production)
VITE_API_URL=https://api.feelyourvybe.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_GOOGLE_CLIENT_ID=google-oauth-client-id
VITE_APPLE_CLIENT_ID=apple-oauth-client-id
VITE_ENABLE_WAITLIST=false
VITE_APP_MODE=production
```

---

## 📊 Monitoring & Observability

### **Application Monitoring**
```typescript
// Sentry error tracking
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error?.message?.includes('AbortError')) {
        return null;
      }
    }
    return event;
  }
});

// Custom metrics tracking
class MetricsService {
  private client = new StatsDClient({
    host: process.env.STATSD_HOST,
    port: 8125
  });
  
  trackUserAction(action: string, userId: string) {
    this.client.increment(`user.action.${action}`, 1, [`user:${userId}`]);
  }
  
  trackPerformance(operation: string, duration: number) {
    this.client.timing(`performance.${operation}`, duration);
  }
  
  trackBusinessMetric(metric: string, value: number) {
    this.client.gauge(`business.${metric}`, value);
  }
}
```

### **Health Checks**
```typescript
// Comprehensive health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    services: {
      database: 'healthy',
      redis: 'healthy',
      stripe: 'healthy'
    }
  };
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test Redis connection
    await redis.ping();
    
    // Test Stripe connection
    await stripe.customers.list({ limit: 1 });
    
  } catch (error) {
    health.status = 'unhealthy';
    health.services = {
      database: 'error',
      redis: 'error',
      stripe: 'error'
    };
    
    return res.status(503).json(health);
  }
  
  res.json(health);
});
```

---

## 🔮 Scalability Considerations

### **Horizontal Scaling Strategy**
```yaml
# Future microservices breakdown
Services:
  - User Service: Authentication, profiles, preferences
  - Content Service: Looprooms, Loopchains, categories
  - Social Service: Shared VYBES, reactions, comments
  - Analytics Service: User progress, engagement metrics
  - Payment Service: Subscriptions, creator payouts
  - Notification Service: Real-time notifications, emails

Database Sharding:
  - Users: Shard by user_id hash
  - Content: Shard by category or creator
  - Social Feed: Shard by date + user location
  - Analytics: Time-series partitioning
```

### **Performance Targets**
```yaml
Response Times:
  - API endpoints: <200ms (p95)
  - Database queries: <50ms (p95)
  - Page load times: <2s (p95)
  - Real-time features: <100ms latency

Throughput:
  - Concurrent users: 10,000+
  - API requests: 1,000 RPS
  - Database connections: 100+ concurrent
  - File uploads: 100MB+ files supported

Availability:
  - Uptime target: 99.9%
  - Disaster recovery: <1 hour RTO
  - Data backup: Real-time replication
  - Monitoring: 24/7 alerting
```

---

This technical architecture provides a robust foundation for VYBE LOOPROOMS™ while maintaining flexibility for future growth and feature additions. The design prioritizes developer experience, user performance, and operational reliability.
