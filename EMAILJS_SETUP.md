# EmailJS Setup Guide for Contact Form

## Overview
The contact form in this application uses EmailJS to send emails directly from the client-side without requiring a backend server.

## Setup Instructions

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. Note down the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} <{{from_email}}>
Category: {{category}}

Message:
{{message}}

---
This message was sent from the MindBuddy contact form.
```

4. The template variables are:
   - `{{from_name}}` - User's name
   - `{{from_email}}` - User's email
   - `{{subject}}` - Message subject
   - `{{category}}` - Selected category
   - `{{message}}` - User's message

5. Note down the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (e.g., `user_def456`)

### 5. Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_abc123
   VITE_EMAILJS_TEMPLATE_ID=template_xyz789
   VITE_EMAILJS_PUBLIC_KEY=user_def456
   ```

### 6. Test the Setup
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Contact Us page
3. Fill out and submit the form
4. Check your email inbox for the message

## Troubleshooting

### Common Issues

1. **"EmailJS configuration is missing" error**
   - Make sure your `.env.local` file exists and has the correct variable names
   - Restart the development server after adding environment variables

2. **Form submits but no email received**
   - Check your EmailJS dashboard for failed sends
   - Verify your email service is properly connected
   - Check spam folder
   - Ensure template variables match exactly

3. **Rate limiting errors**
   - EmailJS free tier has limits (200 emails/month)
   - Consider upgrading your plan for production use

### Security Notes

- The EmailJS public key is meant to be public (hence the name)
- Sensitive email credentials are stored safely in EmailJS, not in your code
- Environment variables starting with `VITE_` are included in the client bundle
- Never commit `.env.local` to version control (it's already in `.gitignore`)

## Production Deployment

For production deployments (Vercel, Netlify, etc.), add the environment variables in your hosting platform's dashboard:

### Vercel
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add the three EmailJS variables

### Netlify
1. Go to Site settings → Environment variables
2. Add the three EmailJS variables

## Alternative Solutions

If you prefer a server-side solution for better security and control:
1. **Serverless Functions**: Use Vercel/Netlify functions with SendGrid or Nodemailer
2. **Form Services**: Use Formspree, Formsubmit, or similar services
3. **Backend API**: Create a dedicated backend with proper email handling

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify EmailJS dashboard for failed sends
3. Ensure all environment variables are correctly set
4. Test with a simple message first