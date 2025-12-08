// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions
// 1. supabase functions deploy create-print-order
// 2. Set secrets: supabase secrets set PRINTFUL_API_KEY=your_key

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PRINTFUL_API_URL = 'https://api.printful.com';

serve(async (req) => {
    try {
        // 1. Get the request data (Artwork info, Shipping Address, Payment Token)
        const { artworkUrl, recipient, productId, stripeToken } = await req.json();

        // ---------------------------------------------------------
        // STEP 1: VALIDATE PAYMENT (Stripe)
        // ---------------------------------------------------------
        // In a real app, you would verify the Stripe payment intent here before proceeding.
        // const payment = await stripe.paymentIntents.confirm(stripeToken)...
        // if (!payment.success) throw new Error("Payment Failed");


        // ---------------------------------------------------------
        // STEP 2: CREATE ORDER IN PRINTFUL
        // ---------------------------------------------------------
        // See docs: https://developers.printful.com/docs/#operation/createOrder
        const orderData = {
            recipient: {
                name: recipient.name,
                address1: recipient.address1,
                city: recipient.city,
                state_code: recipient.state,
                country_code: recipient.country,
                zip: recipient.zip
            },
            items: [
                {
                    variant_id: productId, // e.g., 1324 for a specific Mug variant
                    quantity: 1,
                    files: [
                        {
                            url: artworkUrl // The URL of the kid's art
                        }
                    ]
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

        // ---------------------------------------------------------
        // STEP 3: RETURN SUCCESS
        // ---------------------------------------------------------
        return new Response(
            JSON.stringify({ success: true, orderId: data.result.id }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
})
