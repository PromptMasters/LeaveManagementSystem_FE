import { LeaveRequest } from '@/types/leave';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onView?: (id: string) => void;
}

const leaveTypeLabels = {
  annual: 'Phép năm',
  sick: 'Ốm',
  personal: 'Việc riêng',
  unpaid: 'Không lương',
};

export const LeaveRequestTable = ({
  requests,
  showActions = false,
  onApprove,
  onReject,
  onView,
}: LeaveRequestTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Loại phép</TableHead>
            <TableHead>Từ ngày</TableHead>
            <TableHead>Đến ngày</TableHead>
            <TableHead>Số ngày</TableHead>
            <TableHead>Trạng thái</TableHead>
            {showActions && <TableHead className="text-right">Thao tác</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center text-muted-foreground">
                Không có đơn nghỉ phép nào
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.employeeName}</TableCell>
                <TableCell>{leaveTypeLabels[request.leaveType]}</TableCell>
                <TableCell>{format(new Date(request.startDate), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                <TableCell>{format(new Date(request.endDate), 'dd/MM/yyyy', { locale: vi })}</TableCell>
                <TableCell>{request.days} ngày</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApprove?.(request.id)}
                            className="text-success hover:bg-success hover:text-success-foreground"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject?.(request.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => onView?.(request.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
