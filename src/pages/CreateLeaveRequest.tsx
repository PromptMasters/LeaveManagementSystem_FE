import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LeaveTypeSelect } from '@/components/LeaveTypeSelect';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, AlertTriangle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveType } from '@/types/leave';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ✅ DỮ LIỆU GIẢ MẪU NGAY ĐẦU FILE
const mockEmployee = {
  id: 1,
  name: 'Nguyễn Văn A',
  totalLeaveDays: 12,
  usedLeaveDays: 8,
  department: 'Phòng Kỹ thuật',
  position: 'Nhân viên lập trình',
};

// ✅ Hàm giả lập xử lý gửi đơn
const mockSubmit = (data: any) => {
  console.log('📤 Đơn nghỉ phép được gửi:', data);
};

// 👉 Component chính (không chỉnh sửa định dạng gốc)
export const CreateLeaveRequest = ({ employee = mockEmployee, onSubmit = mockSubmit }: any) => {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const willExceedLimit = employee.usedLeaveDays + days > employee.totalLeaveDays;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    if (endDate < startDate) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do nghỉ phép');
      return;
    }

    onSubmit({
      leaveType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
      reason,
    });

    toast.success('Đã gửi đơn nghỉ phép thành công!');
    navigate('/my-requests');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tạo đơn nghỉ phép</CardTitle>
          <CardDescription>Điền thông tin để tạo đơn nghỉ phép mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Loại phép</Label>
                <LeaveTypeSelect value={leaveType} onChange={setLeaveType} />
              </div>
              {/* <div className="space-y-2">
                <Label>Số ngày</Label>
                <div className="flex h-10 items-center rounded-lg border border-input bg-muted px-3 text-sm">
                  {days > 0 ? `${days} ngày` : 'Chưa chọn'}
                </div>
              </div> */}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Ngày kết thúc</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lý do nghỉ phép</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do nghỉ phép..."
                rows={4}
              />
            </div>

            {willExceedLimit && days > 0 && (
              <Card className="border-warning bg-warning/10">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warning">Vượt quá số ngày phép</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Đơn này sẽ khiến bạn sử dụng {employee.usedLeaveDays + days}/{employee.totalLeaveDays} ngày phép.
                        Bạn vẫn có thể gửi đơn nhưng cần được quản lý phê duyệt đặc biệt.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Gửi đơn
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
