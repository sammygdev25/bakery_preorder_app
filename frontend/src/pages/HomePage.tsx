import { useEffect, useState, useCallback } from 'react';
import HomeHero from '../components/HomeHero';
import HomeFeatured from '../components/HomeFeatured';
import HomeCategories from '../components/HomeCategories';
import HomeAbout from '../components/HomeAbout';
import HomeCta from '../components/HomeCta';
import { useCart } from '../contexts/CartContext';
import { getProductList, getCategoryList } from '../api';
import type { Product, Category } from '../types';

export default function HomePage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [productList, categoryList] = await Promise.all([
          getProductList(),
          getCategoryList(),
        ]);
        if (!mounted) return;
        setProducts(productList);
        setCategories(categoryList);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1);
    },
    [addItem]
  );

  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const fallback = featured.length >= 6 ? featured : products.slice(0, 8);

  const heroImage = products.find((p) => p.imageUrl)?.imageUrl;

  return (
    <div className="ds-stack-lg">
      <HomeHero imageUrl={heroImage} />
      <HomeFeatured products={fallback} loading={loading} onAddToCart={handleAddToCart} />
      <HomeCategories categories={categories} />
      <HomeAbout />
      <HomeCta />
    </div>
  );
}