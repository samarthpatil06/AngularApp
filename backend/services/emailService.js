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
        <title>Account Activation</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Segoe UI, Tahoma, Geneva, Verdana, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
            <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

                <!-- Header -->
                <tr>
                    <td align="center" style="background-color:#667eea; padding:40px 30px; color:#ffffff;">
                    <div style="font-size:40px; margin-bottom:15px;">🚀</div>
                    <h1 style="margin:0; font-size:26px;">Welcome!</h1>
                    <p style="margin-top:10px; font-size:14px;">Your journey starts here</p>
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:40px 30px; color:#333333;">

                    <p style="font-size:18px; color:#667eea; margin-top:0;">
                        Hello ${userName}! 👋
                    </p>

                    <p style="font-size:15px; color:#555555;">
                        We're thrilled to have you join our platform! Your account has been successfully created, and you're just one click away from getting started.
                    </p>

                    <!-- Info Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa; border-left:4px solid #667eea; margin:20px 0;">
                        <tr>
                        <td style="padding:15px; font-size:14px; color:#555;">
                            <strong>⚡ Quick Info:</strong><br><br>
                            📧 Email: ${userEmail}<br>
                            🕒 Link expires in: 24 hours
                        </td>
                        </tr>
                    </table>

                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td align="center" style="padding:20px 0;">
                            <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" bgcolor="#667eea" style="border-radius:50px;">
                                <a href="${activationLink}" 
                                    style="display:inline-block; padding:15px 40px; font-size:16px; color:#ffffff; text-decoration:none; font-weight:bold;">
                                    ✨ Activate My Account
                                </a>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>

                    <p style="font-size:15px; color:#555555;">
                        <strong>Why activate?</strong>
                    </p>

                    <ul style="font-size:14px; color:#555555; padding-left:20px;">
                        <li>Secure your account</li>
                        <li>Access all features</li>
                        <li>Start using our platform immediately</li>
                    </ul>

                    <!-- Fallback Link -->
                    <p style="font-size:13px; color:#667eea; word-break:break-all; margin-top:20px;">
                        <strong>Link not working?</strong><br>
                        ${activationLink}
                    </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="background:#f8f9fa; padding:30px; font-size:13px; color:#6c757d;">
                    If you didn't create this account, please ignore this email.<br><br>
                    Need help? Contact our support team
                    <div style="margin-top:15px;">
                        <a href="#" style="color:#667eea; text-decoration:none;">Twitter</a> |
                        <a href="#" style="color:#667eea; text-decoration:none;">Facebook</a> |
                        <a href="#" style="color:#667eea; text-decoration:none;">LinkedIn</a>
                    </div>
                    <p style="margin-top:15px; color:#adb5bd;">
                        &copy; 2024 Your Company. All rights reserved.
                    </p>
                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

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