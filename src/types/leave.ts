export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = 'annual' | 'sick' | 'personal' | 'unpaid';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  leaveType: LeaveType | null;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  totalLeaveDays: number;
  usedLeaveDays: number;
  remainingLeaveDays: number;
  isManager: boolean;
}
