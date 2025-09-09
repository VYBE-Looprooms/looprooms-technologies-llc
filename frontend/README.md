# VYBE LOOPROOMS™ - Frontend

> The World's First Emotional Tech Ecosystem

VYBE LOOPROOMS™ is a revolutionary platform that transforms digital wellbeing through immersive emotional technology experiences. This repository contains the frontend application built with modern web technologies.

![VYBE LOOPROOMS](./public/uploads/VybeLoopRoomFULL%20LOGO.png)

## 🚀 Features

- **Modern React Stack**: Built with React 18, TypeScript, and Vite for optimal performance
- **Beautiful UI**: Designed with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Fully responsive across all devices
- **Dark/Light Mode**: Theme switching with next-themes
- **Smooth Animations**: GSAP-powered animations for enhanced user experience
- **Waitlist Integration**: n8n workflow automation with Google Sheets storage
- **Email Notifications**: Automated welcome emails via custom backend API
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: GSAP
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod validation
- **Automation**: n8n workflow integration + Node.js backend
- **Email Service**: Nodemailer with Google SMTP

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── uploads/           # Images and media
│   └── robots.txt
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   ├── useGSAP.ts
│   │   └── use-toast.ts
│   ├── lib/              # Utility functions
│   │   ├── utils.ts
│   │   └── webhook.ts    # n8n integration
│   ├── pages/            # Route components
│   │   ├── Index.tsx     # Landing page
│   │   ├── Waitlist.tsx  # Waitlist signup
│   │   ├── About.tsx
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 🎯 Key Pages

### Landing Page (`/`)
- Hero section with animated elements
- Featured Looprooms showcase
- How it works explanation
- Creator highlights
- Testimonials
- FAQ section

### Waitlist Page (`/waitlist`)
- Interactive signup form
- Real-time validation
- n8n webhook integration
- Success confirmation
- Benefits showcase

### About Page (`/about`)
- Company mission and vision
- Team information
- Technology overview

## 🔗 n8n Workflow Integration

The waitlist form is integrated with an n8n workflow that:

1. **Receives Data**: Webhook trigger captures form submissions
2. **Validates Input**: Ensures data quality and format
3. **Stores Data**: Saves to Google Sheets automatically
4. **Sends Response**: Confirms successful submission

### Workflow Configuration

**Webhook URL**: `http://localhost:5678/webhook-test/vybe-waitlist`
**Method**: POST
**Expected Data**:
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "user@example.com",
  "country": "US" // optional
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- n8n instance (for waitlist functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VYBE-Looprooms/looprooms-technologies-llc.git
   cd looprooms-technologies-llc/frontend
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended)
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/vybe-waitlist
   ```

4. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using bun
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🔧 n8n Setup

### Prerequisites

1. **Install n8n**
   ```bash
   npm install n8n -g
   ```

2. **Start n8n**
   ```bash
   n8n start
   ```

3. **Access n8n interface**
   Open `http://localhost:5678`

### Workflow Setup

1. **Import the workflow** (ID: `j3gjSX4Md1EXo3d5`)
2. **Configure Google Sheets**:
   - Add Google Sheets credentials
   - Replace `YOUR_GOOGLE_SHEETS_ID_HERE` with your sheet ID
   - Ensure sheet has headers: Timestamp, Email, Name, Company, Interest, Source, Status
3. **Activate the workflow**

### Google Sheets Setup

Create a new Google Sheet with these columns:
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Email | First Name | Last Name | Full Name | Country | Source | Status |

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Colors
- **Primary**: Cyan (#00FFFF)
- **Secondary**: Purple (#8B5CF6)
- **Accent**: Pink (#EC4899)
- **Background**: Dark theme optimized

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable fonts
- **CTAs**: Prominent button styling

### Components
All UI components are built with shadcn/ui for consistency:
- Buttons, inputs, cards
- Modals, tooltips, dropdowns
- Navigation, breadcrumbs
- Form elements

## 🚀 Deployment

### Build for Production

```bash
# Create production build
bun run build

# Preview production build
bun run preview
```

### Environment Variables for Production

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/vybe-waitlist
```

## 📧 Email System

The project includes a complete email notification system:

### Backend API
- **Node.js + Express** backend at `http://localhost:3001`
- **Gmail SMTP** integration for sending emails
- **Beautiful HTML emails** with VYBE branding
- **Error handling** and logging

### Email Flow
1. User submits waitlist form
2. n8n workflow validates and saves to Google Sheets
3. n8n calls backend API to send welcome email
4. User receives beautiful welcome email immediately

### Backend Features
- ✅ Welcome email templates (HTML + text)
- ✅ Google SMTP integration
- ✅ Input validation with Joi
- ✅ Rate limiting and security
- ✅ CORS protection
- ✅ Comprehensive error handling

### Backend Endpoints
- `POST /api/email/send-welcome` - Send welcome email
- `GET /api/email/test-connection` - Test SMTP connection
- `GET /health` - Backend health check

See `backend/README.md` for complete backend documentation.

### Vercel Deployment

The project includes `vercel.json` for easy Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📊 Analytics & Monitoring

- Form submission tracking
- Error monitoring via console
- Performance metrics with Vite

## 🔒 Security

- Input validation on client and server
- HTTPS enforcement in production
- CORS protection
- Rate limiting (via n8n)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

© 2025 VYBE LOOPROOMS TECHNOLOGIES LLC. All rights reserved.

## 🆘 Support

For support and questions:
- Email: support@vybelooprooms.com
- Documentation: [Coming Soon]
- Issues: GitHub Issues

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Dashboard integration
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app companion
- [ ] API documentation

---

**Built with ❤️ by the VYBE LOOPROOMS team**