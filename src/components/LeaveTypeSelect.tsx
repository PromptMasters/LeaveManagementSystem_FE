import { LeaveType } from '@/types/leave';

interface LeaveTypeSelectProps {
  value: LeaveType;
  onChange: (value: LeaveType) => void;
}

const leaveTypes = {
  ANNUAL: 'Nghỉ phép năm',
  SICK: 'Nghỉ ốm',
  UNPAID: 'Nghỉ không lương',
  MATERNITY: 'Nghỉ thai sản',
  DEFAULT: 'Khác',
};

export const LeaveTypeSelect = ({ value, onChange }: LeaveTypeSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as LeaveType)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {Object.entries(leaveTypes).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
};
