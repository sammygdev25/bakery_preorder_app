import type { Category } from '../types';
import { Section } from '../components/ui';
import { Icon } from '../components/icons';

interface MenuFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export default function MenuFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
  sort,
  onSortChange,
}: MenuFiltersProps) {
  return (
    <Section tight>
      <div className="ds-filters">
        <div className="ds-field" style={{ flex: 1 }}>
          <label className="ds-label" htmlFor="menu-search">
            Search the case
          </label>
          <div className="ds-cluster">
            <Icon name="search" size={18} />
            <input
              id="menu-search"
              className="input"
              type="text"
              placeholder="Search cakes, pastries, breads..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="menu-category">
            Category
          </label>
          <select
            id="menu-category"
            className="input"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
          >
            <option value="">All treats</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="menu-sort">
            Sort by
          </label>
          <select
            id="menu-sort"
            className="input"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Freshly added</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>
    </Section>
  );
}