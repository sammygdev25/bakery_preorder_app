import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductList, getCategoryList } from '../api';
import { useCart } from '../contexts/CartContext';
import type { Product, Category } from '../types';
import MenuHeader from '../components/MenuHeader';
import MenuFilters from '../components/MenuFilters';
import MenuGrid from '../components/MenuGrid';
import MenuPagination from '../components/MenuPagination';

const PAGE_SIZE = 9;

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getProductList(), getCategoryList()])
      .then(([productList, categoryList]) => {
        if (!active) return;
        setProducts(productList);
        setCategories(categoryList);
      })
      .catch((err) => console.error('[MenuPage] Error loading catalog:', err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelectCategory = useCallback(
    (slug: string) => {
      setPage(1);
      if (slug) {
        setSearchParams({ category: slug });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isAvailable !== false);
    if (selectedCategory) {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === 'price_asc') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price_desc') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return sorted;
  }, [products, selectedCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch('');
    setSort('newest');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="ds-stack-lg">
      <MenuHeader resultCount={filtered.length} loading={loading} />
      <MenuFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
      />
      <MenuGrid
        products={pageItems}
        loading={loading}
        onAddToCart={addItem}
        onClearFilters={handleClearFilters}
      />
      <MenuPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}