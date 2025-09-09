// n8n Webhook Validation Code - Fixed Version
// Copy this code into your n8n "Validate Input" node

// Get the webhook data
const items = $input.all();
const webhookData = items[0].json;

// The data might be nested in different ways, so we check both
const body = webhookData.body || webhookData;

// Extract the actual data - handle both direct and nested structures
let email, firstName, lastName, country;

if (body.email) {
  // Direct structure
  email = body.email;
  firstName = body.firstName;
  lastName = body.lastName;
  country = body.country;
} else if (webhookData.email) {
  // Data is at webhook level
  email = webhookData.email;
  firstName = webhookData.firstName;
  lastName = webhookData.lastName;
  country = webhookData.country;
} else {
  throw new Error('No email field found in webhook data');
}

// Check required fields
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
  source: 'VYBE Website',
  status: 'Active'
};

// Debug: Log the cleaned data
console.log('Cleaned data:', JSON.stringify(cleanData, null, 2));

// return cleanData;
