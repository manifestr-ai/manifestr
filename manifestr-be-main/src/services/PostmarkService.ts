/**
 * Postmark Email Service
 * 
 * Handles all email sending via Postmark API
 * - Collaboration invites
 * - Password resets
 * - Notifications
 * 
 * Setup:
 * 1. Get API key from https://account.postmarkapp.com/servers
 * 2. Verify sender email in Postmark dashboard
 * 3. Add POSTMARK_API_KEY to .env
 */

import * as postmark from 'postmark';

export interface CollaborationInviteData {
    inviteeEmail: string;
    inviteeName: string;
    inviterName: string;
    documentTitle: string;
    role: 'editor' | 'viewer';
    inviteLink: string;
    accountCreated?: boolean;
    defaultPassword?: string;
}

export interface PasswordResetData {
    email: string;
    resetCode: string;
}

export class PostmarkService {
    private client: postmark.ServerClient;
    private fromEmail: string;
    private fromName: string;
    private frontendUrl: string;

    constructor() {
        const apiKey = process.env.POSTMARK_API_KEY;
        
        if (!apiKey || apiKey === 'your-postmark-api-key-here') {
            console.warn('⚠️ POSTMARK_API_KEY not configured! Emails will be logged but not sent.');
            console.warn('Get your API key from: https://account.postmarkapp.com/servers');
            // Create a dummy client - emails will fail gracefully
            this.client = new postmark.ServerClient('dummy-key');
        } else {
            this.client = new postmark.ServerClient(apiKey);
        }

        this.fromEmail = process.env.POSTMARK_FROM_EMAIL || 'noreply@manifestr.ai';
        this.fromName = process.env.POSTMARK_FROM_NAME || 'Manifestr';
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    }

