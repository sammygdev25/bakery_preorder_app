import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { AuthRequest } from '../middleware/auth';

// ---------- helpers ----------
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// ---------- validation schemas ----------
const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(120).optional(),
});

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional().default(''),
  price: z.number().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  categoryId: z.number().int().positive(),
  isFeatured: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
});

const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  featured: z
    .enum(['true', 'false'])
    .optional(),
  available: z
    .enum(['true', 'false'])
    .optional(),
});

// ---------- categories ----------
export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    console.error('[Catalog] Error listing categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

export async function createCategory(req: AuthRequest, res: Response) {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);

    const existing = await prisma.category.findFirst({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'A category with this slug already exists', code: 'validation_error' });
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('[Catalog] Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
}

// ---------- products ----------
export async function listProducts(req: Request, res: Response) {
  const parsedQuery = listProductsQuerySchema.safeParse(req.query);
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
      where.isFeatured = featured === 'true';
    }
    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error('[Catalog] Error listing products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getFeaturedProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error('[Catalog] Error listing featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
}

export async function getProductById(req: Request, res: Response) {
  const idSchema = z.coerce.number().int().positive();
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res.status(400).json({ error: 'Invalid product id', code: 'validation_error' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parsedId.data },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('[Catalog] Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function createProduct(req: AuthRequest, res: Response) {
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
        description: parsed.data.description,
        price: parsed.data.price,
        imageUrl: parsed.data.imageUrl,
        categoryId: parsed.data.categoryId,
        isFeatured: parsed.data.isFeatured,
        isAvailable: parsed.data.isAvailable,
      },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('[Catalog] Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}