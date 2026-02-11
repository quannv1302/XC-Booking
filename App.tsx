
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StatsCards from './components/StatsCards';
import BookingTable from './components/BookingTable';
import BookingDetail from './components/BookingDetail';
import CreateBooking from './components/CreateBooking';
import Dashboard from './components/Dashboard';
import { Search, Plus, Filter, Download, ChevronDown, Briefcase, Map } from 'lucide-react';
import { MOCK_DB } from './data/mockData';

// --- Wrapper Components for Routing ---

const BookingList: React.FC = () => {
  const navigate = useNavigate();

  const handleViewDetail = (id: string) => {
    navigate(`/bookings/${id}`);
  };

  const handleCreateBooking = () => {
    navigate('/bookings/new');
  };

  return (
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
  );
};

const BookingDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch data here based on ID
  const data = id ? MOCK_DB[id] : undefined;

  if (!data) {
    return <div className="p-6">Kế hoạch không tồn tại!</div>;
  }

  const handleBack = () => {
    navigate('/bookings');
  };


  const handleEdit = () => {
    navigate(`/bookings/${id}/edit`);
  };

  const handleViewJob = (job: JobWithBooking) => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="p-4 md:p-6">
      <BookingDetail
        data={data}
        onBack={handleBack}
        onEdit={handleEdit}
        onViewJob={handleViewJob}
      />
    </div>
  );
};

const CreateBookingWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;
  const initialData = isEditMode && id ? MOCK_DB[id] : undefined;

  const handleBack = () => {
    if (isEditMode) {
      navigate(`/bookings/${id}`);
    } else {
      navigate('/bookings');
    }
  };

  return (
    <div className="px-4 md:px-6 pt-2 pb-6">
      <CreateBooking
        onBack={handleBack}
        initialData={initialData}
      />
    </div>
  );
}


import JobTable, { JobWithBooking } from './components/JobTable';
import JobDetail from './components/JobDetail';
import { Layers, CheckCircle2, Clock } from 'lucide-react';

// ... (Wrappers)

const JobList: React.FC = () => {
  const navigate = useNavigate();

  // Flatten Jobs Data
  const allJobs: JobWithBooking[] = Object.values(MOCK_DB).flatMap(booking =>
    (booking.jobs || []).map(job => ({
      ...job,
      bookingNumber: booking.bookingNumber,
      bookingId: booking.id
    }))
  );

  const handleViewJob = (job: JobWithBooking) => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Jobs Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Quản lý Yêu cầu
          </h2>
          <p className="text-md text-gray-500 mt-1 font-regular">
            Danh sách tổng hợp các yêu cầu công việc từ tất cả các kế hoạch
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <Download size={14} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Jobs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Tổng Yêu cầu</p>
            <p className="text-2xl font-bold text-gray-800">{allJobs.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Đang thực hiện</p>
            <p className="text-2xl font-bold text-gray-800">{allJobs.filter(j => j.status === 'processing').length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Hoàn thành</p>
            <p className="text-2xl font-bold text-gray-800">{allJobs.filter(j => j.status === 'completed').length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Chờ xử lý</p>
            <p className="text-2xl font-bold text-gray-800">{allJobs.filter(j => j.status === 'pending').length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
        </div>
      </div>

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
            placeholder="Tìm theo Mã YC, Mã KH, Hàng hóa..."
          />
        </div>

        {/* Filters */}
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative inline-block">
            <button className="group flex items-center justify-between gap-3 min-w-[180px] px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-green/20">
              <span className="flex items-center gap-2.5">
                <Filter size={16} className="text-gray-400 group-hover:text-brand-green transition-colors" />
                <span>Lọc Trạng thái</span>
              </span>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-focus:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Job Table */}
      <JobTable jobs={allJobs} onViewJob={handleViewJob} />
    </div>
  );
};

const JobDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Find the Booking that contains this Job
  let foundJob: JobWithBooking | undefined;
  let foundBooking: typeof MOCK_DB[string] | undefined;

  for (const booking of Object.values(MOCK_DB)) {
    const job = booking.jobs?.find(j => j.id === id);
    if (job) {
      foundJob = {
        ...job,
        bookingNumber: booking.bookingNumber,
        bookingId: booking.id
      };
      foundBooking = booking;
      break;
    }
  }

  if (!foundJob || !foundBooking) {
    return <div className="p-6">Yêu cầu không tồn tại!</div>;
  }

  const handleBack = () => {
    navigate('/jobs');
  };

  const handleViewBooking = () => {
    navigate(`/bookings/${foundJob?.bookingId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <JobDetail
        job={foundJob}
        booking={foundBooking}
        onBack={handleBack}
        onViewBooking={handleViewBooking}
      />
    </div>
  );
};

const JourneysPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[600px] text-gray-400">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Map size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-600 mb-2">Quản lý Hành trình</h3>
    <p className="text-sm">Module đang được phát triển...</p>
  </div>
);


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/new" element={<CreateBookingWrapper />} />
          <Route path="bookings/:id" element={<BookingDetailWrapper />} />
          <Route path="bookings/:id/edit" element={<CreateBookingWrapper />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="jobs/:id" element={<JobDetailWrapper />} />
          <Route path="journeys" element={<JourneysPlaceholder />} />
          {/* Catch all redirect to dashboard or 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};


export default App;