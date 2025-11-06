import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  limit?: number;
  totalRecords?: number;
  onPageSizeChange?: (size: number) => void;
}

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export const PageSizeSelector = ({ pageSize, onPageSizeChange, className = "" }: PageSizeSelectorProps) => {
  const pageSizes = [5, 10, 15, 25, 50];
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Hiển thị:</span>
      <select 
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
      >
        {pageSizes.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
      <span className="text-sm text-muted-foreground">/ trang</span>
    </div>
  );
};

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "", 
  limit = 15, 
  totalRecords = 0,
  onPageSizeChange
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // If total pages is 7 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show current page and surrounding pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page (if not already shown)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalRecords);  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startRecord} - {endRecord} của {totalRecords} kết quả (Trang {currentPage}/{totalPages})
          </div>
          {onPageSizeChange && (
            <PageSizeSelector 
              pageSize={limit} 
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        
        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={index} className="px-2 py-1 text-muted-foreground">
                ...
              </span>
            );
          }
          
          return (
            <Button
              key={index}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum as number)}
            >
              {pageNum}
            </Button>
          );
        })}
          <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Tiếp
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {totalPages > 5 && (
          <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
            <span className="text-sm text-muted-foreground">Đến trang:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                    e.target.value = '';
                  }
                }
              }}
              placeholder={currentPage.toString()}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
