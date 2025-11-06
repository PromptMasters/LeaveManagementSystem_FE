import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: 'success' | 'destructive' | 'warning' | 'info' | 'default';
}

export const StatsCard = ({ title, value, icon: Icon, description, color = 'default' }: StatsCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          card: 'border-green-200 bg-green-50',
          icon: 'text-green-600',
          value: 'text-green-700'
        };
      case 'destructive':
        return {
          card: 'border-red-200 bg-red-50',
          icon: 'text-red-600',
          value: 'text-red-700'
        };
      case 'warning':
        return {
          card: 'border-orange-200 bg-orange-50',
          icon: 'text-orange-600',
          value: 'text-orange-700'
        };
      case 'info':
        return {
          card: 'border-blue-200 bg-blue-50',
          icon: 'text-blue-600',
          value: 'text-blue-700'
        };
      default:
        return {
          card: 'border-gray-200 bg-gray-50',
          icon: 'text-gray-600',
          value: 'text-gray-700'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <Card className={`transition-all hover:shadow-lg ${colorClasses.card}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClasses.value}`}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};
