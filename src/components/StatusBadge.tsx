import { LeaveStatus } from '@/types/leave';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: LeaveStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  // normalize API enum (may be 'PENDING'|'APPROVED'|'REJECTED') to lowercase keys
  const key = String(status).toLowerCase();

  const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'warning' | 'success' }> = {
    pending: {
      label: 'Chờ duyệt',
      variant: 'warning',
    },
    approved: {
      label: 'Đã duyệt',
      variant: 'success',
    },
    rejected: {
      label: 'Từ chối',
      variant: 'destructive',
    },
  };

  const config = statusConfig[key] ?? { label: String(status), variant: 'default' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
