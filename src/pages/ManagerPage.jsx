import { useState, useEffect, useMemo } from "react";
import { LeaveRequestDialog } from "@/components/LeaveRequestDialog";
import { LeaveRequestTable } from "@/components/LeaveRequestTable";
import { LeaveRequestFilter } from "@/components/LeaveRequestFilter";
import { StatsCard } from "@/components/StatsCard";
import { CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";

export default function ManagerPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
  });

  // === Fetch API ===
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:8082/leave-request");
      if (!res.ok) throw new Error("Failed to fetch leave requests");
      const data = await res.json();

      // Chuẩn hóa dữ liệu để khớp với giao diện
      const mapped = data.map((item) => ({
        id: String(item.leaveRequestId),                  // <-- sửa
        employeeId: item.requestorName || "N/A",          // <-- sửa
        employeeName: item.requestorName || "Không rõ",   // <-- sửa
        department: item.departmentName || "Chưa cập nhật", // <-- sửa
        title: item.title || "Không có tiêu đề",
        leaveType: item.leaveType || "Khác",              // có giá trị thực
        startDate: item.startDate,
        endDate: item.endDate,
        days: item.totalDays,
        status: item.status?.toLowerCase() || "pending",
        reason: item.reason,
        createdAt: item.createdAt,
      }));
      mapped.sort((a, b) => Number(a.id) - Number(b.id));

      setRequests(mapped);
    } catch (err) {
      console.error("Lỗi khi fetch dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // === Filter Logic ===
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
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
      return true;
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
      const res = await fetch(`http://localhost:8082/leave-request/${id}/status?status=APPROVED`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      await fetchRequests();
      setOpen(false);
      console.log("Đã duyệt yêu cầu:", id);
    } catch (err) {
      console.error("Lỗi khi duyệt:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:8082/leave-request/${id}/status?status=REJECTED`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");
      await fetchRequests();
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
  };

  // === Giao diện ===
  return (
    <div className="p-6 space-y-6 mx-80">
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

      <LeaveRequestFilter onFilterChange={handleFilterChange} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Danh sách yêu cầu nghỉ phép</h2>
        <LeaveRequestTable
          requests={filteredRequests}
          showActions={true}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleView}
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
  );
}
