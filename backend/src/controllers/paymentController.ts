import { Request, Response } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import prisma from '../database';
import { AuthRequest } from '../middleware/auth';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const checkoutSchema = z.object({
  orderId: z.number().int().positive(),
});

// POST /api/payments/checkout/
export async function checkout(req: AuthRequest, res: Response) {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to pay for this order' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ error: 'Order has already been paid' });
    }

    const amountInCents = Math.round(Number(order.totalAmount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Bakery order ${order.orderNumber}`,
              description: `Pickup on ${new Date(order.pickupDate).toLocaleString()}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: String(order.id),
        orderNumber: order.orderNumber,
      },
      success_url: `${frontendUrl}/orders?payment=success`,
      cancel_url: `${frontendUrl}/checkout?payment=cancelled`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[Payments] Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

// POST /api/payments/webhook/
export async function webhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string | undefined;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing Stripe signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error('[Payments] Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId ? parseInt(session.metadata.orderId, 10) : null;
      const paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

      if (orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order && order.status !== 'paid') {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'paid',
              stripePaymentIntent: paymentIntent || '',
            },
          });
          console.log(`[Payments] Order ${orderId} marked as paid`);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Payments] Webhook handling error:', error);
    res.status(500).json({ error: 'Failed to process webhook event' });
  }
}
