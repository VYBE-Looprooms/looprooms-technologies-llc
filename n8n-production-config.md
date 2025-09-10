# n8n Production Configuration Guide

## 🎯 n8n HTTP Request Node Configuration

### Send Welcome Email Node Settings:
- **Method**: POST
- **URL**: https://api.feelyourvybe.com/api/email/send-welcome
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body** (JSON):
  ```json
  {
    "email": "{{ $json.email }}",
    "firstName": "{{ $json.firstName }}"
  }
  ```

## 📝 Updated Webhook Validation Code for n8n

Copy this code into your n8n "Validate Input" node:

```javascript
// n8n Webhook Validation Code - Production Version
const items = $input.all();
const webhookData = items[0].json;

// The data might be nested in different ways
const body = webhookData.body || webhookData;

// Extract the actual data
let email, firstName, lastName, country;

if (body.email) {
  email = body.email;
  firstName = body.firstName;
  lastName = body.lastName;
  country = body.country;
} else if (webhookData.email) {
  email = webhookData.email;
  firstName = webhookData.firstName;
  lastName = webhookData.lastName;
  country = webhookData.country;
} else {
  throw new Error('No email field found in webhook data');
}

// Validate required fields
if (!email || !firstName || !lastName) {
  throw new Error(`Missing required fields. email=${email}, firstName=${firstName}, lastName=${lastName}`);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Invalid email format');
}

// Clean and format data
const cleanData = {
  email: email.toLowerCase().trim(),
  firstName: firstName.trim(),
  lastName: lastName.trim(),
  fullName: `${firstName.trim()} ${lastName.trim()}`,
  country: country ? country.trim() : '',
  timestamp: new Date().toISOString(),
  source: 'VYBE Website Production',
  status: 'Active'
};

console.log('✅ Production data cleaned:', JSON.stringify(cleanData, null, 2));

return cleanData;
```

## 🔗 Production URLs:

- **Frontend**: https://feelyourvybe.com
- **Backend API**: https://api.feelyourvybe.com
- **n8n Webhook**: https://your-n8n-instance.com/webhook/vybe-waitlist
- **Email Service**: technical@feelyourvybe.com

## 📊 Google Sheets Integration:

Continue using your existing Google Sheets configuration:
- **Sheet ID**: 1688ybTP4B99bSYKAxGc_LVzxxzhJPekq4W90UPtXA4Y
- **Range**: Sheet1!A:F
- **Headers**: firstName, lastName, email, country, timestamp, source

## 🔄 Production Workflow Steps:

1. User submits waitlist form on https://feelyourvybe.com
2. Frontend sends data to n8n webhook
3. n8n validates and saves to Google Sheets
4. n8n calls backend API at https://api.feelyourvybe.com/api/email/send-welcome
5. Backend sends welcome email via technical@feelyourvybe.com
6. User receives welcome email

## ⚡ Testing Production Setup:

### Test Backend Health:
```bash
curl https://api.feelyourvybe.com/health
```

### Test Email Service:
```bash
curl https://api.feelyourvybe.com/api/email/test-connection
```

### Test Complete Flow:
Submit a test form on https://feelyourvybe.com/waitlist
