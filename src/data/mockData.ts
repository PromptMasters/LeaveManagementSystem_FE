import { Employee, LeaveRequest } from '@/types/leave';

export const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    department: 'Phát triển',
    position: 'Kỹ sư phần mềm',
    totalLeaveDays: 12,
    usedLeaveDays: 5,
    remainingLeaveDays: 7,
    isManager: false,
  },
  {
    id: 'emp2',
    name: 'Trần Thị Bình',
    email: 'binh.tran@company.com',
    department: 'Phát triển',
    position: 'Trưởng phòng',
    totalLeaveDays: 12,
    usedLeaveDays: 3,
    remainingLeaveDays: 9,
    isManager: true,
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'req1',
    employeeId: 'emp1',
    employeeName: 'Nguyễn Văn An',
    leaveType: 'annual',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    days: 3,
    reason: 'Du lịch gia đình',
    status: 'pending',
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'req2',
    employeeId: 'emp1',
    employeeName: 'Nguyễn Văn An',
    leaveType: 'sick',
    startDate: '2025-10-15',
    endDate: '2025-10-16',
    days: 2,
    reason: 'Ốm',
    status: 'approved',
    createdAt: '2025-10-14T08:00:00Z',
    reviewedAt: '2025-10-14T09:00:00Z',
    reviewedBy: 'Trần Thị Bình',
  },
];
