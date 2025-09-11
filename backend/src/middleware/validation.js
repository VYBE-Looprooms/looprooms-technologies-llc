const { z } = require('zod');

/**
 * Validation schemas for authentication
 */
const schemas = {
  register: z.object({
    email: z.string()
      .email('Invalid email format')
      .min(1, 'Email is required')
      .max(255, 'Email too long'),
    
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username too long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
      .optional(),
    
    firstName: z.string()
      .min(1, 'First name is required')
      .max(50, 'First name too long')
      .optional(),
    
    lastName: z.string()
      .min(1, 'Last name is required')
      .max(50, 'Last name too long')
      .optional(),
    
    applyForCreator: z.boolean()
      .optional()
      .default(false)
  }),

  login: z.object({
    email: z.string()
      .email('Invalid email format')
      .min(1, 'Email is required'),
    
    password: z.string()
      .min(1, 'Password is required')
  }),

  forgotPassword: z.object({
    email: z.string()
      .email('Invalid email format')
      .min(1, 'Email is required')
  }),

  updateProfile: z.object({
    firstName: z.string().max(50, 'First name too long').optional(),
    lastName: z.string().max(50, 'Last name too long').optional(),
    displayName: z.string().max(100, 'Display name too long').optional(),
    bio: z.string().max(500, 'Bio too long').optional(),
    wellnessGoals: z.array(z.string()).max(10, 'Too many wellness goals').optional(),
    showStats: z.boolean().optional(),
    showProgress: z.boolean().optional(),
    allowDirectMessages: z.boolean().optional()
  })
};

/**
 * Generic validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }
      
      console.error('❌ Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        code: 'VALIDATION_ERROR'
      });
    }
  };
};

/**
 * Sanitize input data
 */
const sanitize = (req, res, next) => {
  // Trim string values and remove potential XSS
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }
      const sanitized = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  next();
};

module.exports = {
  schemas,
  validate,
  sanitize
};
