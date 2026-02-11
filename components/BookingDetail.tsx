import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  Edit,
  Truck,
  Package,
  FileText,
  User,
  Phone,
  Calendar,
  CheckSquare,
  ExternalLink,
  Check,
  Info,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Plus,
  ArrowRight,
  Save,
  X,
  Layers,
  Box,
  Trash2,
  Container,
  Hammer,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { BookingDetail as BookingDetailType, VehicleInfo, BookingStatus, Job } from '../types';
import { JobWithBooking } from './JobTable';

interface BookingDetailProps {
  data: BookingDetailType;
  onBack: () => void;
  onEdit: () => void;
  initialTab?: 'general' | 'vehicles' | 'cargo' | 'jobs';
  onViewJob?: (job: JobWithBooking) => void;
}

const JOB_REQ_OPTIONS = [
  'Sang tải sau 22h',
  'Hàng quá khổ',
  'Hàng quá tải',
  '3-10 mặt hàng',
  '> 10 mặt hàng',
  'Khác'
];

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  let styles = '';
  let label = '';
  switch (status) {
    case 'received': styles = 'bg-blue-100 text-blue-700'; label = 'Đã tiếp nhận'; break;
    case 'processing': styles = 'bg-yellow-100 text-yellow-800'; label = 'Đang xử lý'; break;
    case 'completed': styles = 'bg-green-100 text-green-700'; label = 'Hoàn thành'; break;
    case 'warning': styles = 'bg-red-100 text-red-700'; label = 'Cảnh báo'; break;
    case 'draft': styles = 'bg-gray-100 text-gray-600'; label = 'Nháp'; break;
  }
  return <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${styles}`}>{label}</span>;
};

// JobStatusBadge is no longer used in the table body but might be useful elsewhere, keeping it or removing usage.
const JobStatusBadge: React.FC<{ status: 'pending' | 'processing' | 'completed' }> = ({ status }) => {
  let styles = '';
  let label = '';
  switch (status) {
    case 'pending': styles = 'bg-gray-100 text-gray-600'; label = 'Chờ xử lý'; break;
    case 'processing': styles = 'bg-blue-100 text-blue-700'; label = 'Đang thực hiện'; break;
    case 'completed': styles = 'bg-green-100 text-green-700'; label = 'Hoàn thành'; break;
  }
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles}`}>{label}</span>;
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode; icon?: any, highlight?: boolean }> = ({ label, value, icon: Icon, highlight }) => (
  <div className="flex flex-col gap-1 mb-1">
    <dt className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-gray-400" />}
      {label}
    </dt>
    <dd className={`text-sm font-medium ${highlight ? 'text-brand-green font-bold' : 'text-gray-900'}`}>{value || "---"}</dd>
  </div>
);

const SectionHeader: React.FC<{ title: string; icon: any; color?: string; rightElement?: React.ReactNode }> = ({ title, icon: Icon, color = "text-brand-green", rightElement }) => (
  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <Icon className={color} size={18} />
      <h3 className="text-lg font-bold text-gray-800 uppercase">{title}</h3>
    </div>
    {rightElement}
  </div>
);