    /**
     * Send collaboration invite email
     */
    async sendCollaborationInvite(data: CollaborationInviteData): Promise<boolean> {
        try {
            const htmlBody = this.buildInviteEmailHTML(data);
            const textBody = this.buildInviteEmailText(data);

            console.log(`📧 Sending collaboration invite to ${data.inviteeEmail}...`);

            const response = await this.client.sendEmail({
                From: `${this.fromName} <${this.fromEmail}>`,
                To: data.inviteeEmail,
                Subject: `${data.inviterName} invited you to collaborate on "${data.documentTitle}"`,
                HtmlBody: htmlBody,
                TextBody: textBody,
                MessageStream: 'outbound',
            });

            console.log(`✅ Email sent successfully! Message ID: ${response.MessageID}`);
            return true;

        } catch (error: any) {
            console.error('❌ Failed to send collaboration invite:', error);
            
            // Check for specific Postmark errors
            if (error.code === 'InvalidAPIKey') {
                console.error('🔑 Invalid Postmark API key! Please check your POSTMARK_API_KEY in .env');
            } else if (error.code === 'InactiveRecipient') {
                console.error('📭 Recipient email is inactive or invalid');
            } else if (error.code === 300) {
                console.error('❌ Sender signature not verified in Postmark! Verify your sender email first.');
            }

            return false;
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordReset(data: PasswordResetData): Promise<boolean> {
        try {
            const htmlBody = this.buildPasswordResetHTML(data);
            const textBody = this.buildPasswordResetText(data);

            console.log(`📧 Sending password reset to ${data.email}...`);

            const response = await this.client.sendEmail({
                From: `${this.fromName} <${this.fromEmail}>`,
                To: data.email,
                Subject: 'Your Manifestr Password Reset Code',
                HtmlBody: htmlBody,
                TextBody: textBody,
                MessageStream: 'outbound',
            });

            console.log(`✅ Password reset email sent! Message ID: ${response.MessageID}`);
            return true;

        } catch (error: any) {
            console.error('❌ Failed to send password reset email:', error);
            return false;
        }
    }

    /**
     * Build HTML email for collaboration invite
     */
    private buildInviteEmailHTML(data: CollaborationInviteData): string {
        const { inviteeEmail, inviteeName, inviterName, documentTitle, role, inviteLink, accountCreated, defaultPassword } = data;

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaboration Invite</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                📝 You're Invited!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                                Hi ${inviteeName || 'there'} 👋
                            </p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                                <strong>${inviterName}</strong> has invited you to collaborate on:
                            </p>
                            
                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">
                                    "${documentTitle}"
                                </p>
                                <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">
                                    Role: <strong style="color: #667eea; text-transform: capitalize;">${role}</strong>
                                </p>
                            </div>

                            ${accountCreated ? `
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                                <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #856404;">
                                    🎉 Account Created!
                                </p>
                                <p style="margin: 0 0 10px; font-size: 14px; color: #856404;">
                                    We've created an account for you. Here are your credentials:
                                </p>
                                <p style="margin: 0; font-size: 14px; color: #856404;">
                                    <strong>Email:</strong> ${inviteeEmail}<br>
                                    <strong>Password:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${defaultPassword}</code>
                                </p>
                                <p style="margin: 10px 0 0; font-size: 12px; color: #856404; font-style: italic;">
                                    💡 Please change your password after first login!
                                </p>
                            </div>
                            ` : ''}
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px;">
                                <tr>
                                    <td align="center">
                                        <a href="${inviteLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                            Open Document →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 10px; font-size: 14px; line-height: 20px; color: #666666;">
                                You can ${role === 'editor' ? 'edit and collaborate in real-time' : 'view the document'} with your team.
                            </p>
                            
                            <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                                If the button doesn't work, copy and paste this link:<br>
                                <a href="${inviteLink}" style="color: #667eea; word-break: break-all;">${inviteLink}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                                Powered by <strong>Manifestr</strong>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                Questions? Contact us at <a href="mailto:support@manifestr.ai" style="color: #667eea; text-decoration: none;">support@manifestr.ai</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();
    }

    /**
     * Build plain text email for collaboration invite (fallback)
     */
    private buildInviteEmailText(data: CollaborationInviteData): string {
        const { inviteeName, inviterName, documentTitle, role, inviteLink, accountCreated, inviteeEmail, defaultPassword } = data;

        let text = `Hi ${inviteeName || 'there'},

${inviterName} has invited you to collaborate on "${documentTitle}"

Role: ${role.charAt(0).toUpperCase() + role.slice(1)}

`;

        if (accountCreated) {
            text += `ACCOUNT CREATED
We've created an account for you:
Email: ${inviteeEmail}
Password: ${defaultPassword}

Please change your password after first login!

`;
        }

        text += `Open the document here:
${inviteLink}

You can ${role === 'editor' ? 'edit and collaborate in real-time' : 'view the document'} with your team.

---
Powered by Manifestr
Questions? Contact us at support@manifestr.ai`;

        return text;
    }

    /**
     * Build HTML email for password reset
     */
    private buildPasswordResetHTML(data: PasswordResetData): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 700; color: #1a1a1a;">Password Reset Request</h2>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px; color: #333333;">
                                You requested a password reset for your Manifestr account.
                            </p>
                            
                            <p style="margin: 0 0 10px; font-size: 16px; line-height: 24px; color: #333333;">
                                <strong>Your reset code is:</strong>
                            </p>
                            
                            <div style="text-align: center; padding: 30px; background-color: #f8f9fa; border-radius: 8px; margin: 0 0 20px;">
                                <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #667eea; font-family: monospace;">
                                    ${data.resetCode}
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 20px; color: #666666;">
                                This code will expire in <strong>15 minutes</strong>.
                            </p>
                            
                            <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                                If you didn't request a password reset, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                Questions? Contact us at <a href="mailto:support@manifestr.ai" style="color: #667eea; text-decoration: none;">support@manifestr.ai</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();
    }

    /**
     * Build plain text for password reset
     */
    private buildPasswordResetText(data: PasswordResetData): string {
        return `Password Reset Request

You requested a password reset for your Manifestr account.

Your reset code is: ${data.resetCode}

This code will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.

---
Questions? Contact us at support@manifestr.ai`;
    }

    /**
     * Test email configuration
     */
    async testConfiguration(): Promise<boolean> {
        try {
            console.log('🧪 Testing Postmark configuration...');
            
            // Try to get account info (validates API key)
            const accountInfo = await this.client.getServer();
            
            console.log('✅ Postmark configuration valid!');
            console.log(`📧 Server: ${accountInfo.Name}`);
            console.log(`📬 Email: ${this.fromEmail}`);
            
            return true;
        } catch (error: any) {
            console.error('❌ Postmark configuration test failed:', error.message);
            return false;
        }
    }
}

// Export singleton instance
export default new PostmarkService();
