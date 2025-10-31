"""
Email Service for EUREKA API Core

Handles all email communications including:
- Email verification
- Password reset
- Welcome emails
- Notifications
"""

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Async email service using SMTP"""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL
        self.from_name = settings.SMTP_FROM_NAME

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
    ) -> bool:
        """
        Send an email using SMTP

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text fallback (optional)

        Returns:
            True if sent successfully, False otherwise
        """
        if not self.smtp_host or not self.smtp_username:
            logger.warning("SMTP not configured, skipping email send")
            return False

        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            # Add text part
            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)

            # Add HTML part
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            # Send email
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_username,
                password=self.smtp_password,
                start_tls=True,
            )

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

    async def send_verification_email(
        self,
        to_email: str,
        user_name: str,
        verification_token: str
    ) -> bool:
        """
        Send email verification link

        Args:
            to_email: User's email address
            user_name: User's full name
            verification_token: Verification token

        Returns:
            True if sent successfully
        """
        # In production, this would be your actual frontend URL
        verification_url = f"http://localhost:3006/auth/verify-email?token={verification_token}"

        subject = "Verify Your EUREKA Account"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #4F46E5; color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: #4F46E5;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to EUREKA!</h1>
                </div>
                <div class="content">
                    <h2>Hi {user_name},</h2>
                    <p>Thank you for registering with EUREKA - Educational Universal Reasoning Enhanced Knowledge Architecture.</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #4F46E5;">{verification_url}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account with EUREKA, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 EUREKA Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        text_content = f"""
        Hi {user_name},

        Thank you for registering with EUREKA!

        Please verify your email address by visiting:
        {verification_url}

        This link will expire in 24 hours.

        If you didn't create an account with EUREKA, please ignore this email.

        - The EUREKA Team
        """

        return await self.send_email(to_email, subject, html_content, text_content)

    async def send_password_reset_email(
        self,
        to_email: str,
        user_name: str,
        reset_token: str
    ) -> bool:
        """
        Send password reset link

        Args:
            to_email: User's email address
            user_name: User's full name
            reset_token: Password reset token

        Returns:
            True if sent successfully
        """
        reset_url = f"http://localhost:3006/auth/reset-password?token={reset_token}"

        subject = "Reset Your EUREKA Password"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #EF4444; color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: #EF4444;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .warning {{ background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hi {user_name},</h2>
                    <p>We received a request to reset your EUREKA account password.</p>
                    <p>Click the button below to reset your password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #EF4444;">{reset_url}</p>
                    <div class="warning">
                        <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 EUREKA Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        text_content = f"""
        Hi {user_name},

        We received a request to reset your EUREKA account password.

        Please visit this link to reset your password:
        {reset_url}

        This link will expire in 1 hour.

        If you didn't request a password reset, please ignore this email.

        - The EUREKA Team
        """

        return await self.send_email(to_email, subject, html_content, text_content)

    async def send_welcome_email(
        self,
        to_email: str,
        user_name: str,
        organization_name: str
    ) -> bool:
        """
        Send welcome email after successful registration

        Args:
            to_email: User's email address
            user_name: User's full name
            organization_name: User's organization

        Returns:
            True if sent successfully
        """
        subject = f"Welcome to EUREKA - {organization_name}!"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #10B981; color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f9f9f9; padding: 30px; }}
                .feature {{ background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #10B981; }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: #10B981;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to EUREKA!</h1>
                </div>
                <div class="content">
                    <h2>Hi {user_name},</h2>
                    <p>Your account has been successfully created for <strong>{organization_name}</strong>!</p>
                    <p>EUREKA is an Educational Universal Reasoning Enhanced Knowledge Architecture designed to provide personalized, AI-powered learning experiences.</p>

                    <h3>What's available for you:</h3>
                    <div class="feature">
                        <strong>🤖 AI Tutor:</strong> Get personalized help and explanations
                    </div>
                    <div class="feature">
                        <strong>📚 Course Content:</strong> Access comprehensive learning materials
                    </div>
                    <div class="feature">
                        <strong>📊 Assessments:</strong> Test your knowledge and track progress
                    </div>
                    <div class="feature">
                        <strong>🎯 Adaptive Learning:</strong> Personalized learning paths based on your progress
                    </div>

                    <p style="text-align: center;">
                        <a href="http://localhost:3006/dashboard" class="button">Go to Dashboard</a>
                    </p>

                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Happy learning!</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 EUREKA Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        text_content = f"""
        Hi {user_name},

        Welcome to EUREKA - {organization_name}!

        Your account has been successfully created.

        Get started at: http://localhost:3006/dashboard

        What's available:
        - AI Tutor for personalized help
        - Comprehensive course content
        - Assessments and progress tracking
        - Adaptive learning paths

        Happy learning!

        - The EUREKA Team
        """

        return await self.send_email(to_email, subject, html_content, text_content)


# Create global email service instance
email_service = EmailService()
