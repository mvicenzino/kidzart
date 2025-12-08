// Output: JSON with { success: true, orderId: "123" } or { success: false, error: "..." }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.0.0'

const PRINTFUL_API_URL = 'https://api.printful.com';

serve(async (req) => {
    try {
        const { artworkUrl, recipient, productId, stripeToken } = await req.json();

        // Initialize Stripe
        const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2022-11-15',
            httpClient: Stripe.createFetchHttpClient(),
        });

        if (!stripeToken) {
            throw new Error("Missing payment information");
        }

        // ---------------------------------------------------------
        // STEP 1: CHARGE THE CARD (Stripe)
        // ---------------------------------------------------------
        // We create a charge of $30.00 (or whatever your markup price is)
        // In a production app, pass the exact amount from the frontend or calculate it here.
        const charge = await stripe.charges.create({
            amount: 3999, // $39.99 (hardcoded for demo simplicity, change per product logic)
            currency: 'usd',
            source: stripeToken, // The token ID from the frontend (e.g., 'tok_visa')
            description: `KidzArt Order - ${productId}`,
        });

        if (!charge.paid) {
            throw new Error("Payment declined");
        }

        // ---------------------------------------------------------
        // STEP 2: CREATE ORDER IN PRINTFUL
        // ---------------------------------------------------------
        const orderData = {
            recipient: {
                name: recipient.name,
                address1: recipient.address1, // ... (rest of simple mapping)
                city: recipient.city,
                state_code: recipient.state,
                country_code: recipient.country,
                zip: recipient.zip
            },
            items: [
                {
                    variant_id: productId,
                    quantity: 1,
                    files: [{ url: artworkUrl }]
                }
            ]
        };

        const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('PRINTFUL_API_KEY')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Printful Error: ${JSON.stringify(data)}`);
        }

        return new Response(
            JSON.stringify({ success: true, orderId: data.result.id, chargeId: charge.id }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
});
