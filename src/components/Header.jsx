import { Search, Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AxonActiveLogo from '@/assets/AxonActive.png';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">          {/* Logo và Title */}
          <div className="flex items-center gap-4">
            <div className="h-10 flex items-center">
              <img 
                src={AxonActiveLogo} 
                alt="AxonActive Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Leave Request Management
            </h1>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
