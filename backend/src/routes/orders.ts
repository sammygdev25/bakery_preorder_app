import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  pickupDate: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${stamp}-${rand}`.slice(0, 20);
}

// GET /api/orders/ (authenticated) - order history for the logged in user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
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
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id (authenticated) - single order with items
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const order = await prisma.order.findFirst({
      where: { id: parsedParams.data.id, userId: req.userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders/ (authenticated) - place a new pre-order with pickup date
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  const pickupDate = new Date(parsed.data.pickupDate);
  if (isNaN(pickupDate.getTime())) {
    return res.status(400).json({ error: 'Invalid pickupDate', code: 'validation_error' });
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
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (!product.isAvailable) {
        return res.status(400).json({ error: `${product.name} is currently unavailable` });
      }
    }

    let totalAmount = 0;
    const itemsData = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const price = Number(product.price);
      totalAmount += price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: price,
      };
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.userId!,
        pickupDate,
        status: 'pending',
        totalAmount,
        items: {
          create: itemsData,
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
    console.error('[Orders] Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;