# Print Shop Integration Guide

To make the "Print Shop" fully functional and profitable, you need to integrate a **Print-on-Demand (POD)** service. This allows you to sell physical products without holding inventory.

## Recommended Providers

1.  **Printful** (Best overall API documentation, wide product range).
2.  **Gelato** (Global production network, faster shipping).
3.  **Prodigi** (High-quality fine art prints).

## Integration Roadmap

### Phase 1: Product Configuration (No Code)
1.  Create an account on **Printful.com**.
2.  Select the products you want to offer (e.g., "Enhanced Matte Paper Poster", "Ceramic Mug 11oz").
3.  Download their "Mockup Templates" to use in your app UI (replacing the generic icons used currently).

### Phase 2: Backend API Integration
Since `KidzArt` is a client-side app (React/Vite), you should NOT expose your Printful API Keys directly in the frontend code. You need a small backend function (e.g., Vercel Serverless Function or Supabase Edge Function).

**The Workflow:**
1.  **Frontend:** User clicks "Buy Mug".
2.  **Frontend:** App sends request to your Backend: `POST /api/create-order` with `{ artworkUrl, productId, shippingDetails }`.
3.  **Backend:** Validates payment (Stripe).
4.  **Backend:** Calls Printful API: `POST /orders` with the high-res image URL.
5.  **Printful:** Charges your credit card, prints the item, and ships it to the customer "White Label" (looks like it came from KidzArt).

### Phase 3: Payment Processing
You need **Stripe** to collect money from the user.
1.  Integrate `Stripe Checkout`.
2.  Calculate: `Your Price ($25)` - `Printful Cost ($12)` = **$13 Profit**.

### Technical Steps for Developer
1.  **I have already created the backend code for you.**
2.  Navigate to `supabase/functions/create-print-order/index.ts`.
3.  Deploy this function using the Supabase CLI:
    ```bash
    supabase functions deploy create-print-order
    ```
4.  Set your API key secret:
    ```bash
    supabase secrets set PRINTFUL_API_KEY=your_printful_key_here
    ```

Here is the logic pre-written in that file:
```javascript
// supabase/functions/create-print-order/index.ts
// ... (Logic to call Printful API) ...
```

## Immediate Next Steps
1.  Register for a [Printful Developer Account](https://developers.printful.com/).
2.  Get your **API Token**.
3.  Set up a Stripe account for payments.
