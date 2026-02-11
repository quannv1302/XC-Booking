
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Map,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  Phone
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

// Configuration for Menu Items
const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/bookings', label: 'Quản lý Kế hoạch', icon: FileText },
  { path: '/jobs', label: 'Quản lý Yêu cầu', icon: Briefcase },
  { path: '/journeys', label: 'Quản lý Hành trình', icon: Map },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`
        h-screen bg-brand-green text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl sticky top-0 z-50
        ${collapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header / Logo Area */}
      <div className="p-6 flex items-center justify-start gap-3 border-b border-green-700/50">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-brand-yellow text-brand-green font-extrabold text-lg shadow-sm">
          XB
        </div>
        {!collapsed && (
          <h1 className="font-bold text-xl tracking-tight text-white whitespace-nowrap">
            X-Booking
          </h1>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 bg-green-900/20 m-3 rounded-xl">
        {!collapsed ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <LifeBuoy size={20} className="text-brand-yellow" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cần hỗ trợ?</p>
                <p className="text-xs text-green-100/80">Liên hệ đội ngũ kỹ thuật 24/7</p>
              </div>
            </div>
            <button className="w-full bg-white text-brand-green font-bold py-2.5 rounded-lg text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Phone size={14} />
              Liên hệ ngay
            </button>
          </div>
        ) : (
          <div className="flex justify-center" title="Hỗ trợ kỹ thuật">
            <LifeBuoy size={24} className="text-brand-yellow cursor-pointer hover:scale-110 transition-transform" />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center hover:bg-green-800 transition-colors border-t border-green-700/50 text-green-100"
      >
        {collapsed ? <ChevronRight size={20} /> : (
          <div className="flex items-center gap-2 text-sm font-medium w-full px-6">
            <ChevronLeft size={16} />
            <span>Thu gọn menu</span>
          </div>
        )}
      </button>
    </aside>
  );
};

interface NavItemProps {
  icon: any;
  label: string;
  path: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, path, collapsed }) => {
  return (
    <NavLink
      to={path}
      title={collapsed ? label : undefined}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-3.5 rounded-xl cursor-pointer transition-all duration-200 group
        ${isActive
          ? 'bg-white text-brand-green font-bold shadow-md transform scale-[1.02]'
          : 'text-green-100 hover:bg-green-700/50 hover:text-white'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <Icon size={20} className={isActive ? 'text-brand-green' : 'text-green-200 group-hover:text-white'} />
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;