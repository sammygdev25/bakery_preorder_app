import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface MenuPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MenuPagination({ currentPage, totalPages, onPageChange }: MenuPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="ds-pagination" aria-label="Menu pagination">
      <Button
        variant="ghost"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>
      <span className="ds-muted">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </nav>
  );
}