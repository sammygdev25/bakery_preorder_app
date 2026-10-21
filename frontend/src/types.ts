/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── User ──
export interface User {
  id: number;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  passwordHash: z.string().nullable(),
  googleId: z.string().nullable(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Category ──
export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export const CategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string(),
}).passthrough();

// ── Product ──
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: Category;
  categoryId: number;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ProductSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  imageUrl: z.string().url(),
  category: z.custom<Category>((v) => typeof v === 'object' && v !== null).optional(),
  categoryId: z.coerce.number().int(),
  isFeatured: z.boolean(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Order ──
export interface Order {
  id: number;
  orderNumber: string;
  user?: User;
  userId: number;
  pickupDate: string;
  status: string;
  totalAmount: number;
  stripePaymentIntent: string | null;
  createdAt: string;
  updatedAt: string;
}

export const OrderSchema = z.object({
  id: z.coerce.number(),
  orderNumber: z.string(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  pickupDate: z.string(),
  status: z.string(),
  totalAmount: z.coerce.number(),
  stripePaymentIntent: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── OrderItem ──
export interface OrderItem {
  id: number;
  order?: Order;
  orderId: number;
  product?: Product;
  productId: number;
  quantity: number;
  priceAtOrder: number;
  createdAt: string;
}

export const OrderItemSchema = z.object({
  id: z.coerce.number(),
  order: z.custom<Order>((v) => typeof v === 'object' && v !== null).optional(),
  orderId: z.coerce.number().int(),
  product: z.custom<Product>((v) => typeof v === 'object' && v !== null).optional(),
  productId: z.coerce.number().int(),
  quantity: z.coerce.number().int(),
  priceAtOrder: z.coerce.number(),
  createdAt: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

