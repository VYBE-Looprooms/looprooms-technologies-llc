# VYBE LOOPROOMS™ - Complete Platform

> The World's First Emotional Tech Ecosystem

VYBE LOOPROOMS™ is a revolutionary platform that transforms digital wellbeing through immersive emotional technology experiences. This monorepo contains both the frontend application and backend API for a complete waitlist and email automation system.

![VYBE LOOPROOMS](./frontend/public/uploads/VybeLoopRoomFULL%20LOGO.png)

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ and Bun
- n8n instance (local or cloud)
- Google Sheets API access
- Gmail account with app password

### 1. Frontend Setup
```bash
cd frontend
bun install
bun dev
# Frontend runs on http://localhost:8080
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:3001
```

### 3. n8n Workflow
- Import workflow ID: `j3gjSX4Md1EXo3d5`
- Configure Google Sheets credentials
- Activate workflow

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   n8n Workflow  │    │   Backend API   │
│   (React)       │───▶│   (Automation)  │───▶│   (Email)       │
│   Port: 8080    │    │   Port: 5678    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        ▼                        ▼
        │              ┌─────────────────┐    ┌─────────────────┐
        │              │  Google Sheets  │    │   Gmail SMTP    │
        └──────────────│   (Storage)     │    │   (Email)       │
                       └─────────────────┘    └─────────────────┘
```

## 🌊 Complete User Flow

1. **User visits waitlist page** → Frontend form
2. **User submits form** → Data sent to n8n webhook
3. **n8n validates data** → JavaScript validation
4. **Data saved** → Google Sheets storage
5. **Email triggered** → Backend API call
6. **Welcome email sent** → Gmail SMTP delivery
7. **Success response** → User confirmation

## 📁 Project Structure

```
VYBE/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities & webhook integration
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── README.md           # Frontend documentation
├── backend/                 # Node.js Express backend
│   ├── services/           # Email service
│   ├── routes/             # API routes
│   ├── middleware/         # Validation & security
│   └── README.md           # Backend documentation
└── README.md               # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui components
- **GSAP** animations + React Router
- **Form handling** with validation

### Backend
- **Node.js** + Express + TypeScript
- **Nodemailer** with Gmail SMTP
- **Joi** validation + Rate limiting
- **Security** with Helmet + CORS

### Automation
- **n8n** workflow automation
- **Google Sheets** API integration
- **Webhook** triggers + JavaScript validation

## ⚙️ Configuration

### Environment Files

**Frontend (.env.local)**:
```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/vybe-waitlist
```

**Backend (.env)**:
```env
NODE_ENV=development
PORT=3001
GMAIL_USER=boussettah.dev@gmail.com
GMAIL_APP_PASSWORD=wrjf ebib tgoa khdi
FRONTEND_URL=http://localhost:8080
COMPANY_NAME="VYBE LOOPROOMS™"
COMPANY_WEBSITE=https://vybelooprooms.com
SUPPORT_EMAIL=support@vybelooprooms.com
```

### n8n Configuration
- **Webhook Path**: `vybe-waitlist`
- **Google Sheets ID**: `1688ybTP4B99bSYKAxGc_LVzxxzhJPekq4W90UPtXA4Y`
- **Backend URL**: `http://localhost:3001/api/email/send-welcome`

## 🚀 Development Workflow

### 1. Start All Services
```bash
# Terminal 1: Frontend
cd frontend && bun dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: n8n (if local)
npx n8n start
```

### 2. Test the Flow
1. Visit `http://localhost:8080/waitlist`
2. Fill out the form with valid data
3. Submit and check:
   - Google Sheets for new row
   - Email inbox for welcome email
   - n8n execution logs
   - Backend logs

### 3. Debugging
- **Frontend**: Browser dev tools + Vite logs
- **Backend**: Server logs + endpoint testing
- **n8n**: Workflow execution history
- **Email**: SMTP connection testing

## 📧 Email System Details