const VehicleCard: React.FC<{ vehicle: VehicleInfo; type: 'CN' | 'VN'; index: number }> = ({ vehicle, type, index }) => {
  const isCN = type === 'CN';
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-3 relative overflow-hidden group hover:shadow-sm transition-all">
      <div className={`absolute top-0 left-0 w-1 h-full ${isCN ? 'bg-orange-400' : 'bg-blue-500'}`}></div>
      <div
        className="flex justify-between items-start mb-3 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-400" />}
          <span className="text-sm font-bold text-gray-800">Xe {index + 1}</span>
        </div>
        <div className={`px-2 py-0.5 rounded border text-sm font-mono font-bold ${isCN ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
          {vehicle.licensePlate}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <InfoItem label="Loại xe" value={vehicle.vehicleType} />
          <InfoItem label="Tải trọng" value={vehicle.payload} />
          <InfoItem label="Biển Mooc" value={vehicle.trailerPlate} />
          <InfoItem label="Số Cont" value={vehicle.containerNumber} />

          <div className="col-span-2 border-t border-gray-200 my-1 pt-1"></div>

          <InfoItem label="Lái xe" value={vehicle.driverName} icon={User} />
          <InfoItem label="SĐT" value={vehicle.driverPhone} icon={Phone} highlight />
          <InfoItem label="Dự kiến đến" value={vehicle.eta} icon={Calendar} />

          {isCN ? (
            <div className="col-span-2">
              <InfoItem
                label="Link xếp hàng"
                value={
                  <a href={vehicle.exportLoadingLink} className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                    Xem link <ExternalLink size={12} />
                  </a>
                }
                icon={ExternalLink}
              />
            </div>
          ) : (
            <div className="col-span-2 mt-1 pt-2 border-t border-gray-200">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <FileText size={12} /> Hồ sơ / Chứng từ
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Giấy C */}
                <div className={`flex items-center p-2 rounded border transition-colors ${vehicle.cPermitDocs ? 'bg-white border-blue-200 shadow-sm hover:bg-blue-50 cursor-pointer' : 'bg-gray-100 border-dashed border-gray-300 opacity-70'}`}>
                  <div className={`w-7 h-7 shrink-0 rounded flex items-center justify-center mr-2 ${vehicle.cPermitDocs ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                    <FileText size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0">Giấy C</p>
                    {vehicle.cPermitDocs ? (
                      <span className="text-xs font-bold text-blue-700 block truncate">Giay_C.pdf</span>
                    ) : (
                      <p className="text-xs font-medium text-gray-400 italic">Trống</p>
                    )}
                  </div>
                </div>

                {/* Sổ thông hành */}
                <div className={`flex items-center p-2 rounded border transition-colors ${vehicle.driverPassport ? 'bg-white border-blue-200 shadow-sm hover:bg-blue-50 cursor-pointer' : 'bg-gray-100 border-dashed border-gray-300 opacity-70'}`}>
                  <div className={`w-7 h-7 shrink-0 rounded flex items-center justify-center mr-2 ${vehicle.driverPassport ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                    <FileText size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase mb-0">Sổ thông hành</p>
                    {vehicle.driverPassport ? (
                      <span className="text-xs font-bold text-blue-700 block truncate">Passport.jpg</span>
                    ) : (
                      <p className="text-xs font-medium text-gray-400 italic">Trống</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Progress Bar Component ---
const BookingProgressBar: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const steps = [
    { id: 'draft', label: 'Bản nháp' },
    { id: 'received', label: 'Đã tiếp nhận' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'completed', label: 'Hoàn thành' }
  ];

  // Map status string to index
  const getStatusIndex = (s: BookingStatus) => {
    switch (s) {
      case 'draft': return 0;
      case 'received': return 1;
      case 'warning': return 2; // Warning is treated as part of processing visually
      case 'processing': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="bg-white rounded-xl p-4 md:px-12 border border-gray-200 shadow-sm mb-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="relative flex flex-col items-center flex-none">
                {/* Circle */}
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${isCompleted
                      ? 'bg-brand-green border-brand-green text-white'
                      : isCurrent
                        ? 'bg-white border-brand-green text-brand-green shadow-[0_0_0_3px_rgba(26,137,67,0.2)]'
                        : 'bg-white border-gray-200 text-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Label - Absolute positioned to avoid affecting width */}
                <div
                  className={`
                    absolute top-9 whitespace-nowrap text-[10px] md:text-xs font-semibold transition-colors duration-300
                    ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-gray-100 rounded-full relative">
                  <div
                    className={`absolute top-0 left-0 h-full bg-brand-green rounded-full transition-all duration-500
                         ${idx < currentIndex ? 'w-full' : 'w-0'}
                       `}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Spacer for absolute labels */}
      <div className="h-4 sm:h-5"></div>
    </div>
  );
};

