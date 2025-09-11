# VYBE LOOPROOMS™ Backend API

A Node.js Express backend service for handling email notifications and waitlist management for the VYBE LOOPROOMS™ platform.

## Features

- 📧 **Email Service**: Send beautiful welcome emails using Google SMTP
- 🔒 **Security**: Rate limiting, CORS protection, and input validation
- ✅ **Validation**: Comprehensive data validation using Joi
- 🎨 **HTML Emails**: Rich HTML email templates with responsive design
- 🚀 **Performance**: Optimized for fast response times
- 📊 **Logging**: Detailed request and error logging
- 🌐 **CORS**: Configured for frontend integration

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Email**: Nodemailer with Gmail SMTP
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi
- **Environment**: dotenv

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   - Copy `.env.example` to `.env` (already configured)
   - Update environment variables if needed

4. **Start the server**:
   ```bash
   # Development (with auto-restart)
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:3001`

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Email Configuration (Google SMTP)
GMAIL_USER=boussettah.dev@gmail.com
GMAIL_APP_PASSWORD=wrjf ebib tgoa khdi

# CORS Configuration
FRONTEND_URL=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Email Templates
COMPANY_NAME="VYBE LOOPROOMS™"
COMPANY_WEBSITE=https://feelyourvybe.com
SUPPORT_EMAIL=technical@feelyourvybe.com
```

## API Endpoints

### Root & Health
- `GET /` - API documentation and available endpoints
- `GET /health` - Backend health check

### Email Service
- `POST /api/email/send-welcome` - Send welcome email to new waitlist member
- `GET /api/email/test-connection` - Test Gmail SMTP connection
- `GET /api/email/health` - Email service health check

### Webhook Service
- `POST /api/webhook/n8n-proxy` - Proxy webhook submissions to n8n
- `GET /api/webhook/health` - Webhook service health check

## Validation Rules

### Waitlist Submission
- **First Name**: Required, 2-50 characters, letters/spaces/hyphens/apostrophes only
- **Last Name**: Required, 2-50 characters, letters/spaces/hyphens/apostrophes only  
- **Email**: Required, valid email format
- **Country**: Optional, max 100 characters

### Email Request
- **First Name**: Required, 2-50 characters
- **Email**: Required, valid email format

## API Usage Examples

### Send Welcome Email

```bash
curl -X POST http://localhost:3001/api/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "firstName": "John"
  }'
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "firstName": "John"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "data": {
    "messageId": "<unique-message-id>",
    "recipient": "user@example.com",
    "firstName": "John"
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Test Email Connection

```bash
curl http://localhost:3001/api/email/test-connection
```

**Response**:
```json
{
  "success": true,
  "message": "Email service connection successful"
}
```

## Email Template

The welcome email includes:
- 🎨 **Beautiful HTML design** with responsive layout
- 🌊 **VYBE LOOPROOMS™ branding** and styling
- 📱 **Mobile-friendly** design
- 🎯 **Personalized content** with user's first name
- 🔗 **Company links** and social media
- 📧 **Plain text fallback** for compatibility

## Security Features

- **Rate Limiting**: 5 requests per 15-minute window per IP
- **CORS Protection**: Only allows configured frontend origins
- **Input Validation**: Comprehensive validation using Joi
- **Helmet Security**: Security headers and protections
- **Environment Separation**: Different configurations for dev/prod

## Integration with n8n Workflow

The backend is designed to work seamlessly with your n8n workflow:

1. **n8n workflow** receives waitlist submission
2. **n8n workflow** processes and stores data
3. **n8n workflow** calls backend API to send welcome email
4. **Backend** sends beautiful welcome email to new subscriber

### n8n HTTP Request Node Configuration

Add an HTTP Request node to your n8n workflow with:

- **Method**: POST
- **URL**: `http://localhost:3001/api/email/send-welcome`
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body**:
  ```json
  {
    "email": "{{ $json.email }}",
    "firstName": "{{ $json.firstName }}"
  }
  ```

## Error Handling

The API provides comprehensive error handling:

- **Validation Errors**: Detailed field-level validation messages
- **Email Errors**: SMTP connection and sending error details
- **Rate Limiting**: Clear rate limit exceeded messages
- **CORS Errors**: Origin not allowed messages
- **500 Errors**: Internal server error handling

## Development

### Project Structure
```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration
├── services/
│   └── emailService.js    # Email service class
├── routes/
│   └── email.js          # Email API routes
├── middleware/
│   └── validation.js     # Joi validation schemas
└── README.md             # This file
```

### Adding New Features

1. **New Service**: Add to `services/` directory
2. **New Routes**: Add to `routes/` directory
3. **New Validation**: Add schemas to `middleware/validation.js`
4. **Update Server**: Import and use in `server.js`

## Deployment

### Local Deployment
1. Ensure Node.js 16+ is installed
2. Set environment variables
3. Run `npm install`
4. Run `npm start`

### Production Deployment
1. Set `NODE_ENV=production`
2. Use process manager like PM2
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure firewall rules

## Troubleshooting

### Email Not Sending
1. Check Gmail app password is correct
2. Verify Gmail account has 2FA enabled
3. Test connection endpoint: `GET /api/email/test-connection`
4. Check server logs for detailed error messages

### CORS Issues
1. Verify frontend URL in `.env` file
2. Check browser console for CORS errors
3. Ensure frontend makes requests to correct backend port

### Rate Limiting
1. Default: 5 requests per 15 minutes per IP
2. Adjust `RATE_LIMIT_*` environment variables
3. Consider implementing user-based rate limiting for production

## Support

For support and questions:
- **Email**: technical@feelyourvybe.com
- **Documentation**: See main project README
- **Issues**: Create GitHub issue in main repository

---

**VYBE LOOPROOMS™** - Revolutionizing creativity and connection 🌊
