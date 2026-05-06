# 🔍 Finding Your Stripe Account

## The Issue
You cannot see the booking transactions in your Stripe accounts (grantashl1@gmail.com or bookings@carlsonproperties.co.nz).

## Why This Happens
Your booking system is connected to **whichever Stripe account's API key is stored in Supabase**. Based on your Supabase screenshot, I can see there are multiple Stripe-related edge functions which suggests a different Stripe integration may have been set up.

## ✅ Confirmed Transactions
These transactions HAVE been processed successfully:

1. **Lesley Walter** - $3,442.50 NZD
   - Session: `cs_live_a1qlwFrr4etDEDQYlMjJn00db9IdYjKJchHGGe8NKKss3iSGnoTmFugYaW`
   - Date: April 3, 2026

2. **Kristy Ngapeka** - $4,590 NZD
   - Date: March 12, 2026

The `cs_live_` prefix confirms these are REAL LIVE transactions, not test mode.

## 🔎 How to Find the Correct Stripe Account

### Method 1: Check Supabase Secrets
1. Go to: https://supabase.com/dashboard/project/hxprmevheigajzqehjgf
2. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
3. Look for: `STRIPE_SECRET_KEY`
4. Note the value (starts with `sk_live_...`)
5. Then for each Stripe account you have:
   - Log in to stripe.com
   - Go to **Developers** → **API Keys**
   - Compare the **last 6-8 characters** of your secret key with the one in Supabase
   - **MATCH = Correct Account!**

### Method 2: Search Stripe Dashboards
Try logging into each potential Stripe account:
- grantashl1@gmail.com
- bookings@carlsonproperties.co.nz
- Matt's email (if he set up the integration)
- Any other email you might have used

Once logged in:
1. Go to **Payments** → **All Payments**
2. Search for:
   - `cs_live_a1qlwFrr4etDEDQYlMjJn00db9IdYjKJchHGGe8NKKss3iSGnoTmFugYaW`
   - `lesley.walter@greymouthpetroleum.co.nz`
   - `$3,442.50 NZD`
3. If you find it → **This is the correct Stripe account!**

### Method 3: Check Stripe Email Notifications
- Check ALL your email inboxes for emails from Stripe about payments
- Search for emails containing: "$3,442.50" or "Lesley Walter"
- The inbox that received these payment notifications = Stripe account email

### Method 4: Check Supabase Edge Functions
Looking at your screenshot, you have these Stripe-related functions:
- `stripe-setup`
- `stripe-webhook`
- `stripe-worker`

These might be using a DIFFERENT Stripe integration than your main booking system. This could mean:
- There are two separate Stripe setups
- The transactions might be in a different Stripe Connect account
- There might be a test vs. production key confusion

## 🎯 Recommended Action

1. **Check Method 1 first** (Supabase secrets) - This is the most definitive
2. **Email check** - Look through all your emails for Stripe payment notifications
3. If still stuck, ask Matt (your co-owner) if he set up the Stripe account

## 💡 Diagnostic Tools Available

Visit these pages on your website:
- **https://carlsonproperties.co.nz/stripe-account-check** - Full diagnostic guide
- **https://carlsonproperties.co.nz/view-latest-booking** - See latest booking with Stripe session ID

## ⚠️ Important Note

The money IS in a Stripe account somewhere - these are confirmed successful payments. You just need to find which account received them!
