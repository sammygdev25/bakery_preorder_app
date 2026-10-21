import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase, alphanumeric and hyphen separated'),
});

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional().default(''),
  price: z.number().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal('')).optional(),
  categoryId: z.number().int().positive(),
  isFeatured: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
});

const productQuerySchema = z.object({
  category: z.string().min(1).optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  available: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
});

// GET /api/categories/ - list all bakery categories (cakes, pastries, etc.)
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('[Catalog] Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories/ (authenticated)
router.post('/categories', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const category = await prisma.category.create({
      data: parsed.data,
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('[Catalog] Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// GET /api/products/ - browse cakes and pastries, optionally filtered by category slug or featured flag
router.get('/products', async (req: Request, res: Response) => {
  const parsedQuery = productQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: parsedQuery.error.issues });
  }
  try {
    const { category, featured, available } = parsedQuery.data;

    const where: Record<string, unknown> = {};
    if (category) {
      where.category = { slug: category };
    }
    if (featured !== undefined) {
      where.isFeatured = featured;
    }
    if (available !== undefined) {
      where.isAvailable = available;
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('[Catalog] Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products/ (authenticated)
router.post('/products', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Category not found', code: 'validation_error' });
    }

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? '',
        price: parsed.data.price,
        imageUrl: parsed.data.imageUrl ?? '',
        categoryId: parsed.data.categoryId,
        isFeatured: parsed.data.isFeatured ?? false,
        isAvailable: parsed.data.isAvailable ?? true,
      },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('[Catalog] Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default router;