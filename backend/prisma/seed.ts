import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // A seeded database is never seeded twice (the image runs this on every boot with SEED_DEMO=1).
  if ((await prisma.user.count()) > 0 && process.env.SEED_FORCE !== '1') {
    console.log('Seed skipped: the database already has users (SEED_FORCE=1 seeds anyway).');
    return;
  }

  // Create demo user
  // The demo password is this project's own (SEED_DEMO_PASSWORD in backend/.env, made at generation, never shipped):
  // no generated app shares a known password. Without it there are no demo accounts and no demo data.
  const demoPassword = process.env.SEED_DEMO_PASSWORD || '';
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD is not set: no demo accounts and no demo data.');
    return;
  }
  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { isStaff: true },
    create: {
      isStaff: true,
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // Create demo staff user (staff, the same demo password)
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      username: 'staff',
      email: 'staff@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'Staff',
      isStaff: true,
    },
  });

  // Domain seed data
  try {
    await prisma.category.create({ data: { name: 'Celebration Cakes', slug: 'celebration-cakes' } });
    await prisma.category.create({ data: { name: 'Cupcakes', slug: 'cupcakes' } });
    await prisma.category.create({ data: { name: 'Breakfast Pastries', slug: 'breakfast-pastries' } });
    await prisma.category.create({ data: { name: 'Artisan Breads', slug: 'artisan-breads' } });
    await prisma.category.create({ data: { name: 'Cookies', slug: 'cookies' } });
    await prisma.category.create({ data: { name: 'Pies & Tarts', slug: 'pies-and-tarts' } });
    await prisma.category.create({ data: { name: 'Wedding Cakes', slug: 'wedding-cakes' } });
    await prisma.category.create({ data: { name: 'Seasonal Specials', slug: 'seasonal-specials' } });
    await prisma.category.create({ data: { name: 'Gluten-Free', slug: 'gluten-free' } });
    await prisma.category.create({ data: { name: 'Macarons', slug: 'macarons' } });
  } catch (e) { console.warn('[seed] Category skipped:', e); }
  try {
    await prisma.product.create({ data: { name: 'Chocolate Fudge Celebration Cake', description: 'Rich layered chocolate cake with ganache frosting, perfect for birthdays and anniversaries.', price: 19.99, imageUrl: '/img/products/chocolate-fudge-celebration-cake.jpg', categoryId: 1, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Vanilla Bean Cupcake Dozen', description: 'A dozen fluffy vanilla cupcakes topped with buttercream swirls and sprinkles.', price: 29.99, imageUrl: '/img/products/vanilla-bean-cupcake-dozen.jpg', categoryId: 2, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Butter Croissant', description: 'Flaky, golden French-style croissant baked fresh every morning.', price: 39.99, imageUrl: '/img/products/butter-croissant.jpg', categoryId: 3, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Sourdough Boule', description: 'Crusty artisan sourdough with a tangy crumb, naturally fermented for 24 hours.', price: 49.99, imageUrl: '/img/products/sourdough-boule.jpg', categoryId: 4, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Classic Chocolate Chip Cookies', description: 'Chewy cookies loaded with semi-sweet chocolate chunks and sea salt.', price: 59.99, imageUrl: '/img/products/classic-chocolate-chip-cookies.jpg', categoryId: 5, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Salted Caramel Apple Pie', description: 'Spiced apple filling topped with a buttery lattice crust and caramel drizzle.', price: 69.99, imageUrl: '/img/products/salted-caramel-apple-pie.jpg', categoryId: 6, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Ivory Rose Wedding Cake', description: 'Three-tier vanilla almond cake decorated with handcrafted sugar roses.', price: 79.99, imageUrl: '/img/products/ivory-rose-wedding-cake.jpg', categoryId: 7, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Pumpkin Spice Loaf', description: 'Moist autumn loaf cake spiced with cinnamon, nutmeg, and clove.', price: 89.99, imageUrl: '/img/products/pumpkin-spice-loaf.jpg', categoryId: 8, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Gluten-Free Lemon Cake', description: 'Light and zesty lemon cake made with almond flour, completely gluten-free.', price: 99.99, imageUrl: '/img/products/gluten-free-lemon-cake.jpg', categoryId: 9, isFeatured: true, isAvailable: true } });
    await prisma.product.create({ data: { name: 'Assorted French Macarons', description: 'A colorful box of twelve delicate macarons in rotating seasonal flavors.', price: 109.99, imageUrl: '/img/products/assorted-french-macarons.jpg', categoryId: 10, isFeatured: true, isAvailable: true } });
  } catch (e) { console.warn('[seed] Product skipped:', e); }
  try {
    await prisma.order.create({ data: { orderNumber: 'BK-10234', userId: 1, pickupDate: new Date(), status: 'active', totalAmount: 19.99, stripePaymentIntent: 'pi_3Oa1Lk2eZvKYlo2C1gA00123' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10235', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 29.99, stripePaymentIntent: 'pi_3Oa1Mn2eZvKYlo2C1hB00456' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10236', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 39.99, stripePaymentIntent: 'pi_3Oa1Nq2eZvKYlo2C1iC00789' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10237', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 49.99, stripePaymentIntent: 'pi_3Oa1Ot2eZvKYlo2C1jD01012' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10238', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 59.99, stripePaymentIntent: 'pi_3Oa1Pw2eZvKYlo2C1kE01345' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10239', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 69.99, stripePaymentIntent: 'pi_3Oa1Qz2eZvKYlo2C1lF01678' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10240', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 79.99, stripePaymentIntent: 'pi_3Oa1Rc2eZvKYlo2C1mG01901' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10241', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 89.99, stripePaymentIntent: 'pi_3Oa1Sf2eZvKYlo2C1nH02234' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10242', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 99.99, stripePaymentIntent: 'pi_3Oa1Ti2eZvKYlo2C1oI02567' } });
    await prisma.order.create({ data: { orderNumber: 'BK-10243', userId: 2, pickupDate: new Date(), status: 'active', totalAmount: 109.99, stripePaymentIntent: 'pi_3Oa1Ul2eZvKYlo2C1pJ02890' } });
  } catch (e) { console.warn('[seed] Order skipped:', e); }
  try {
    await prisma.orderItem.create({ data: { orderId: 1, productId: 1, quantity: 10, priceAtOrder: 19.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 20, priceAtOrder: 29.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 30, priceAtOrder: 39.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 40, priceAtOrder: 49.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 50, priceAtOrder: 59.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 60, priceAtOrder: 69.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 70, priceAtOrder: 79.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 80, priceAtOrder: 89.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 90, priceAtOrder: 99.99 } });
    await prisma.orderItem.create({ data: { orderId: 2, productId: 2, quantity: 100, priceAtOrder: 109.99 } });
  } catch (e) { console.warn('[seed] OrderItem skipped:', e); }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
