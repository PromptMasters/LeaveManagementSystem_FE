import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'leave-requests',
      label: 'Leave Requests',
      icon: FileText,
      path: '/manager'
    }
  ];  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  isActive 
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
