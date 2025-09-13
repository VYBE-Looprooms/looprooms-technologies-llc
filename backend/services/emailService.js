const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service configuration error:', error);
        } else {
          console.log('✅ Email service is ready to send messages');
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
    }
  }

  generateWelcomeEmailHTML(firstName) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to VYBE LOOPROOMS™</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.7;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 25px rgba(0,0,0,0.08);
                border: 1px solid #e2e8f0;
            }
            .header {
                text-align: center;
                margin-bottom: 35px;
                padding-bottom: 25px;
                border-bottom: 2px solid #f1f5f9;
            }
            .logo {
                font-size: 32px;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 15px;
                letter-spacing: -0.5px;
            }
            .welcome-message {
                font-size: 20px;
                color: #475569;
                margin-bottom: 0;
                font-weight: 500;
            }
            .content {
                margin-bottom: 35px;
                font-size: 16px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #1e293b;
            }
            .highlight-box {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 25px;
                border-radius: 10px;
                margin: 25px 0;
                text-align: center;
            }
            .highlight-box h3 {
                margin: 0 0 10px 0;
                font-size: 20px;
                font-weight: 600;
            }
            .highlight-box p {
                margin: 0;
                font-size: 15px;
                opacity: 0.95;
            }
            .benefits {
                background: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
                margin: 25px 0;
            }
            .benefits h4 {
                margin: 0 0 15px 0;
                color: #1e293b;
                font-size: 18px;
                font-weight: 600;
            }
            .benefits ul {
                margin: 0;
                padding-left: 20px;
            }
            .benefits li {
                margin-bottom: 8px;
                color: #475569;
                line-height: 1.6;
            }
            .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
            }
            .signature-name {
                font-weight: 600;
                color: #1e293b;
                margin-top: 5px;
            }
            .footer {
                text-align: center;
                padding-top: 30px;
                border-top: 2px solid #f1f5f9;
                color: #64748b;
                font-size: 14px;
            }
            .footer-links {
                margin: 20px 0;
            }
            .footer-links a {
                color: #3b82f6;
                text-decoration: none;
                margin: 0 15px;
                font-weight: 500;
            }
            .footer-links a:hover {
                text-decoration: underline;
            }
            .disclaimer {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 20px;
                line-height: 1.5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VYBE LOOPROOMS™</div>
                <h1 class="welcome-message">Welcome to the Future of Creative Collaboration</h1>
            </div>
            
            <div class="content">
                <p class="greeting">Hello ${firstName},</p>
                
                <p>Thank you for joining our exclusive waitlist. We're excited to welcome you to the VYBE LOOPROOMS™ community as we prepare to revolutionize the way creators connect and collaborate.</p>
                
                <div class="highlight-box">
                    <h3>Your Waitlist Registration is Confirmed</h3>
                    <p>You're now positioned for priority access to VYBE LOOPROOMS™ when we officially launch.</p>
                </div>
                
                <div class="benefits">
                    <h4>What You Can Expect:</h4>
                    <ul>
                        <li><strong>Priority Access:</strong> Be among the first to experience our platform when it launches</li>
                        <li><strong>Exclusive Updates:</strong> Receive insider previews and development progress updates</li>
                        <li><strong>Early Adopter Benefits:</strong> Special launch bonuses and premium features for waitlist members</li>
                        <li><strong>Community Access:</strong> Join our exclusive community of early supporters and beta testers</li>
                    </ul>
                </div>
                
                <p>We're working diligently to create something truly innovative that will transform how creators collaborate, share ideas, and build meaningful connections. Your early interest and support are invaluable to us.</p>
                
                <p>We'll keep you informed with important updates as we approach our launch date. Thank you for being part of this exciting journey.</p>
                
                <div class="signature">
                    <p>Best regards,</p>
                    <p class="signature-name">The VYBE LOOPROOMS™ Team</p>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-links">
                    <a href="https://feelyourvybe.com">Visit Our Website</a>
                    <a href="mailto:${process.env.SUPPORT_EMAIL || 'technical@feelyourvybe.com'}">Contact Support</a>
                </div>
                <p>&copy; 2025 ${process.env.COMPANY_NAME || 'VYBE LOOPROOMS™'}. All rights reserved.</p>
                <div class="disclaimer">
                    You received this email because you signed up for our waitlist at feelyourvybe.com. 
                    If you believe this was sent in error, please contact our support team.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateWelcomeEmailText(firstName) {
    return `
Welcome to VYBE LOOPROOMS™

Hello ${firstName},

Thank you for joining our exclusive waitlist. We're excited to welcome you to the VYBE LOOPROOMS™ community as we prepare to revolutionize the way creators connect and collaborate.

YOUR WAITLIST REGISTRATION IS CONFIRMED

You're now positioned for priority access to VYBE LOOPROOMS™ when we officially launch.

WHAT YOU CAN EXPECT:

• Priority Access: Be among the first to experience our platform when it launches
• Exclusive Updates: Receive insider previews and development progress updates  
• Early Adopter Benefits: Special launch bonuses and premium features for waitlist members
• Community Access: Join our exclusive community of early supporters and beta testers

We're working diligently to create something truly innovative that will transform how creators collaborate, share ideas, and build meaningful connections. Your early interest and support are invaluable to us.

We'll keep you informed with important updates as we approach our launch date. Thank you for being part of this exciting journey.

Best regards,
The VYBE LOOPROOMS™ Team

---
© 2025 ${process.env.COMPANY_NAME || 'VYBE LOOPROOMS™'}. All rights reserved.
Website: https://feelyourvybe.com
Support: ${process.env.SUPPORT_EMAIL || 'technical@feelyourvybe.com'}

You received this email because you signed up for our waitlist at feelyourvybe.com. 
If you believe this was sent in error, please contact our support team.
    `;
  }

  generateRegistrationEmailHTML(firstName, isCreatorApplication = false) {
    const creatorSection = isCreatorApplication ? `
      <div class="highlight-box" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
        <h3>Creator Application Submitted ❤️</h3>
        <p>Your creator application is pending review. You'll receive next steps for identity verification within 24 hours.</p>
      </div>
      
      <div class="benefits">
        <h4>Creator Application Next Steps:</h4>
        <ul>
          <li><strong>Identity Verification:</strong> Upload ID/Passport and complete face verification</li>
          <li><strong>Profile Setup:</strong> Complete your creator profile with experience and specialization</li>
          <li><strong>Review Process:</strong> Our team will review your application within 2-3 business days</li>
          <li><strong>Onboarding:</strong> Once approved, get access to creator tools and monetization</li>
        </ul>
      </div>` : '';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to VYBE LOOPROOMS™</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.7;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 25px rgba(0,0,0,0.08);
                border: 1px solid #e2e8f0;
            }
            .header {
                text-align: center;
                margin-bottom: 35px;
                padding-bottom: 25px;
                border-bottom: 2px solid #f1f5f9;
            }
            .logo {
                font-size: 32px;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 15px;
                letter-spacing: -0.5px;
            }
            .welcome-message {
                font-size: 20px;
                color: #475569;
                margin-bottom: 0;
                font-weight: 500;
            }
            .content {
                margin-bottom: 35px;
                font-size: 16px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #1e293b;
            }
            .highlight-box {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 25px;
                border-radius: 10px;
                margin: 25px 0;
                text-align: center;
            }
            .highlight-box h3 {
                margin: 0 0 10px 0;
                font-size: 20px;
                font-weight: 600;
            }
            .highlight-box p {
                margin: 0;
                font-size: 15px;
                opacity: 0.95;
            }
            .benefits {
                background: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
                margin: 25px 0;
            }
            .benefits h4 {
                margin: 0 0 15px 0;
                color: #1e293b;
                font-size: 18px;
                font-weight: 600;
            }
            .benefits ul {
                margin: 0;
                padding-left: 20px;
            }
            .benefits li {
                margin-bottom: 8px;
                color: #475569;
                line-height: 1.6;
            }
            .action-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                text-align: center;
            }
            .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
            }
            .signature-name {
                font-weight: 600;
                color: #1e293b;
                margin-top: 5px;
            }
            .footer {
                text-align: center;
                padding-top: 30px;
                border-top: 2px solid #f1f5f9;
                color: #64748b;
                font-size: 14px;
            }
            .footer-links {
                margin: 20px 0;
            }
            .footer-links a {
                color: #3b82f6;
                text-decoration: none;
                margin: 0 15px;
                font-weight: 500;
            }
            .footer-links a:hover {
                text-decoration: underline;
            }
            .disclaimer {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 20px;
                line-height: 1.5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VYBE LOOPROOMS™</div>
                <h1 class="welcome-message">${isCreatorApplication ? 'Welcome to the Creator Community!' : 'Welcome to Your Wellness Journey!'}</h1>
            </div>
            
            <div class="content">
                <p class="greeting">Hello ${firstName},</p>
                
                <p>Thank you for creating your account with VYBE LOOPROOMS™! We're thrilled to welcome you to our emotional tech ecosystem where Recovery, Fitness, and Meditation unite through innovative Loopchains™.</p>
                
                <div class="highlight-box">
                    <h3>Your Account is Active ✨</h3>
                    <p>You now have access to our three core Looprooms and can start your wellness journey immediately.</p>
                </div>

                ${creatorSection}
                
                <div class="benefits">
                    <h4>Your VYBE Journey Includes:</h4>
                    <ul>
                        <li><strong>Recovery Looproom:</strong> Healing spaces for emotional recovery and personal growth</li>
                        <li><strong>Fitness Looproom:</strong> Energizing workouts and movement therapy</li>
                        <li><strong>Meditation Looproom:</strong> Mindful journeys and breathing exercises</li>
                        <li><strong>14-Day Free Trial:</strong> Explore all premium features risk-free</li>
                        <li><strong>Community Connection:</strong> Connect with like-minded wellness enthusiasts</li>
                    </ul>
                </div>
                
                <p style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" class="action-button">
                        Start Your Journey →
                    </a>
                </p>
                
                <p>Your wellness transformation begins now. Explore the three core Looprooms, connect with our community, and experience the future of emotional technology.</p>
                
                <div class="signature">
                    <p>Welcome to the future,</p>
                    <p class="signature-name">The VYBE LOOPROOMS™ Team</p>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-links">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}">Login to Platform</a>
                    <a href="mailto:${process.env.SUPPORT_EMAIL || 'technical@feelyourvybe.com'}">Contact Support</a>
                </div>
                <p>&copy; 2025 ${process.env.COMPANY_NAME || 'VYBE LOOPROOMS™'}. All rights reserved.</p>
                <div class="disclaimer">
                    You received this email because you created an account at feelyourvybe.com. 
                    If you believe this was sent in error, please contact our support team.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  generateRegistrationEmailText(firstName, isCreatorApplication = false) {
    const creatorSection = isCreatorApplication ? `

CREATOR APPLICATION SUBMITTED ❤️

Your creator application is pending review. You'll receive next steps for identity verification within 24 hours.

CREATOR APPLICATION NEXT STEPS:

• Identity Verification: Upload ID/Passport and complete face verification
• Profile Setup: Complete your creator profile with experience and specialization  
• Review Process: Our team will review your application within 2-3 business days
• Onboarding: Once approved, get access to creator tools and monetization

` : '';

    return `
Welcome to VYBE LOOPROOMS™

Hello ${firstName},

Thank you for creating your account with VYBE LOOPROOMS™! We're thrilled to welcome you to our emotional tech ecosystem where Recovery, Fitness, and Meditation unite through innovative Loopchains™.

YOUR ACCOUNT IS ACTIVE ✨

You now have access to our three core Looprooms and can start your wellness journey immediately.
${creatorSection}
YOUR VYBE JOURNEY INCLUDES:

• Recovery Looproom: Healing spaces for emotional recovery and personal growth
• Fitness Looproom: Energizing workouts and movement therapy
• Meditation Looproom: Mindful journeys and breathing exercises
• 14-Day Free Trial: Explore all premium features risk-free
• Community Connection: Connect with like-minded wellness enthusiasts

LOGIN TO GET STARTED: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/login

Your wellness transformation begins now. Explore the three core Looprooms, connect with our community, and experience the future of emotional technology.

Welcome to the future,
The VYBE LOOPROOMS™ Team

---
© 2025 ${process.env.COMPANY_NAME || 'VYBE LOOPROOMS™'}. All rights reserved.
Website: https://feelyourvybe.com
Support: ${process.env.SUPPORT_EMAIL || 'technical@feelyourvybe.com'}

You received this email because you created an account at feelyourvybe.com. 
If you believe this was sent in error, please contact our support team.
    `;
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: {
          name: process.env.COMPANY_NAME || 'VYBE LOOPROOMS™',
          address: process.env.GMAIL_USER
        },
        to: email,
        subject: `Welcome to VYBE LOOPROOMS™ - Your Priority Access is Confirmed`,
        text: this.generateWelcomeEmailText(firstName),
        html: this.generateWelcomeEmailHTML(firstName),
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Welcome email sent successfully:', {
        messageId: result.messageId,
        to: email,
        firstName: firstName,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: result.messageId,
        message: 'Welcome email sent successfully'
      };

    } catch (error) {
      console.error('❌ Error sending welcome email:', {
        error: error.message,
        to: email,
        firstName: firstName,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to send welcome email'
      };
    }
  }

  async sendRegistrationEmail(email, firstName, isCreatorApplication = false) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const subject = isCreatorApplication 
        ? `Welcome to VYBE LOOPROOMS™ - Creator Application Received ❤️`
        : `Welcome to VYBE LOOPROOMS™ - Your Journey Begins Now ✨`;

      const mailOptions = {
        from: {
          name: process.env.COMPANY_NAME || 'VYBE LOOPROOMS™',
          address: process.env.GMAIL_USER
        },
        to: email,
        subject: subject,
        text: this.generateRegistrationEmailText(firstName, isCreatorApplication),
        html: this.generateRegistrationEmailHTML(firstName, isCreatorApplication),
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Registration email sent successfully:', {
        messageId: result.messageId,
        to: email,
        firstName: firstName,
        isCreatorApplication: isCreatorApplication,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: result.messageId,
        message: 'Registration email sent successfully'
      };

    } catch (error) {
      console.error('❌ Error sending registration email:', {
        error: error.message,
        to: email,
        firstName: firstName,
        isCreatorApplication: isCreatorApplication,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: error.message,
        message: 'Failed to send registration email'
      };
    }
  }

  async testConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      await this.transporter.verify();
      return { success: true, message: 'Email service connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send creator application approval email
   */
  async sendCreatorApprovalEmail(email, firstName) {
    try {
      const subject = '🎉 Creator Application Approved - Welcome to VYBE LOOPROOMS™';
      const html = this.generateCreatorApprovalEmailHTML(firstName);

      await this.sendEmail(email, subject, html);
      console.log(`✅ Creator approval email sent to: ${email}`);
      
    } catch (error) {
      console.error('❌ Failed to send creator approval email:', error.message);
      throw error;
    }
  }

  /**
   * Send creator application rejection email
   */
  async sendCreatorRejectionEmail(email, firstName, rejectionReason, additionalInfoRequested = '') {
    try {
      const subject = '📋 Creator Application Update - VYBE LOOPROOMS™';
      const html = this.generateCreatorRejectionEmailHTML(firstName, rejectionReason, additionalInfoRequested);

      await this.sendEmail(email, subject, html);
      console.log(`📧 Creator rejection email sent to: ${email}`);
      
    } catch (error) {
      console.error('❌ Failed to send creator rejection email:', error.message);
      throw error;
    }
  }

  /**
   * Send additional information request email
   */
  async sendAdditionalInfoRequestEmail(email, firstName, additionalInfoRequested) {
    try {
      const subject = '📝 Additional Information Required - Creator Application';
      const html = this.generateAdditionalInfoRequestEmailHTML(firstName, additionalInfoRequested);

      await this.sendEmail(email, subject, html);
      console.log(`📋 Additional info request email sent to: ${email}`);
      
    } catch (error) {
      console.error('❌ Failed to send additional info request email:', error.message);
      throw error;
    }
  }

  /**
   * Generate creator approval email HTML
   */
  generateCreatorApprovalEmailHTML(firstName) {
    const baseHTML = this.getBaseEmailTemplate();
    
    return baseHTML.replace('{{CONTENT}}', `
      <div class="content">
        <p class="greeting">Hello ${firstName},</p>
        
        <div class="highlight-box" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white;">
          <h3>🎉 Congratulations! Your Creator Application is Approved!</h3>
          <p>Welcome to the VYBE LOOPROOMS™ Creator Community. You now have access to all creator tools and can start building transformative content.</p>
        </div>
        
        <p>We're excited to have you join our mission of healing through innovative wellness technology. Your expertise and passion will help countless individuals on their recovery and wellness journeys.</p>
        
        <div class="benefits">
          <h4>Your Creator Access Includes:</h4>
          <ul>
            <li><strong>Content Creation Tools:</strong> Build Loopchains™ and individual Looprooms</li>
            <li><strong>Analytics Dashboard:</strong> Track engagement and impact metrics</li>
            <li><strong>Revenue Sharing:</strong> Earn from your premium content</li>
            <li><strong>Creator Community:</strong> Connect with fellow wellness creators</li>
            <li><strong>Priority Support:</strong> Dedicated creator support team</li>
          </ul>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard" class="action-button">
            Access Creator Dashboard →
          </a>
        </p>
        
        <p>If you have any questions about your new creator privileges or need assistance getting started, our creator support team is here to help.</p>
        
        <p>Welcome to the future of wellness technology!</p>
        
        <p>Best regards,<br>
        <strong>The VYBE LOOPROOMS™ Team</strong></p>
      </div>
    `);
  }

  /**
   * Generate creator rejection email HTML
   */
  generateCreatorRejectionEmailHTML(firstName, rejectionReason, additionalInfoRequested = '') {
    const baseHTML = this.getBaseEmailTemplate();
    
    const additionalInfoSection = additionalInfoRequested ? `
      <div class="highlight-box" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">
        <h3>📝 Additional Information Required</h3>
        <p>${additionalInfoRequested}</p>
        <p>Please update your application with the requested information and we'll review it promptly.</p>
      </div>
    ` : '';
    
    return baseHTML.replace('{{CONTENT}}', `
      <div class="content">
        <p class="greeting">Hello ${firstName},</p>
        
        <p>Thank you for your interest in becoming a VYBE LOOPROOMS™ creator. We appreciate the time and effort you put into your application.</p>
        
        <div class="highlight-box" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white;">
          <h3>📋 Application Update Required</h3>
          <p>We've reviewed your creator application and need some additional information before we can proceed.</p>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #92400e; margin-top: 0;">Review Notes:</h4>
          <p style="color: #92400e; margin-bottom: 0;">${rejectionReason}</p>
        </div>
        
        ${additionalInfoSection}
        
        <p>We encourage you to review our creator guidelines and resubmit your application when you're ready. Our mission is to ensure all creators maintain the highest standards of care and professionalism.</p>
        
        <p style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard" class="action-button">
            Update Application →
          </a>
        </p>
        
        <p>If you have any questions about this feedback or need clarification, please don't hesitate to reach out to our support team.</p>
        
        <p>Thank you for your understanding.</p>
        
        <p>Best regards,<br>
        <strong>The VYBE LOOPROOMS™ Team</strong></p>
      </div>
    `);
  }

  /**
   * Generate additional information request email HTML
   */
  generateAdditionalInfoRequestEmailHTML(firstName, additionalInfoRequested) {
    const baseHTML = this.getBaseEmailTemplate();
    
    return baseHTML.replace('{{CONTENT}}', `
      <div class="content">
        <p class="greeting">Hello ${firstName},</p>
        
        <p>Thank you for your creator application with VYBE LOOPROOMS™. We're in the process of reviewing your submission and need some additional information to continue.</p>
        
        <div class="highlight-box" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">
          <h3>📝 Additional Information Required</h3>
          <p>To complete your application review, please provide the following:</p>
        </div>
        
        <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #1d4ed8; margin-top: 0;">Required Information:</h4>
          <p style="color: #1d4ed8; margin-bottom: 0;">${additionalInfoRequested}</p>
        </div>
        
        <p>This information will help us better understand your qualifications and ensure you have the best possible experience as a VYBE LOOPROOMS™ creator.</p>
        
        <div class="benefits">
          <h4>How to Provide Additional Information:</h4>
          <ul>
            <li>Log into your VYBE LOOPROOMS™ dashboard</li>
            <li>Navigate to the Creator Application section</li>
            <li>Update your application with the requested details</li>
            <li>Submit for continued review</li>
          </ul>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard" class="action-button">
            Update Application →
          </a>
        </p>
        
        <p>Once we receive the additional information, we'll continue processing your application promptly. We appreciate your patience and look forward to potentially welcoming you to our creator community.</p>
        
        <p>Best regards,<br>
        <strong>The VYBE LOOPROOMS™ Team</strong></p>
      </div>
    `);
  }

  /**
   * Get base email template
   */
  getBaseEmailTemplate() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VYBE LOOPROOMS™</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .welcome-message {
                font-size: 28px;
                margin: 0;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
                line-height: 1.6;
                color: #334155;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #1e293b;
            }
            .highlight-box {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 25px;
                border-radius: 12px;
                margin: 25px 0;
                text-align: center;
            }
            .highlight-box h3 {
                margin: 0 0 10px 0;
                font-size: 20px;
            }
            .highlight-box p {
                margin: 0;
            }
            .action-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                font-size: 16px;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            .action-button:hover {
                transform: translateY(-2px);
            }
            .benefits {
                background: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
                border-left: 4px solid #667eea;
            }
            .benefits h4 {
                color: #1e293b;
                margin-top: 0;
                margin-bottom: 15px;
            }
            .benefits ul {
                margin: 0;
                padding-left: 20px;
            }
            .benefits li {
                margin-bottom: 8px;
                color: #475569;
            }
            .footer {
                background: #f1f5f9;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-links {
                margin-bottom: 20px;
            }
            .footer-links a {
                color: #3b82f6;
                text-decoration: none;
                margin: 0 15px;
                font-weight: 500;
            }
            .footer-links a:hover {
                text-decoration: underline;
            }
            .disclaimer {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 20px;
                line-height: 1.5;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VYBE LOOPROOMS™</div>
                <h1 class="welcome-message">Creator Application Update</h1>
            </div>
            
            {{CONTENT}}
            
            <div class="footer">
                <div class="footer-links">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}">Dashboard</a>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/support">Support</a>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/about">About</a>
                </div>
                <p class="disclaimer">
                    This email was sent from VYBE LOOPROOMS™. If you have any questions, please contact our support team.
                    <br>© 2024 VYBE LOOPROOMS™. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = EmailService;