### Welcome Email Features
- 🎨 **Beautiful HTML design** with VYBE branding
- 📱 **Mobile-responsive** email template
- ✨ **Personalized content** with user's first name
- 🔗 **Company links** and contact information
- 📧 **Plain text fallback** for compatibility

### Email Content
- Welcome message with excitement
- Explanation of next steps
- Early access benefits
- Company branding and links
- Professional footer

### SMTP Configuration
- **Service**: Gmail SMTP
- **Security**: App password authentication
- **Encryption**: TLS/SSL support
- **Error Handling**: Comprehensive logging

## 🔐 Security Features

- **Input Validation**: Client + server + workflow validation
- **Rate Limiting**: 5 requests per 15 minutes per IP
- **CORS Protection**: Allowed origins configuration
- **Security Headers**: Helmet.js implementation
- **Email Security**: App password + TLS encryption

## 📊 Monitoring & Analytics

### Available Metrics
- Form submission success/failure rates
- Email delivery status
- Workflow execution times
- Error tracking and logging
- User conversion funnel

### Logging
- **Frontend**: Browser console + error boundaries
- **Backend**: Structured logging with timestamps
- **n8n**: Execution history + error details
- **Email**: Delivery confirmation + error handling

## 🎯 API Documentation

### Backend Endpoints

#### Send Welcome Email
```http
POST /api/email/send-welcome
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John"
}
```

#### Test Email Connection
```http
GET /api/email/test-connection
```

#### Health Checks
```http
GET /health                    # Backend health
GET /api/email/health         # Email service health
```

### n8n Webhook
```http
POST /webhook/vybe-waitlist
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "country": "United States"
}
```

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Various Options)
- **Railway**: `railway deploy`
- **Heroku**: `git push heroku main`
- **DigitalOcean**: Docker deployment
- **VPS**: PM2 + nginx configuration

### n8n Cloud
- Use n8n Cloud for production workflows
- Update webhook URLs to production domains
- Configure environment variables

### Environment Variables for Production
Update all URLs to production domains:
- Frontend: Update `VITE_N8N_WEBHOOK_URL`
- Backend: Update `FRONTEND_URL` for CORS
- n8n: Update backend API URL in HTTP Request node

## 🔧 Troubleshooting

### Common Issues

**Email not sending**:
1. Check Gmail app password
2. Verify SMTP connection: `GET /api/email/test-connection`
3. Check backend logs for errors

**Form submission fails**:
1. Check n8n workflow is active
2. Verify webhook URL in frontend
3. Check CORS configuration

**Data not saving to sheets**:
1. Verify Google Sheets credentials in n8n
2. Check sheet permissions
3. Review n8n execution logs

### Debug Commands
```bash
# Test backend email endpoint
curl -X POST http://localhost:3001/api/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test"}'

# Test n8n webhook
curl -X POST http://localhost:5678/webhook/vybe-waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User","country":"US"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test all components (frontend, backend, n8n)
5. Submit a pull request

## 📄 License

© 2025 VYBE LOOPROOMS TECHNOLOGIES LLC. All rights reserved.

## 🆘 Support

For support and questions:
- **Email**: support@vybelooprooms.com
- **Documentation**: See individual README files
- **Issues**: GitHub Issues

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Waitlist form with validation
- ✅ n8n workflow automation
- ✅ Google Sheets integration
- ✅ Welcome email system
- ✅ Beautiful UI/UX

### Phase 2 (Planned)
- [ ] User authentication system
- [ ] Dashboard for waitlist management
- [ ] Email campaign management
- [ ] Advanced analytics
- [ ] A/B testing capabilities

### Phase 3 (Future)
- [ ] Mobile app integration
- [ ] Real-time notifications
- [ ] CRM integration
- [ ] Advanced personalization
- [ ] Multi-language support

---

**Built with ❤️ by the VYBE LOOPROOMS team**

*Revolutionizing creativity and connection through emotional technology* 🌊
