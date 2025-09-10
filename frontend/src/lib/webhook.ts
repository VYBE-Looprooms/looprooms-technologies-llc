// Utility functions for n8n webhook integration

export interface WaitlistSubmission {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    timestamp: string;
  };
  error?: string;
}

export const submitToWaitlist = async (data: WaitlistSubmission): Promise<WebhookResponse> => {
  // Use backend proxy for webhook submissions to avoid CORS issues
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const webhookUrl = `${apiUrl}/api/webhook/n8n-proxy`;
  
  try {
    console.log('🔄 Submitting to backend webhook proxy:', webhookUrl);
    console.log('📊 Submission data:', data);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim()) {
        result = JSON.parse(text);
      } else {
        // Empty response, create success response
        result = {
          success: true,
          message: 'Successfully submitted to waitlist!',
          data: {
            email: data.email,
            timestamp: new Date().toISOString()
          }
        };
      }
    } else {
      // Non-JSON response, assume success if status is ok
      result = {
        success: true,
        message: 'Successfully submitted to waitlist!',
        data: {
          email: data.email,
          timestamp: new Date().toISOString()
        }
      };
    }

    return result;
  } catch (error) {
    console.error('Webhook submission error:', error);
    
    // Return a standardized error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
