const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// 🔥 Generate secure verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// 🔥 Generate token expiration time (24 hours)
const getTokenExpiration = () => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
};

// Email template for User Account Creation with Token
const sendUserCreationEmail = async (userEmail, userName, verificationToken) => {
    const activationLink = `${process.env.FRONTEND_URL}/activate-account?token=${verificationToken}&email=${encodeURIComponent(userEmail)}`;

    const mailOptions = {
        from: `"Your Company" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '🎉 Welcome! Activate Your Account',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        color: #333;
                        background-color: #f4f4f4;
                    }
                    .email-wrapper {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        margin-bottom: 10px;
                    }
                    .logo {
                        width: 80px;
                        height: 80px;
                        background-color: white;
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 40px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 20px;
                        color: #667eea;
                        margin-bottom: 20px;
                    }
                    .message {
                        color: #555;
                        margin-bottom: 30px;
                        font-size: 15px;
                    }
                    .button-container {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .activate-button {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white !important;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 50px;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                        transition: all 0.3s;
                    }
                    .activate-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                    }
                    .info-box {
                        background-color: #f8f9fa;
                        border-left: 4px solid #667eea;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                    .info-box p {
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .link-text {
                        word-break: break-all;
                        color: #667eea;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e9ecef;
                    }
                    .footer p {
                        margin: 5px 0;
                        font-size: 13px;
                        color: #6c757d;
                    }
                    .social-links {
                        margin: 20px 0;
                    }
                    .social-links a {
                        display: inline-block;
                        margin: 0 10px;
                        color: #667eea;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo">🚀</div>
                        <h1>Welcome Aboard!</h1>
                        <p>Your journey starts here</p>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Hello ${userName}! 👋</div>
                        
                        <div class="message">
                            <p>We're thrilled to have you join our platform! Your account has been successfully created, and you're just one click away from getting started.</p>
                        </div>
                        
                        <div class="info-box">
                            <p><strong>⚡ Quick Info:</strong></p>
                            <p>📧 Email: ${userEmail}</p>
                            <p>🕒 Link expires in: 24 hours</p>
                        </div>
                        
                        <div class="button-container">
                            <a href="${activationLink}" class="activate-button">
                                ✨ Activate My Account
                            </a>
                        </div>
                        
                        <div class="message">
                            <p><strong>Why activate?</strong></p>
                            <ul style="margin-left: 20px; margin-top: 10px;">
                                <li>Secure your account</li>
                                <li>Access all features</li>
                                <li>Start using our platform immediately</li>
                            </ul>
                        </div>
                        
                        <div class="link-text">
                            <p><strong>Link not working?</strong> Copy and paste this URL into your browser:</p>
                            <p>${activationLink}</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>If you didn't create this account, please ignore this email.</p>
                        <p style="margin-top: 15px;">Need help? Contact our support team</p>
                        <div class="social-links">
                            <a href="#">Twitter</a> | 
                            <a href="#">Facebook</a> | 
                            <a href="#">LinkedIn</a>
                        </div>
                        <p style="margin-top: 15px; color: #adb5bd;">&copy; 2024 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ User creation email sent successfully to:', userEmail);
        console.log('Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending user creation email:', error);
        return { success: false, error: error.message };
    }
};

// Email template for Device Activation with Token
const sendDeviceActivationEmail = async (userEmail, userName, deviceData, activationToken) => {
    const activationLink = `${process.env.FRONTEND_URL}/activate-device?token=${activationToken}&deviceId=${deviceData.modelCode}`;

    const mailOptions = {
        from: `"Your Company" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '📱 New Device Added - Activation Required',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        color: #333;
                        background-color: #f4f4f4;
                    }
                    .email-wrapper {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        margin-bottom: 10px;
                    }
                    .device-icon {
                        width: 80px;
                        height: 80px;
                        background-color: white;
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 40px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 20px;
                        color: #2196F3;
                        margin-bottom: 20px;
                    }
                    .message {
                        color: #555;
                        margin-bottom: 30px;
                        font-size: 15px;
                    }
                    .device-details {
                        background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
                        border-left: 4px solid #2196F3;
                        padding: 20px;
                        margin: 20px 0;
                        border-radius: 8px;
                    }
                    .device-details h3 {
                        color: #1976D2;
                        margin-bottom: 15px;
                    }
                    .detail-row {
                        display: flex;
                        padding: 8px 0;
                        border-bottom: 1px solid rgba(33, 150, 243, 0.2);
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: bold;
                        color: #1976D2;
                        min-width: 150px;
                    }
                    .detail-value {
                        color: #555;
                    }
                    .button-container {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .activate-button {
                        background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                        color: white !important;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 50px;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
                    }
                    .info-box {
                        background-color: #FFF3E0;
                        border-left: 4px solid #FF9800;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                    .link-text {
                        word-break: break-all;
                        color: #2196F3;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e9ecef;
                    }
                    .footer p {
                        margin: 5px 0;
                        font-size: 13px;
                        color: #6c757d;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div class="device-icon">📱</div>
                        <h1>Device Added Successfully!</h1>
                        <p>Just one more step to get started</p>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Hello ${userName}! 👋</div>
                        
                        <div class="message">
                            <p>Great news! A new device has been successfully registered to your account. Please activate it to start using all its features.</p>
                        </div>
                        
                        <div class="device-details">
                            <h3>📋 Device Information</h3>
                            <div class="detail-row">
                                <div class="detail-label">Model Code:</div>
                                <div class="detail-value">${deviceData.modelCode}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Model Name:</div>
                                <div class="detail-value">${deviceData.modelName}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Channels:</div>
                                <div class="detail-value">${deviceData.numberOfChannels}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Added on:</div>
                                <div class="detail-value">${new Date().toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div class="info-box">
                            <p><strong>⏰ Important:</strong> This activation link will expire in 24 hours.</p>
                        </div>
                        
                        <div class="button-container">
                            <a href="${activationLink}" class="activate-button">
                                ✅ Activate Device Now
                            </a>
                        </div>
                        
                        <div class="link-text">
                            <p><strong>Button not working?</strong> Copy and paste this URL:</p>
                            <p>${activationLink}</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>⚠️ If you didn't add this device, please contact support immediately.</p>
                        <p style="margin-top: 15px;">&copy; 2024 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Device activation email sent successfully to:', userEmail);
        console.log('Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending device activation email:', error);
        return { success: false, error: error.message };
    }
};

// 🔥 NEW: Resend verification email for user
const resendUserVerificationEmail = async (userEmail, userName, verificationToken) => {
    return await sendUserCreationEmail(userEmail, userName, verificationToken);
};

// 🔥 NEW: Resend activation email for device
const resendDeviceActivationEmail = async (userEmail, userName, deviceData, activationToken) => {
    return await sendDeviceActivationEmail(userEmail, userName, deviceData, activationToken);
};

module.exports = {
    generateVerificationToken,
    getTokenExpiration,
    sendUserCreationEmail,
    sendDeviceActivationEmail,
    resendUserVerificationEmail,
    resendDeviceActivationEmail
};