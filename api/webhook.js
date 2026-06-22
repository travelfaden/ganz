const { buffer } = require('micro');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { fulfillCheckoutSession } = require('./_lib/fulfill-checkout');

async function handleStripeWebhook(rawBody, signature) {
  if (!signature) {
    throw new Error('No signature found');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('checkout.session.completed:', session.id);
    await fulfillCheckoutSession(session.id);
  } else {
    console.log('Unhandled Stripe event:', event.type);
  }

  return { received: true };
}

async function webhookHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).send('Webhook Error: No signature found');
  }

  try {
    const rawBody = await buffer(req);
    const result = await handleStripeWebhook(rawBody, signature);
    return res.json(result);
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

webhookHandler.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = webhookHandler;
