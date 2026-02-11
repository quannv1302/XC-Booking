import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import BookingTable from './components/BookingTable';
import BookingDetail from './components/BookingDetail';
import CreateBooking from './components/CreateBooking';
import Dashboard from './Dashboard';
import { Search, Plus, Filter, Download, ChevronDown, Briefcase, Map } from 'lucide-react';
import { BookingDetail as BookingDetailType } from '../types';

// Mock Data Source (Simulated Database)
const MOCK_DB: Record<string, BookingDetailType> = {
  '1': {
    id: '1',
    bookingNumber: 'BK-2023-001',
    type: 'Nhập khẩu',
    licensePlate: 'Multi',
    nature: 'Hàng tiêu dùng',
    status: 'processing',
    csInCharge: 'Nguyễn Thị B (CS02)',
    createdDate: '20/10/2023 08:30',
    customerId: 'CUST-VN-8821',
    borderGate: 'Hữu Nghị',
    importExportType: 'Chính ngạch',
    needsCustomsClearance: true,
    needsYardService: true,
    etaGeneral: '2023-10-22T08:00', // Format for datetime-local
    fieldOps: 'Trần Văn C',
    fieldOpsPhone: '0912.345.678',
    customsOps: 'Lê Văn D',
    customsOpsPhone: '0987.654.321',
    generalNotes: 'Hàng dễ vỡ, yêu cầu nâng hạ nhẹ tay. Xe cần vào bãi trước 10h sáng.',
    vehiclesCN: [
      {
        id: 'cn1',
        licensePlate: '12C-456.78',
        vehicleType: 'Container 40ft',
        payload: '30 Tấn',
        trailerPlate: '12R-009.21',
        containerNumber: 'CNTU1234567',
        driverName: 'Wang Wei',
        driverPhone: '+86 138 0000 0000',
        eta: '22/10/2023 09:00',
        exportLoadingLink: 'https://logs.example.com/loading/123'
      },
      {
        id: 'cn2',
        licensePlate: '12C-999.88',
        vehicleType: 'Container 40ft',
        payload: '28 Tấn',
        trailerPlate: '12R-111.22',
        containerNumber: 'CNTU9876543',
        driverName: 'Li Qiang',
        driverPhone: '+86 139 1111 2222',
        eta: '22/10/2023 10:30',
        exportLoadingLink: 'https://logs.example.com/loading/124'
      }
    ],
    vehiclesVN: [
      {
        id: 'vn1',
        licensePlate: '29H-123.45',
        vehicleType: 'Xe tải thùng',
        payload: '15 Tấn',
        trailerPlate: '',
        containerNumber: '',
        driverName: 'Phạm Văn X',
        driverPhone: '0909.123.456',
        eta: '22/10/2023 14:00',
        cPermitDocs: true,
        driverPassport: true
      }
    ],
    cargo: {
      mode: 'consolidated',
      items: [
        {
          name: 'Đồ gia dụng (Nồi, chảo)',
          type: 'Gia dụng',
          dimensions: '30x30x20 cm',
          quantity: '3000 Chiếc',
          packingSpec: 'Thùng Carton (20x20x30)'
        },
        {
          name: 'Hàng dệt may (Vải cuộn)',
          type: 'Nguyên liệu dệt',
          dimensions: '1.5m x 0.5m',
          quantity: '5 Tấn',
          packingSpec: 'Pallet gỗ'
        },
        {
          name: 'Linh kiện nhỏ',
          type: 'Điện tử',
          dimensions: '---',
          quantity: '200 Kg',
          packingSpec: 'Bao tải'
        }
      ],
      packingListUrl: '#'
    },
    jobs: [
      {
        id: 'j1',
        jobCode: 'JOB-001-ST',
        type: 'transshipment',
        status: 'processing',
        vehicleCNId: 'cn1',
        vehicleVNId: 'vn1',
        vehicleCNPlate: '12C-456.78',
        vehicleVNPlate: '29H-123.45',
        cargoName: 'Đồ gia dụng (Nồi, chảo)',
        quantity: '3000 Chiếc',
        packingSpec: 'Thùng Carton',
        performDate: '2023-10-22 14:30',
        note: 'Sang tải 3000 chiếc đồ gia dụng. Cẩn thận hàng dễ vỡ.'
      }
    ]
  }
};

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState<'dashboard' | 'bookings' | 'jobs' | 'journeys'>('bookings');
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleModuleChange = (module: string) => {
    setActiveModule(module as any);
    // Reset view state when switching to bookings module to ensure we see the list
    if (module === 'bookings') {
      setCurrentView('list');
    }
  };

  const handleViewDetail = (id: string) => {
    setSelectedBookingId(id);
    setCurrentView('detail');
  };

  const handleEditBooking = () => {
    setCurrentView('edit');
  };

  const handleCreateBooking = () => {
    setSelectedBookingId(null);
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setSelectedBookingId(null);
    setCurrentView('list');
  };

  // When editing, we pass the current data to the form
  const currentBookingData = selectedBookingId ? MOCK_DB[selectedBookingId] : undefined;

  return (
    <div className="flex h-screen bg-brand-light font-sans text-gray-800 overflow-hidden text-base">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeModule={activeModule}
        onChangeModule={handleModuleChange}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-brand-light">
          <div className="w-full">

            {/* Dashboard Module */}
            {activeModule === 'dashboard' && <Dashboard />}

            {/* Request (Booking) Management Module */}
            {activeModule === 'bookings' && (
              <>
                {currentView === 'list' && (
                  <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
                          Quản lý Kế hoạch
                        </h2>
                        <p className="text-md text-gray-500 mt-1 font-regular">
                          Quản lý danh sách kế hoạch đăng ký sớm của CS khách hàng
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                          <Download size={14} />
                          Xuất Excel
                        </button>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <StatsCards />

                    {/* Actions Bar: Search & Filter */}
                    <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200">

                      {/* Search Input */}
                      <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={16} className="text-gray-400 group-focus-within:text-brand-green transition-colors" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all duration-200 text-sm"
                          placeholder="Tìm kiếm theo mã kế hoạch, loại hàng..."
                        />
                      </div>

                      {/* Filters & Actions */}
                      <div className="flex w-full md:w-auto gap-2">
                        <div className="relative inline-block">
                          <button className="group flex items-center justify-between gap-3 min-w-[180px] px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-green/20">
                            <span className="flex items-center gap-2.5">
                              <Filter size={16} className="text-gray-400 group-hover:text-brand-green transition-colors" />
                              <span>Tất cả trạng thái</span>
                            </span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-focus:rotate-180" />
                          </button>
                        </div>
                        <button
                          onClick={handleCreateBooking}
                          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green shadow-md shadow-brand-green/20 transition-all"
                        >
                          <Plus size={16} />
                          Tạo Kế hoạch
                        </button>
                      </div>
                    </div>

                    {/* Main Data Table */}
                    <BookingTable onViewDetail={handleViewDetail} />
                  </div>
                )}

                {currentView === 'detail' && currentBookingData && (
                  <div className="p-4 md:p-6">
                    <BookingDetail
                      data={currentBookingData}
                      onBack={handleBackToList}
                      onEdit={handleEditBooking}
                    />
                  </div>
                )}

                {(currentView === 'create' || currentView === 'edit') && (
                  <div className="px-4 md:px-6 pt-2 pb-6">
                    <CreateBooking
                      onBack={currentView === 'create' ? handleBackToList : () => setCurrentView('detail')}
                      initialData={currentView === 'edit' ? currentBookingData : undefined}
                    />
                  </div>
                )}
              </>
            )}

            {/* Jobs Management (Yêu cầu) */}
            {activeModule === 'jobs' && (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Quản lý Yêu cầu</h3>
                <p className="text-sm">Module đang được phát triển...</p>
              </div>
            )}

            {/* Journey Management (Hành trình) */}
            {activeModule === 'journeys' && (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Map size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Quản lý Hành trình</h3>
                <p className="text-sm">Module đang được phát triển...</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;