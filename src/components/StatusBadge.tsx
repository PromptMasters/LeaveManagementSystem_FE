import { LeaveStatus } from '@/types/leave';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: LeaveStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: 'Chờ duyệt',
      variant: 'warning' as const,
    },
    approved: {
      label: 'Đã duyệt',
      variant: 'success' as const,
    },
    rejected: {
      label: 'Từ chối',
      variant: 'destructive' as const,
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