// --- Tab Component ---
const TabButton: React.FC<{
  active: boolean;
  label: string;
  icon: any;
  onClick: () => void
}> = ({ active, label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 pb-2 px-1 border-b-2 transition-all font-semibold text-sm
      ${active
        ? 'border-brand-green text-brand-green'
        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
      }
    `}
  >
    <Icon size={16} />
    {label}
  </button>
);

const BookingDetail: React.FC<BookingDetailProps> = ({ data, onBack, onEdit, initialTab = 'general', onViewJob }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'vehicles' | 'cargo' | 'jobs'>(initialTab);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [localJobs, setLocalJobs] = useState<Job[]>(data.jobs || []);

  // Update active tab if initialTab prop changes (e.g. re-rendering)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Job Defaults Logic
  const getJobDefaults = () => ({
    type: 'transshipment' as const,
    transshipmentMethod: 'forklift' as const,
    vehicleCNId: '',
    vehicleVNId: '',
    performDate: '',
    note: '',
    // Auto-fill from Booking Cargo
    cargoName: data.cargo.items[0]?.name || '',
    quantity: data.cargo.items[0]?.quantity || '',
    packingSpec: data.cargo.items[0]?.packingSpec || '',
    // New fields
    supplementalReqs: [] as string[],
    otherReqContent: ''
  });

  // Create Job Form State
  const [newJob, setNewJob] = useState(getJobDefaults());

  // Effect: When the create form opens, ensure data is reset to defaults (Booking Info)
  useEffect(() => {
    if (showCreateJob) {
      setNewJob(prev => ({
        ...prev,
        ...getJobDefaults()
      }));
    }
  }, [showCreateJob, data]);

  const handleCreateJob = () => {
    // Basic validation
    if (!newJob.performDate) {
      alert("Vui lòng chọn ngày sử dụng dịch vụ");
      return;
    }

    const cnVehicle = data.vehiclesCN.find(v => v.id === newJob.vehicleCNId);
    const vnVehicle = data.vehiclesVN.find(v => v.id === newJob.vehicleVNId);

    const jobToAdd: Job = {
      id: `new-job-${Date.now()}`,
      jobCode: `REQ-${localJobs.length + 1}`,
      type: newJob.type,
      transshipmentMethod: newJob.transshipmentMethod,
      status: 'pending',
      vehicleCNId: newJob.vehicleCNId,
      vehicleVNId: newJob.vehicleVNId,
      vehicleCNPlate: cnVehicle?.licensePlate,
      vehicleVNPlate: vnVehicle?.licensePlate,
      cargoName: newJob.cargoName,
      quantity: newJob.quantity,
      packingSpec: newJob.packingSpec,
      performDate: newJob.performDate,
      note: newJob.note,
      supplementalReqs: newJob.supplementalReqs,
      otherReqContent: newJob.otherReqContent
    };

    setLocalJobs([...localJobs, jobToAdd]);
    setShowCreateJob(false);
    setNewJob(getJobDefaults());
  };

  const handleReqChange = (req: string) => {
    setNewJob(prev => {
      const currentReqs = prev.supplementalReqs || [];
      if (currentReqs.includes(req)) {
        // Remove
        const newReqs = currentReqs.filter(r => r !== req);
        return {
          ...prev,
          supplementalReqs: newReqs,
          otherReqContent: req === 'Khác' ? '' : prev.otherReqContent // Clear other content if "Khác" is deselected
        };
      } else {
        // Add
        return {
          ...prev,
          supplementalReqs: [...currentReqs, req]
        };
      }
    });
  };

  const deleteJob = (id: string) => {
    setLocalJobs(prev => prev.filter(j => j.id !== id));
  };

  // Helper to get text for service type
  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'transshipment': return 'Bốc xếp';
      case 'direct': return 'Pallet';
      case 'warehousing': return 'Mái che';
      default: return type;
    }
  };

  // Helper to get text for transshipment method
  const getMethodLabel = (method?: string) => {
    switch (method) {
      case 'forklift': return 'Xe sang xe';
      case 'manual': return 'Xe xuống bãi';
      case 'crane': return 'Bãi lên xe';
      case 'conveyor': return 'Xe sang tàu';
      case 'none': return 'Xe sang xe';
      default: return 'Xe sang xe';
    }
  };

  if (!data) return <div>Không tìm thấy dữ liệu</div>;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
        <div className="flex items-center gap-3">
          <button title='Quay lại' onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{data.bookingNumber}</h1>
              <StatusBadge status={data.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Tạo lúc: {data.createdDate} bởi {data.csInCharge}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold shadow-sm">
            <Printer size={16} /> In phiếu
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-semibold shadow-sm"
          >
            <Edit size={16} /> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Progress Bar (Always visible) */}
      <BookingProgressBar status={data.status} />

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-2">
        <div className="flex gap-6 overflow-x-auto">
          <TabButton
            active={activeTab === 'general'}
            label="Thông tin chung"
            icon={Info}
            onClick={() => setActiveTab('general')}
          />
          <TabButton
            active={activeTab === 'vehicles'}
            label="Thông tin xe"
            icon={Truck}
            onClick={() => setActiveTab('vehicles')}
          />
          <TabButton
            active={activeTab === 'cargo'}
            label="Thông tin hàng hóa"
            icon={Package}
            onClick={() => setActiveTab('cargo')}
          />
          <TabButton
            active={activeTab === 'jobs'}
            label="Thông tin Yêu cầu"
            icon={Briefcase}
            onClick={() => setActiveTab('jobs')}
          />
        </div>
      </div>

      {/* Tab Content Areas */}

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-in fade-in duration-300">
          <SectionHeader title="Thông tin chung" icon={FileText} />

          {/* Main General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-4">
              <InfoItem label="CS kế hoạch phụ trách" value={data.csInCharge} />
              <InfoItem label="Cửa khẩu" value={data.borderGate} />
            </div>
            <div className="space-y-4">
              <InfoItem label="Ngày khởi tạo" value={data.createdDate} />
              <InfoItem label="Loại hình XNK" value={data.importExportType} />
            </div>
            <div className="space-y-4">
              <InfoItem label="Mã quản lý khách hàng" value={data.customerId} />
              <InfoItem label="Ngày dự kiến đến" value={data.etaGeneral} />
            </div>

            {/* New Yard Needs Display */}
            <div className="col-span-1 md:col-span-3 pt-3 border-t border-gray-100">
              <dt className="text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-2">
                <CheckSquare size={12} className="text-gray-400" /> Nhu cầu trong bãi
              </dt>
              <dd className="flex gap-2 mt-1">
                {!data.needsCustomsClearance && !data.needsYardService && (
                  <span className="text-gray-500 italic text-sm">---</span>
                )}
                {data.needsCustomsClearance && (
                  <span className="px-2 py-0.5 bg-green-50 text-brand-green border border-green-200 rounded text-xs font-bold">
                    Thông quan
                  </span>
                )}
                {data.needsYardService && (
                  <span className="px-2 py-0.5 bg-green-50 text-brand-green border border-green-200 rounded text-xs font-bold">
                    Sử dụng dịch vụ bãi
                  </span>
                )}
              </dd>
            </div>
          </div>

          {/* Operational Personnel Separator */}
          <div className="border-t border-gray-100 mb-4"></div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Thông tin điều phối</h4>

          {/* Operational Personnel Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Ops Block */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="mb-2 border-b border-gray-200 pb-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Ops Hiện trường</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Họ và tên" value={data.fieldOps} />
                <InfoItem label="Số điện thoại" value={data.fieldOpsPhone} highlight />
              </div>
            </div>

            {/* Customs Ops Block */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="mb-2 border-b border-gray-200 pb-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Ops Thủ tục</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Họ và tên" value={data.customsOps} />
                <InfoItem label="Số điện thoại" value={data.customsOpsPhone} highlight />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 bg-yellow-50/50 p-4 rounded-lg">
            <dt className="text-xs font-bold text-yellow-700 uppercase mb-1">Ghi chú</dt>
            <dd className="text-sm text-gray-800 italic">{data.generalNotes}</dd>
          </div>
        </div>
      )}

      {/* Tab 2: Vehicle Comparison */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {/* Chinese Vehicles */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <SectionHeader title="Thông tin xe Trung Quốc" icon={Truck} color="text-orange-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Số lượng xe: <b className="text-gray-900">{data.vehiclesCN.length}</b></span>
              </div>
              {data.vehiclesCN.map((v, idx) => (
                <VehicleCard key={v.id} vehicle={v} type="CN" index={idx} />
              ))}
            </div>
          </div>

          {/* Vietnam Vehicles */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <SectionHeader title="Thông tin xe Việt Nam" icon={Truck} color="text-blue-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Số lượng xe: <b className="text-gray-900">{data.vehiclesVN.length}</b></span>
              </div>
              {data.vehiclesVN.map((v, idx) => (
                <VehicleCard key={v.id} vehicle={v} type="VN" index={idx} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cargo Info */}
      {activeTab === 'cargo' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-in fade-in duration-300">
          <SectionHeader
            title="Thông tin hàng hóa"
            icon={Package}
            rightElement={
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${data.cargo.mode === 'bulk' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                {data.cargo.mode === 'bulk' ? 'Hàng nguyên' : 'Hàng ghép'}
              </span>
            }
          />

          {data.cargo.mode === 'bulk' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <InfoItem label="Tên hàng" value={data.cargo.items[0].name} />
              <InfoItem label="Loại hàng" value={data.cargo.items[0].type} />
              <InfoItem label="Kích thước" value={data.cargo.items[0].dimensions} />
              <InfoItem label="Số lượng" value={data.cargo.items[0].quantity} highlight />
              <InfoItem label="Quy cách đóng gói" value={data.cargo.items[0].packingSpec} />
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">STT</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên hàng</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loại hàng</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kích thước</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quy cách</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Packing List</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.cargo.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">{idx + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.type || '---'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.dimensions || '---'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-brand-green">{item.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.packingSpec}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {item.packingListFile ? (
                          <button className="text-brand-green hover:underline text-xs font-bold flex items-center gap-1">
                            <Download size={14} /> Tải về
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs italic">---</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.cargo.mode === 'bulk' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <InfoItem
                label="Packing List"
                value={
                  <button className="text-brand-green hover:underline text-sm font-semibold flex items-center gap-1.5">
                    <FileText size={16} /> Tải xuống Packing List
                  </button>
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Jobs Info (Refactored to Table and Modal) */}
      {activeTab === 'jobs' && (
        <div className="animate-in fade-in duration-300 space-y-4">

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title={`Danh sách Yêu cầu (${localJobs.length})`} icon={Briefcase} />
              <button
                onClick={() => setShowCreateJob(true)}
                className="px-4 py-2 bg-brand-green text-white text-sm font-bold rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus size={16} /> Tạo Yêu cầu mới
              </button>
            </div>

            {localJobs.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-12">STT</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mã YC</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loại DV</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Xe TQ</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Xe VN</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hàng hoá</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {localJobs.map((job, index) => (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                        onClick={() => {
                          if (onViewJob) {
                            onViewJob({
                              ...job,
                              bookingId: data.id,
                              bookingNumber: data.bookingNumber
                            });
                          }
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-brand-green">{job.jobCode}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">{getServiceTypeLabel(job.type)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 rounded bg-orange-50 text-orange-700 font-mono font-bold text-xs border border-orange-200 block w-fit">
                            {job.vehicleCNPlate || '---'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200 block w-fit">
                            {job.vehicleVNPlate || '---'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-800">{job.cargoName || '---'}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-1.5 text-gray-400 hover:text-brand-green hover:bg-green-50 rounded transition-colors group-hover:text-brand-green"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa yêu cầu"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Briefcase size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có Yêu cầu nào được tạo cho Kế hoạch này.</p>
              </div>
            )}
          </div>

          {/* Create Job Modal Popup */}
          {showCreateJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-xl sticky top-0 z-10">
                  <div className="flex items-center gap-2 text-brand-green">
                    <Plus size={20} className="font-bold" />
                    <h3 className="text-lg font-bold text-gray-800">Tạo Yêu cầu mới</h3>
                  </div>
                  <button title="Tạo mới"
                    onClick={() => setShowCreateJob(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto">

                  {/* 1. Service Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                        <Layers size={14} /> Loại dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <select title="Loại dịch vụ"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green bg-white"
                        value={newJob.type}
                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                      >
                        <option value="transshipment">Bốc xếp</option>
                        <option value="direct">Pallet</option>
                        <option value="warehousing">Mái che</option>
                      </select>
                    </div>

                    {/* Transshipment Method - Conditional */}
                    <div>
                      <label className={`text-xs font-bold mb-1.5 flex items-center gap-1 ${newJob.type === 'transshipment' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <Hammer size={14} /> Hình thức sang tải
                      </label>
                      <select title="Hình thức sang tải"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green bg-white transition-colors
                                    ${newJob.type === 'transshipment' ? 'border-gray-200' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                        value={newJob.transshipmentMethod}
                        disabled={newJob.type !== 'transshipment'}
                        onChange={(e) => setNewJob({ ...newJob, transshipmentMethod: e.target.value as any })}
                      >
                        <option value="forklift">Xe sang xe</option>
                        <option value="manual">Xe xuống bãi</option>
                        <option value="crane">Bãi lên xe</option>
                        <option value="conveyor">Xe sang tàu</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. Date */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                      <Calendar size={14} /> Ngày sử dụng dịch vụ <span className="text-red-500">*</span>
                    </label>
                    <input title="Ngày sử dụng dịch vụ"
                      type="datetime-local"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                      value={newJob.performDate}
                      onChange={(e) => setNewJob({ ...newJob, performDate: e.target.value })}
                    />
                  </div>

                  {/* 3. Vehicles Info (Sourced from Plan) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* CN Vehicle Selection */}
                    <div className="p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                      <label className="text-xs font-bold text-orange-800 mb-1.5 flex items-center gap-1">
                        <Truck size={12} /> Xe Trung Quốc
                      </label>
                      <select title="Xe Trung Quốc"
                        className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                        value={newJob.vehicleCNId}
                        onChange={(e) => setNewJob({ ...newJob, vehicleCNId: e.target.value })}
                      >
                        <option value="">-- Chọn xe từ Kế hoạch --</option>
                        {data.vehiclesCN.map((v) => (
                          <option key={v.id} value={v.id}>{v.licensePlate} ({v.vehicleType})</option>
                        ))}
                      </select>
                      <div className="mt-1 text-[10px] text-orange-600/70 italic flex items-center gap-1">
                        <Info size={10} /> Dữ liệu lấy từ Kế hoạch
                      </div>
                    </div>

                    {/* VN Vehicle Selection */}
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <label className="text-xs font-bold text-blue-800 mb-1.5 flex items-center gap-1">
                        <Truck size={12} /> Xe Việt Nam
                      </label>
                      <select title="Xe Việt Nam"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                        value={newJob.vehicleVNId}
                        onChange={(e) => setNewJob({ ...newJob, vehicleVNId: e.target.value })}
                      >
                        <option value="">-- Chọn xe từ Kế hoạch --</option>
                        {data.vehiclesVN.map((v) => (
                          <option key={v.id} value={v.id}>{v.licensePlate} ({v.vehicleType})</option>
                        ))}
                      </select>
                      <div className="mt-1 text-[10px] text-blue-600/70 italic flex items-center gap-1">
                        <Info size={10} /> Dữ liệu lấy từ Kế hoạch
                      </div>
                    </div>
                  </div>

                  {/* 4. Cargo Info (Read-only from Plan) */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                        <Package size={14} /> Thông tin hàng hóa
                      </h4>
                      <span className="text-[10px] font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Tự động lấy từ Kế hoạch</span>
                    </div>
                    <div className="p-3 bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 block">Tên hàng</label>
                        <div className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">{newJob.cargoName || '---'}</div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 block">Số lượng</label>
                        <div className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">{newJob.quantity || '---'}</div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 block">Quy cách</label>
                        <div className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-1">{newJob.packingSpec || '---'}</div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Supplemental Requirements */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                      <AlertCircle size={14} /> Yêu cầu bổ sung
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {JOB_REQ_OPTIONS.map((opt) => {
                        const isChecked = newJob.supplementalReqs?.includes(opt);
                        return (
                          <label key={opt} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-brand-green/5 border-brand-green' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-brand-green rounded focus:ring-brand-green border-gray-300"
                              checked={isChecked}
                              onChange={() => handleReqChange(opt)}
                            />
                            <span className={`text-sm font-medium ${isChecked ? 'text-brand-green' : 'text-gray-700'}`}>{opt}</span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Text input for "Khác" */}
                    {newJob.supplementalReqs?.includes('Khác') && (
                      <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                          placeholder="Nhập nội dung yêu cầu khác..."
                          value={newJob.otherReqContent}
                          onChange={(e) => setNewJob({ ...newJob, otherReqContent: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  {/* 6. Notes */}
                  <div className="mb-2">
                    <label className="text-xs font-bold text-gray-600 mb-1.5 block">Ghi chú thêm</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
                      placeholder="VD: Cần nhẹ tay, hàng dễ vỡ..."
                      value={newJob.note}
                      onChange={(e) => setNewJob({ ...newJob, note: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3 sticky bottom-0 z-10">
                  <button
                    onClick={() => setShowCreateJob(false)}
                    className="px-5 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleCreateJob}
                    className="px-5 py-2 bg-brand-green text-white text-sm font-bold rounded-lg hover:bg-green-700 flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Save size={16} /> Lưu Yêu cầu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Spacer */}
      <div className="h-12"></div>
    </div>
  );
};

export default BookingDetail;