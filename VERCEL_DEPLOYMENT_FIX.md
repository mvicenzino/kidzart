# Vercel Deployment & Print Shop Troubleshooting

If you "cannot access" the Print Shop feature in Vercel (meaning it's missing, blank, or failing), it is almost certainly due to **Missing Environment Variables** or **Edge Function Configuration**.

## 1. Quick Vercel Setup Check

The Print Shop relies on your Supabase backend. Vercel naturally protects your app by NOT bundling local `.env` files. You must manually add these keys to Vercel.

### Step-by-Step Fix:
1.  Go to your **Vercel Dashboard** > Select your Project (`kidzart`).
2.  Click **Settings** > **Environment Variables**.
3.  Add the following keys (copy them from your existing Supabase settings or `.env.local` if you have it):
    *   `VITE_SUPABASE_URL`: (e.g., `https://xyz.supabase.co`)
    *   `VITE_SUPABASE_ANON_KEY`: (your long public API key)
4.  **IMPORTANT:** You must **Redeploy** your application for these changes to take effect.
    *   Go to **Deployments** tab.
    *   Click the three dots `...` on the latest deployment > **Redeploy**.

## 2. Supabase Edge Function Check

The "Pay & Place Order" button calls a server-side function. If this function isn't deployed, it will fail (404).

1.  Make sure you have deployed the function:
    ```bash
    supabase functions deploy create-print-order
    ```
    *(Run this in your local terminal)*

2.  Make sure the function has your Printful/Stripe keys:
    ```bash
    supabase secrets set PRINTFUL_API_KEY=your_key STRIPE_SECRET_KEY=your_key
    ```

## 3. Debugging the "Cannot Access" State

I have updated the `PrintShopModal.jsx` code to give you better feedback.
*   **Previous Behavior:** If the backend failed (404), it would silently pretend to succeed ("Added to Cart" demo). This hid the error.
*   **New Behavior:** It will now show a red error message box with the specific reason (e.g., "Missing Env Vars", "404 Not Found").

### What to look for:
*   **If the modal doesn't open at all:** Check browser console (`F12` > Console) for "Z-Index" or "Portal" errors.
*   **If it says "Failed to fetch":** Your `VITE_SUPABASE_URL` is likely empty or incorrect in Vercel.
*   **If it says "404":** Your Edge Function is not deployed or the URL path is wrong.

## 4. Frontend Code Updates
I am updating `src/components/PrintShopModal.jsx` to:
1.  **Validate Keys:** Check if Supabase keys exist on mount.
2.  **Real Error Reporting:** Show legitimate errors instead of simulating success.
3.  **Remove manual "DEMO MODE" badge:** Unless we are actually in a test environment (optional).
