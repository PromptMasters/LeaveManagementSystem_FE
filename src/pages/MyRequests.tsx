import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaveRequestTable } from "@/components/LeaveRequestTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 👉 Dữ liệu mẫu khai báo ngay đầu file
const requests = [
  {
    id: 1,
    employeeName: "Nguyễn Văn A",
    reason: "Nghỉ phép cá nhân",
    startDate: "2025-11-01",
    endDate: "2025-11-03",
    status: "pending",
  },
  {
    id: 2,
    employeeName: "Trần Thị B",
    reason: "Nghỉ du lịch",
    startDate: "2025-10-15",
    endDate: "2025-10-18",
    status: "approved",
  },
  {
    id: 3,
    employeeName: "Phạm Văn C",
    reason: "Nghỉ ốm",
    startDate: "2025-09-05",
    endDate: "2025-09-07",
    status: "rejected",
  },
];

// 👉 Component chính
export const MyRequests = () => {
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Đơn nghỉ phép của tôi</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Từ chối ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tất cả đơn nghỉ phép</CardTitle>
              <CardDescription>Danh sách tất cả các đơn nghỉ phép của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={requests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Đơn chờ duyệt</CardTitle>
              <CardDescription>Các đơn đang chờ quản lý phê duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={pendingRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Đơn đã duyệt</CardTitle>
              <CardDescription>Các đơn đã được phê duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={approvedRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Đơn bị từ chối</CardTitle>
              <CardDescription>Các đơn đã bị từ chối</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestTable requests={rejectedRequests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
