import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Truck,
  Package
} from 'lucide-react';

// Mock Data
const weeklyData = [
  { name: 'T2', nhap: 12, xuat: 8 },
  { name: 'T3', nhap: 19, xuat: 12 },
  { name: 'T4', nhap: 15, xuat: 15 },
  { name: 'T5', nhap: 22, xuat: 10 },
  { name: 'T6', nhap: 28, xuat: 18 },
  { name: 'T7', nhap: 15, xuat: 12 },
  { name: 'CN', nhap: 10, xuat: 5 },
];

const statusData = [
  { name: 'Hoàn thành', value: 45, color: '#10b981' },
  { name: 'Đang xử lý', value: 30, color: '#f59e0b' },
  { name: 'Mới tạo', value: 15, color: '#3b82f6' },
  { name: 'Cảnh báo', value: 10, color: '#ef4444' },
];

const StatCard: React.FC<any> = ({ title, value, trend, trendValue, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const ActivityItem: React.FC<any> = ({ title, time, type }) => (
  <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
      ${type === 'warning' ? 'bg-red-100 text-red-600' :
        type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
      {type === 'warning' ? <AlertTriangle size={18} /> :
        type === 'success' ? <Truck size={18} /> : <Package size={18} />}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <Clock size={12} /> {time}
      </p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Tổng quan vận hành</h2>
          <p className="text-gray-500 mt-1 font-medium">Cập nhật số liệu thời gian thực - {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <Calendar size={16} />
            Tháng này
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Kế hoạch tháng"
          value="1,284"
          trend="up"
          trendValue="+12%"
          icon={TrendingUp}
          colorClass="text-blue-600 bg-blue-600"
        />
        <StatCard
          title="Xe đang hoạt động"
          value="45"
          trend="up"
          trendValue="+5"
          icon={Truck}
          colorClass="text-orange-600 bg-orange-600"
        />
        <StatCard
          title="Thời gian thông quan TB"
          value="4.5h"
          trend="down"
          trendValue="-30m"
          icon={Clock}
          colorClass="text-purple-600 bg-purple-600"
        />
        <StatCard
          title="Cảnh báo rủi ro"
          value="3"
          trend="down"
          trendValue="-2"
          icon={AlertTriangle}
          colorClass="text-red-600 bg-red-600"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Volume Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Biểu đồ vận chuyển (7 ngày)</h3>
            <button title="Xem chi tiết" className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNhap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a8943" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1a8943" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorXuat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="nhap" name="Nhập khẩu" stroke="#1a8943" strokeWidth={3} fillOpacity={1} fill="url(#colorNhap)" />
                <Area type="monotone" dataKey="xuat" name="Xuất khẩu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorXuat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Trạng thái Kế hoạch</h3>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-800">100</span>
              <span className="text-xs text-gray-500 font-medium uppercase">Tổng số</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Hoạt động gần đây</h3>
            <a href="#" className="text-sm font-semibold text-brand-green hover:underline">Xem tất cả</a>
          </div>
          <div className="flex flex-col">
            <ActivityItem
              title="Xe 29H-123.45 đã hoàn thành thủ tục thông quan tại Hữu Nghị"
              time="10 phút trước"
              type="success"
            />
            <ActivityItem
              title="Kế hoạch BK-2023-005 gặp vấn đề về giấy tờ (Thiếu C/O)"
              time="35 phút trước"
              type="warning"
            />
            <ActivityItem
              title="CS Nguyễn Thị B đã tạo mới Kế hoạch BK-2023-008"
              time="1 giờ trước"
              type="info"
            />
            <ActivityItem
              title="Xe 12C-999.88 bắt đầu di chuyển vào bãi chờ"
              time="2 giờ trước"
              type="info"
            />
          </div>
        </div>

        {/* Quick Operational Metrics / Table */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Hiệu suất cửa khẩu</h3>
          </div>
          <div className="space-y-4">
            {['Hữu Nghị', 'Tân Thanh', 'Móng Cái'].map((gate) => (
              <div key={gate} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{gate}</span>
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">Thông thoáng</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lượng xe chờ:</span>
                    <span className="font-medium">12 xe</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thời gian xử lý TB:</span>
                    <span className="font-medium">45 phút</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-brand-green h-1.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;