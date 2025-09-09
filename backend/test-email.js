// Test script for email API
const testEmail = async () => {
  const response = await fetch('http://127.0.0.1:3001/api/email/send-welcome', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'boussettahsallah@gmail.com',
      firstName: 'Test'
    })
  });

  const result = await response.json();
  console.log('Response:', result);
};

testEmail().catch(console.error);
