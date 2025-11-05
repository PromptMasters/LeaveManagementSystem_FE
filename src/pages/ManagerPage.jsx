import { LeaveRequestDialog } from "@/components/LeaveRequestDialog";
import { useState } from "react";

export default function ManagerPage() {
   const mockRequest = {
    id: "1",
    employeeName: "Nguyễn Văn A",
    department: "Kỹ thuật",
    leaveType: "Nghỉ phép năm",
    startDate: "2025-11-05",
    days: 2,
    status: "pending",
    reason: "Đi du lịch cùng gia đình",
    submittedDate: "2025-11-03T09:00:00",
  };

  const [open, setOpen] = useState(true);
  const handleApprove = (id) => console.log("Duyệt", id);
  const handleReject = (id) => console.log("Từ chối", id);

  return (
    <div>ManagerPage
      <LeaveRequestDialog
              request={mockRequest}
              open={open}
              onOpenChange={setOpen}
              onApprove={handleApprove}
              onReject={handleReject}
            />
    </div>
  )
}