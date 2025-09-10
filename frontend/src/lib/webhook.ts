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
    console.error('❌ Webhook submission error:', error);
    
    // Handle specific HTTP errors with better messages
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      // Handle 400 validation errors
      if (errorMessage.includes('400')) {
        return {
          success: false,
          message: 'Please check your input:\n• First and last names must be at least 2 characters\n• Please use a valid email address',
          error: 'Validation failed'
        };
      }
      
      // Handle other HTTP errors
      if (errorMessage.includes('status:')) {
        return {
          success: false,
          message: 'Unable to process your request. Please try again in a moment.',
          error: errorMessage
        };
      }
    }
    
    // Generic error fallback
    return {
      success: false,
      message: 'Unable to submit your request. Please check your connection and try again.',
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

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'This field is required' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Must be at least 2 characters long' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: 'Must not exceed 50 characters' };
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return { isValid: false, error: 'Can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

export const validateWaitlistForm = (data: WaitlistSubmission): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Validate first name
  const firstNameValidation = validateName(data.firstName);
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error!;
  }
  
  // Validate last name
  const lastNameValidation = validateName(data.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error!;
  }
  
  // Validate email
  if (!validateEmail(data.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
