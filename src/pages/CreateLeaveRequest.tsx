import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LeaveTypeSelect } from '@/components/LeaveTypeSelect';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaveType } from '@/types/leave';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';



async function logLeaveRequests() {
  try {
    const res = await fetch("http://localhost:8086/leave-request");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    console.log("Leave requests:", data);
  } catch (e) {
    console.error("Error fetching leave requests:", e);
  }
}

//lấy ra ID:



// API base có thể lấy từ env, fallback localhost
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:8086';

type SendPayload = {
  requestorId: number;

  reason: string;
  startDate: Date;
  endDate: Date;

  leaveType: LeaveType;
};

async function sendLeaveRequest(p: SendPayload) {
  const body = {
    title: `Nghỉ phép - ${p.leaveType}`,
    reason: p.reason,
    startDate: format(p.startDate, "yyyy-MM-dd"),
    endDate: format(p.endDate, "yyyy-MM-dd"),
    leaveType: String(p.leaveType).toUpperCase(),
  };

  const qs = new URLSearchParams({
    requestorId: String(p.requestorId ?? 10),
  }).toString();

  const res = await fetch(`${API_BASE}/leave-request?${qs}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  // 🔽 luôn đọc text để đảm bảo không lỗi parse
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  // ⚠️ nếu không phải 2xx thì ném lỗi rõ ràng
  if (!res.ok) {
    const errorMessage =
      data.message ||
      data.error ||
      `Request failed with status ${res.status} ${res.statusText}`;

    console.error("❌ API Error:", errorMessage);
    throw new Error(errorMessage);
  }

  // ✅ Trả kết quả JSON hoặc object text fallback
  return data;
}




// 👉 Component chính (không chỉnh sửa định dạng gốc)
export const CreateLeaveRequest = () => {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);



  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const willExceedLimit = 0 + days > 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // validate cơ bản

    if (!startDate || !endDate) {
      setDisplayError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }
    if (startDate < today) {
      setDisplayError('Vui lòng chọn ngày bắt đầu nghỉ từ ngày hôm nay trở đi');
      return;
    }
    if (endDate < startDate) {
      setDisplayError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    // if (willExceedLimit) {
    //   alert('Vượt quá số ngày nghỉ cho phép');
    //   return;
    // }
    if (!reason.trim()) {
      setDisplayError('Vui lòng nhập lý do nghỉ phép');
      return;
    }

    try {
      setDisplayError(null);
      setSubmitting(true);
      await sendLeaveRequest({
        requestorId: 11, // <-- truyền qua query như backend yêu cầu

        reason,
        startDate,
        endDate,

        leaveType,

      });
      alert('Đã gửi đơn nghỉ phép thành công!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setDisplayError('Gửi đơn thất bại. ' + (err?.message || ''));
    } finally {
      setSubmitting(false);
    }
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
              <div className="space-y-2">
                <Label>Số ngày</Label>
                <div className="flex h-10 items-center rounded-lg border border-input bg-muted px-3 text-sm">
                  {days > 0 ? `${days} ngày` : 'Chưa chọn'}
                </div>
              </div>
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
                  <PopoverContent className="z-50 w-auto p-0 bg-white dark:bg-neutral-900 border rounded-md shadow-lg"
                    align="start">
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
                  <PopoverContent className="z-50 w-auto p-0 bg-white dark:bg-neutral-900 border rounded-md shadow-lg"
                    align="start">
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
                required
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do nghỉ phép..."
                rows={4}
              />
            </div>

            {/* {willExceedLimit && days > 0 && (
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
            )} */}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi đơn
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Hủy
              </Button>
            </div>

            {displayError != null ? (
              <div
                role="alert"
                aria-live="polite"
                className="text-sm rounded-md p-3 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-center"
              >
                {displayError || "Đã xảy ra lỗi."}
              </div>

            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
