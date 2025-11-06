import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, RotateCcw } from 'lucide-react';

interface LeaveRequestFilterProps {
  onFilterChange: (filters: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
  }) => void;
}

export const LeaveRequestFilter = ({ onFilterChange }: LeaveRequestFilterProps) => {  const [filters, setFilters] = useState({
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  const handleInputChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  const handleReset = () => {
    const resetFilters = {
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      status: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="filter-id">ID</Label>
            <Input
              id="filter-id"
              placeholder="Tìm theo ID..."
              value={filters.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filter-name">Tên nhân viên</Label>
            <Input
              id="filter-name"
              placeholder="Tìm theo tên..."
              value={filters.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filter-start">Từ ngày</Label>
            <Input
              id="filter-start"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filter-end">Đến ngày</Label>
            <Input
              id="filter-end"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filter-status">Trạng thái</Label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Đang chờ</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};