# Ecommerce Setup Checklist

You have successfully upgraded the KidzArt Print Shop to detailed checkout mode! To make it actually process credit cards and print mugs, follow this checklist.

## 1. Get Your API Keys

### [ ] Stripe (Payment Processor)
**Option A: Reuse your Kindora AI Setup (Quickest)**
1.  Log in to your existing Stripe Dashboard (or check your Kindora Environment Variables).
2.  Look for the **Secret Key**. It always starts with `sk_`.
    *   Example: `sk_test_...` (It is a long string of random characters)
3.  **Authentication:** You will use this key to set the `STRIPE_SECRET_KEY` secret in Supabase.

| Kindora Variable Name | Stripe Key Format | KidzArt Command to Run |
| :--- | :--- | :--- |
| `STRIPE_SECRET_KEY` | `sk_live_...` | `npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...` |

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
