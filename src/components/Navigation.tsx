import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  managerOnly?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Trang chủ', icon: Home },
  { path: '/request', label: 'Tạo đơn nghỉ', icon: Calendar },
  { path: '/my-requests', label: 'Đơn của tôi', icon: FileText },
  { path: '/manager', label: 'Quản lý', icon: Users, managerOnly: true },
];

interface NavigationProps {
  isManager: boolean;
}

export const Navigation = ({ isManager }: NavigationProps) => {
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => !item.managerOnly || isManager);

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Hệ thống nghỉ phép</span>
          </div>
          <div className="flex gap-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
