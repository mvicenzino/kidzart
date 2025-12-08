# Ecommerce Setup Checklist

You have successfully upgraded the KidzArt Print Shop to detailed checkout mode! To make it actually process credit cards and print mugs, follow this checklist.

## 1. Get Your API Keys

### [ ] Stripe (Payment Processor)
1.  Go to [dashboard.stripe.com](https://dashboard.stripe.com/register).
2.  Sign up for an account.
3.  Get your **Publishable Key** (starts with `pk_test_...`) → Use this in Frontend.
4.  Get your **Secret Key** (starts with `sk_test_...`) → Use this in Backend (Supabase Secrets).

### [ ] Printful (Print Provider)
1.  Go to [developers.printful.com](https://developers.printful.com/).
2.  Create a "Private Token" with `orders:create` permission.
3.  Copy this Token → Use this in Backend (Supabase Secrets).

## 2. Connect the "Plumbing"

Run these commands in your terminal to safely store your secrets (do not commit them to Git!):

```bash
# 1. Login to Supabase CLI (if you haven't)
npx supabase login

# 2. Set the secrets for your backend function to use
npx supabase secrets set PRINTFUL_API_KEY=your_printful_token_here
npx supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## 3. Deploy the Backend

```bash
npx supabase functions deploy create-print-order
```

## 4. Go Live!
Once you've tested with "Test Mode" keys:
1.  Swap your keys for **Live Keys** on Stripe and Printful.
2.  Update the `PrintShopModal.jsx` to remove the "DEMO MODE" badge.
