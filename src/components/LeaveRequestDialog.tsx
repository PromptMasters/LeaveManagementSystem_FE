import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CheckCircle2, XCircle, Calendar, User, Building2, FileText } from "lucide-react";

interface LeaveRequestDialogProps {
  request: LeaveRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  days: number;
  status: "approved" | "rejected" | "pending";
  reason: string;
  submittedDate: string;
}

export function LeaveRequestDialog({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: LeaveRequestDialogProps) {
  
  if (!request) return null;

  const isPending = request.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chi tiết yêu cầu nghỉ phép</DialogTitle>
          <DialogDescription>
            Xem xét và phê duyệt yêu cầu nghỉ phép của nhân viên
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trạng thái</span>
            <Badge
              variant={
                request.status === "approved"
                  ? "default"
                  : request.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
              className={
                request.status === "approved"
                  ? "bg-success text-success-foreground"
                  : request.status === "pending"
                  ? "bg-warning text-warning-foreground"
                  : ""
              }
            >
              {request.status === "approved"
                ? "Đã duyệt"
                : request.status === "rejected"
                ? "Từ chối"
                : "Đang chờ"}
            </Badge>
          </div>

          <Separator />

          {/* Employee Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Tên nhân viên</p>
                <p className="text-base font-medium">{request.employeeName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phòng ban</p>
                <p className="text-base font-medium">{request.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Loại nghỉ</p>
                <p className="text-base font-medium">{request.leaveType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Thời gian nghỉ</p>
                <p className="text-base font-medium">
                  {format(new Date(request.startDate), "dd/MM/yyyy", { locale: vi })} -{" "}
                  {request.days} ngày
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Lý do nghỉ phép</p>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm leading-relaxed">{request.reason}</p>
            </div>
          </div>

          {/* Submitted Date */}
          <div className="text-xs text-muted-foreground">
            Đã gửi: {format(new Date(request.submittedDate), "dd/MM/yyyy HH:mm", { locale: vi })}
          </div>
        </div>

        {isPending && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => onReject(request.id)}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button
              onClick={() => onApprove(request.id)}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Duyệt
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
