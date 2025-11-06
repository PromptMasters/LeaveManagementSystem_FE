import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveRequestTable } from "@/components/LeaveRequestTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/StatsCard";
import { CalendarDays, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { LeaveRequest, Employee } from "@/types/leave";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


function mapApiToLeaveRequest(api: any): LeaveRequest {
  return {
    id: String(api.leaveRequestId),
    employeeId: '', // Will be set from auth context
    employeeName: api.requestorName,
    leaveType: api.leaveType as LeaveRequest['leaveType'],
    reason: api.reason,
    startDate: api.startDate,
    endDate: api.endDate,
    days: api.totalDays,
    status: api.status as LeaveRequest['status'],
    createdAt: api.createdAt,
    reviewedAt: api.updatedAt || undefined,
    reviewedBy: undefined,
    reviewNote: api.title, // Using title as review note since we don't have a separate field
  };
}


export const MyRequests = () => {
  // Giả lập userId, thực tế lấy từ context đăng nhập
  const userId = 2;
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Effect to filter requests when date range or requests change
  useEffect(() => {
    let filtered = requests.filter((request) => {
      if (!fromDate && !toDate) return true;
      const requestStartDate = new Date(request.startDate);
      const requestEndDate = new Date(request.endDate);
      
      if (fromDate && toDate) {
        return (
          (requestStartDate >= fromDate && requestStartDate <= toDate) ||
          (requestEndDate >= fromDate && requestEndDate <= toDate) ||
          (requestStartDate <= fromDate && requestEndDate >= toDate)
        );
      }
      if (fromDate) {
        return requestEndDate >= fromDate;
      }
      if (toDate) {
        return requestStartDate <= toDate;
      }
      return true;
    });

    // apply status filter if set
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [fromDate, toDate, requests, statusFilter]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8082/leave-request/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu');
        return res.json();
      })
      .then(data => {
        // Tạo mock employee data vì API không trả về thông tin này
        setCurrentEmployee({
          id: String(userId),
          name: data[0]?.requestorName || '',
          email: '',
          department: data[0]?.departmentName || '',
          position: '',
          totalLeaveDays: 12,
          usedLeaveDays: 4,
          remainingLeaveDays: 8,
          isManager: false
        });
        
        if (Array.isArray(data)) {
          let mapped = data.map(mapApiToLeaveRequest);
          mapped = mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRequests(mapped);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);


  // Filter requests by status from filtered requests
  const pendingRequests = filteredRequests.filter((r) => r.status === 'PENDING');
  const approvedRequests = filteredRequests.filter((r) => r.status === 'APPROVED');
  const rejectedRequests = filteredRequests.filter((r) => r.status === 'REJECTED');

  // Handle sorting
  const handleSort = (value: "date" | "status") => {
    setSortBy(value);
    const sortedRequests = [...requests];
    if (value === "date") {
      sortedRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      sortedRequests.sort((a, b) => {
        const statusOrder = { PENDING: 1, APPROVED: 2, REJECTED: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    }
    setRequests(sortedRequests);
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;
  }
  if (!currentEmployee) {
    return <div className="p-8 text-center text-red-500">Không tìm thấy thông tin nhân viên</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Đơn nghỉ phép của tôi</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Tổng số ngày phép"
          value={currentEmployee.totalLeaveDays}
          icon={CalendarDays}
          description="Số ngày phép được cấp trong năm"
        />
        <StatsCard
          title="Đã sử dụng"
          value={currentEmployee.usedLeaveDays}
          icon={Clock}
          description="Số ngày phép đã sử dụng"
        />
        <StatsCard
          title="Còn lại"
          value={currentEmployee.remainingLeaveDays}
          icon={CheckCircle2}
          description="Số ngày phép còn lại"
          variant={currentEmployee.remainingLeaveDays < 5 ? 'warning' : 'default'}
        />
        <StatsCard
          title="Đang chờ duyệt"
          value={pendingRequests.length}
          icon={AlertCircle}
          description="Số đơn đang chờ phê duyệt"
          variant={pendingRequests.length > 0 ? 'warning' : 'default'}
        />
      </div>

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <CardTitle>Sắp xếp theo</CardTitle>
              <Select value={sortBy} onValueChange={(value: "date" | "status") => handleSort(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn tiêu chí sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Ngày tạo</SelectItem>
                  <SelectItem value="status">Trạng thái</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                    <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                    <SelectItem value="REJECTED">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Từ:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <input
                      type="date"
                      className="w-[200px] px-3 py-2 text-sm rounded-md border border-input"
                      value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
                      max={toDate ? format(toDate, "yyyy-MM-dd") : undefined}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : undefined;
                        setFromDate(date);
                      }}
                    />
                  </PopoverTrigger>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Đến:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <input
                      type="date"
                      className="w-[200px] px-3 py-2 text-sm rounded-md border border-input"
                      value={toDate ? format(toDate, "yyyy-MM-dd") : ""}
                      min={fromDate ? format(fromDate, "yyyy-MM-dd") : undefined}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : undefined;
                        setToDate(date);
                      }}
                    />
                  </PopoverTrigger>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ALL" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ALL">Tất cả ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="PENDING">Chờ duyệt ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="APPROVED">Đã duyệt ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="REJECTED">Từ chối ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ALL">
          <Card>
            <CardHeader>
              <CardTitle>Tất cả đơn nghỉ phép</CardTitle>
              <CardDescription>Danh sách tất cả các đơn nghỉ phép của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={filteredRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="PENDING">
          <Card>
            <CardHeader>
              <CardTitle>Đơn chờ duyệt</CardTitle>
              <CardDescription>Các đơn đang chờ quản lý phê duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={pendingRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="APPROVED">
          <Card>
            <CardHeader>
              <CardTitle>Đơn đã duyệt</CardTitle>
              <CardDescription>Các đơn đã được phê duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={approvedRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="REJECTED">
          <Card>
            <CardHeader>
              <CardTitle>Đơn bị từ chối</CardTitle>
              <CardDescription>Các đơn đã bị từ chối</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={rejectedRequests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default MyRequests;
