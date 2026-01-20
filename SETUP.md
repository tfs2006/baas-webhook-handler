# Boy and a Scanner - Automatic STL Delivery System

## Complete Setup Guide

This repository contains everything you need to automatically deliver STL files after Stripe payments.

## What This System Does

1. Customer buys STL product from your Stripe pricing table
2. Stripe sends webhook to this handler
3. System automatically emails customer with download link
4. Customer gets instant access to files

## Quick Start (3 Steps)

### Step 1: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import this GitHub repo: `tfs2006/baas-webhook-handler`
4. Click "Deploy" (takes 30 seconds)

### Step 2: Add Environment Variables in Vercel

In your Vercel project settings → Environment Variables, add:

```
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=(get this in Step 3)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FROM_EMAIL=Boy and a Scanner <your-email@gmail.com>
```

### Step 3: Configure Stripe Webhook

1. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Go to Stripe Dashboard → Developers → Webhooks
3. Click "Add endpoint"
4. Endpoint URL: `https://your-project.vercel.app/api/webhook`
5. Select event: `checkout.session.completed`
6. Copy the webhook signing secret → add to Vercel env vars

## Done! 🎉

Now test by making a purchase in Stripe test mode.

---

## File Structure You Need to Create

Create these files in your repo:

### 1. `/api/webhook.js` (Main Handler)

See full code in next commit.

### 2. `/package.json`

```json
{
  "name": "baas-webhook-handler",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "^14.0.0",
    "nodemailer": "^6.9.0"
  }
}
```

### 3. `/vercel.json`

```json
{
  "functions": {
    "api/webhook.js": {
      "maxDuration": 10
    }
  }
}
```

## Product IDs

Update these in your webhook handler:

- Personal Use: `prod_Tp9cFKYPRjcIN1`
- Support Channel: `prod_Tp9dxSaBSQsnZW`

## Gmail App Password Setup

1. Go to https://myaccount.google.com/apppasswords
2. Create new app password
3. Use that password (not your regular Gmail password)

## File Hosting

Upload your STL ZIPs to: `https://github.com/tfs2006/baas-stl-files`

## Support

Questions? Check Vercel logs or Stripe webhook logs.
