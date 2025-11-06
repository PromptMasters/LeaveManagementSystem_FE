import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, User, Hash, X, Clock } from "lucide-react";

interface FilterProps {
  onFilterChange: (filters: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
  }) => void;
}

export function LeaveRequestFilter({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      id: "",
      name: "",
      startDate: "",
      endDate: "",
      status: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5" />
          Bộ lọc tìm kiếm
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filter by ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              ID
            </label>
            <Input
              placeholder="Nhập ID..."
              value={filters.id}
              onChange={(e) => handleFilterChange("id", e.target.value)}
            />
          </div>

          {/* Filter by Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Tên nhân viên
            </label>
            <Input
              placeholder="Nhập tên..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
          </div>

          {/* Filter by Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Từ ngày
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          {/* Filter by End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Đến ngày
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          {/* Filter by Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border rounded-md px-3 py-2 w-full text-sm"
            >
              <option value="">Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
