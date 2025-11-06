import { LeaveStatus } from '@/types/leave';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: LeaveStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: 'Đang chờ',
      variant: 'warning' as const,
      className: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    approved: {
      label: 'Đã duyệt',
      variant: 'success' as const,
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    rejected: {
      label: 'Từ chối',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 border-red-200'
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
};
