import { useState, useEffect, useMemo } from "react";
import { LeaveRequestDialog } from "@/components/LeaveRequestDialog";
import { LeaveRequestTable } from "@/components/LeaveRequestTable";
import { LeaveRequestFilter } from "@/components/LeaveRequestFilter";
import { StatsCard } from "@/components/StatsCard";
import { Pagination, PageSizeSelector } from "@/components/Pagination";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";

export default function ManagerPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);  const [filters, setFilters] = useState({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "",
  });const [paging, setPaging] = useState({
    page: 1,
    limit: 15,
    totalPages: 1,
    totalRecords: 0
  });  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(15);  // === Fetch API ===
  const fetchRequests = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8087/leave-request?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch leave requests");
      const response = await res.json();

      // Chuẩn hóa dữ liệu để khớp với giao diện
      const mapped = response.data.map((item) => ({
        id: String(item.leaveRequestId),
        employeeId: item.requestorName || "N/A",
        employeeName: item.requestorName || "Không rõ",
        department: item.departmentName || "Chưa cập nhật",
        title: item.title || "Không có tiêu đề",
        leaveType: item.leaveType || "Khác",
        startDate: item.startDate,
        endDate: item.endDate,
        days: item.totalDays,
        status: item.status?.toLowerCase() || "pending",
        reason: item.reason,
        createdAt: item.createdAt,
      }));      // Sắp xếp dữ liệu: PENDING trước, sau đó theo ID
      const sortedMapped = mapped.sort((a, b) => {
        // Ưu tiên PENDING trước
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        
        // Sau đó sắp xếp theo ID
        return Number(a.id) - Number(b.id);
      });

      setRequests(sortedMapped);
      setPaging({
        ...response.paging,
        totalRecords: response.paging.totalPages === 1 
          ? mapped.length 
          : (response.paging.totalPages - 1) * response.paging.limit + mapped.length
      });
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    fetchRequests(currentPage, pageSize);
  }, [currentPage, pageSize]);
  // === Pagination handlers ===
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paging.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };  // === Filter Logic ===
  const filteredRequests = useMemo(() => {
    let filtered = requests.filter((request) => {
      if (filters.id && !request.id.toString().toLowerCase().includes(filters.id.toLowerCase())) {
        return false;
      }
      if (filters.name && !request.employeeName.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.startDate && request.startDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && request.startDate > filters.endDate) {
        return false;
      }
      if (filters.status && request.status !== filters.status) {
        return false;
      }
      return true;
    });

    // Sắp xếp để PENDING hiển thị trước, sau đó sắp xếp theo ID
    return filtered.sort((a, b) => {
      // Ưu tiên PENDING trước
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      
      // Sau đó sắp xếp theo ID
      return Number(a.id) - Number(b.id);
    });
  }, [requests, filters]);

  // === Thống kê ===
  const stats = {
    approved: filteredRequests.filter((r) => r.status === "approved").length,
    rejected: filteredRequests.filter((r) => r.status === "rejected").length,
    pending: filteredRequests.filter((r) => r.status === "pending").length,
    total: filteredRequests.length,
  };
  // === Hành động ===
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8087/leave-request/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "APPROVED",
          rejectedReason: ""
        })
      });      
      if (!res.ok) throw new Error("Cập nhật thất bại");
      await fetchRequests(currentPage, pageSize);
      setOpen(false);
      console.log("Đã duyệt yêu cầu:", id);
    } catch (err) {
      console.error("Lỗi khi duyệt:", err);
    }
  };
  const handleReject = async (id, rejectedReason = "") => {
    try {
      const res = await fetch(`http://localhost:8087/leave-request/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          rejectedReason: rejectedReason
        })
      });      
      if (!res.ok) throw new Error("Cập nhật thất bại");
      await fetchRequests(currentPage, pageSize);
      setOpen(false);
      console.log("Đã từ chối yêu cầu:", id);
    } catch (err) {
      console.error("Lỗi khi từ chối:", err);
    }
  };

  const handleView = (id) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      setSelectedRequest({
        ...req,
        submittedDate: req.createdAt,
      });
      setOpen(true);
    }
  };
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };  // === Giao diện ===
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 sticky top-0 z-10">
        <Header />
      </div>
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed on left */}
        <div className="flex-shrink-0 h-full">
          <Sidebar />
        </div>
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Quản lý nghỉ phép</h1>
            <p className="text-muted-foreground">
              Theo dõi và quản lý các yêu cầu nghỉ phép của nhân viên
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Đã duyệt"
              value={stats.approved}
              description="Yêu cầu được chấp nhận"
              icon={CheckCircle2}
              color="success"
            />
            <StatsCard
              title="Từ chối"
              value={stats.rejected}
              description="Yêu cầu bị từ chối"
              icon={XCircle}
              color="destructive"
            />
            <StatsCard
              title="Đang chờ"
              value={stats.pending}
              description="Cần xem xét"
              icon={Clock}
              color="warning"
            />
            <StatsCard
              title="Tổng tháng này"
              value={stats.total}
              description="Tổng yêu cầu"
              icon={Calendar}
              color="info"
            />
          </div>

          <LeaveRequestFilter onFilterChange={handleFilterChange} />          <div>
            <h2 className="text-xl font-semibold mb-4">Danh sách yêu cầu nghỉ phép</h2>            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <LeaveRequestTable
                requests={filteredRequests}
                showActions={true}
                onApprove={handleApprove}
                onReject={handleReject}
                onView={handleView}
              />
            )}            <Pagination
              currentPage={currentPage}
              totalPages={paging.totalPages}
              onPageChange={handlePageChange}
              limit={pageSize}
              totalRecords={paging.totalRecords}
              onPageSizeChange={handlePageSizeChange}
              className="mt-4"
            />
          </div>

          <LeaveRequestDialog
            request={selectedRequest}
            open={open}
            onOpenChange={setOpen}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}
