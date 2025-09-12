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
                    <a href="mailto:${process.env.SUPPORT_EMAIL || 'info@feelyourvybe.com'}">Contact Support</a>
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
}

module.exports = EmailService;
