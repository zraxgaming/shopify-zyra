import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const ZIINA_API_KEY = Deno.env.get('ZIINA_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!ZIINA_API_KEY) {
      throw new Error('ZIINA_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { orderData, amount, appliedCoupon, appliedGiftCard } = await req.json();

    const finalAmount = Math.max(0, amount);

    console.log('Creating order for user:', user.id);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: finalAmount,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'ziina',
        shipping_address: orderData,
        customer_email: user.email,
        customer_name: orderData.name || user.user_metadata?.full_name
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log('Order created:', order.id);

    // Add order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.error('Order items error:', itemsError);
        throw new Error(`Failed to add order items: ${itemsError.message}`);
      }
    }

    // Update coupon usage if applied
    if (appliedCoupon) {
      await supabase
        .from('coupons')
        .update({ used_count: appliedCoupon.used_count + 1 })
        .eq('id', appliedCoupon.id);
    }

    // Update gift card balance if applied
    if (appliedGiftCard) {
      const usedAmount = Math.min(appliedGiftCard.current_amount, finalAmount);
      await supabase
        .from('gift_cards')
        .update({ current_amount: appliedGiftCard.current_amount - usedAmount })
        .eq('id', appliedGiftCard.id);
    }

    // Create Ziina payment intent
    const aedAmount = Math.round(finalAmount * 3.67 * 100); // Convert to fils

    const ziinaPayload = {
      amount: aedAmount,
      currency_code: 'AED',
      message: `Order #${order.id.slice(-8)}`,
      success_url: `${orderData.origin || 'https://www.shopzyra.site'}/order-success/${order.id}`,
      cancel_url: `${orderData.origin || 'https://www.shopzyra.site'}/checkout`,
      failure_url: `${orderData.origin || 'https://www.shopzyra.site'}/checkout`
    };

    console.log('Creating Ziina payment intent:', ziinaPayload);

    const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZIINA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ziinaPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ziina API error:', response.status, errorText);
      throw new Error(`Payment API error: ${response.status}`);
    }

    const ziinaData = await response.json();
    console.log('Ziina response:', ziinaData);

    if (ziinaData.payment_url || ziinaData.redirect_url) {
      // Update order with payment ID
      await supabase
        .from('orders')
        .update({
          payment_intent_id: ziinaData.id
        })
        .eq('id', order.id);

      return new Response(
        JSON.stringify({
          orderId: order.id,
          paymentUrl: ziinaData.payment_url || ziinaData.redirect_url,
          paymentId: ziinaData.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('No redirect URL received from payment provider');
    }
  } catch (error: any) {
    console.error('Error in process-ziina-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Payment processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
