import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="ds-cluster" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onSelectCategory('')}
      >
        All treats
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`btn ${selectedCategory === category.slug ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onSelectCategory(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
export { CategoryFilter };