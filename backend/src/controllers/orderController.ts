import { Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { AuthRequest } from '../middleware/auth';

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  pickupDate: z.string().min(1, 'Pickup date is required'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, '0');
  return `BK-${timestamp}-${random}`;
}

// GET /api/orders/ - list the current user's orders (newest first)
export async function listOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('[Orders] Error listing orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

// GET /api/orders/:id - fetch a single order owned by the current user
export async function getOrder(req: AuthRequest, res: Response) {
  const idParam = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!idParam.success) {
    return res.status(400).json({ error: 'Invalid order id', code: 'validation_error' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: idParam.data },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order || order.userId !== req.userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('[Orders] Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
}

// POST /api/orders/ - place a new pre-order with pickup date scheduling
export async function createOrder(req: AuthRequest, res: Response) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid order data', code: 'validation_error', issues: parsed.error.issues });
  }

  const pickupDate = new Date(parsed.data.pickupDate);
  if (Number.isNaN(pickupDate.getTime())) {
    return res.status(400).json({ error: 'Invalid pickup date', code: 'validation_error' });
  }
  if (pickupDate.getTime() < Date.now()) {
    return res.status(400).json({ error: 'Pickup date must be in the future', code: 'validation_error' });
  }

  try {
    const productIds = parsed.data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of parsed.data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found`, code: 'validation_error' });
      }
      if (!product.isAvailable) {
        return res.status(400).json({ error: `${product.name} is currently unavailable`, code: 'validation_error' });
      }
    }

    const totalAmount = parsed.data.items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.userId!,
        pickupDate,
        status: 'pending',
        totalAmount,
        stripePaymentIntent: '',
        items: {
          create: parsed.data.items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              priceAtOrder: product.price,
            };
          }),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('[Orders] Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}
