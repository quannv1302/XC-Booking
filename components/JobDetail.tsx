import React from 'react';
import {
   ArrowLeft,
   Printer,
   Edit,
   Calendar,
   MapPin,
   Truck,
   Package,
   Hammer,
   ArrowRight,
   FileText,
   User,
   Phone,
   Briefcase,
   AlertCircle
} from 'lucide-react';
import { Job, BookingDetail } from '../types';
import { JobWithBooking } from './JobTable';

interface JobDetailProps {
   job: JobWithBooking;
   booking: BookingDetail;
   onBack: () => void;
   onViewBooking: () => void;
}

const JobStatusBadge: React.FC<{ status: 'pending' | 'processing' | 'completed' }> = ({ status }) => {
   let styles = '';
   let label = '';
   switch (status) {
      case 'pending': styles = 'bg-gray-100 text-gray-600 border-gray-200'; label = 'Chờ xử lý'; break;
      case 'processing': styles = 'bg-blue-100 text-blue-700 border-blue-200'; label = 'Đang thực hiện'; break;
      case 'completed': styles = 'bg-green-100 text-green-700 border-green-200'; label = 'Hoàn thành'; break;
   }
   return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles}`}>{label}</span>;
};

const InfoCard: React.FC<{ label: string; value: React.ReactNode; icon?: any; className?: string }> = ({ label, value, icon: Icon, className }) => (
   <div className={`p-4 rounded-xl border border-gray-100 bg-gray-50 ${className}`}>
      <dt className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
         {Icon && <Icon size={14} className="text-gray-400" />}
         {label}
      </dt>
      <dd className="text-sm font-bold text-gray-900">{value || "---"}</dd>
   </div>
);

const VehicleBox: React.FC<{ plate?: string; type: 'CN' | 'VN'; booking: BookingDetail, vehicleId?: string }> = ({ plate, type, booking, vehicleId }) => {
   // Find full vehicle info from booking based on ID or Plate
   const vehicleList = type === 'CN' ? booking.vehiclesCN : booking.vehiclesVN;
   const info = vehicleList.find(v => v.id === vehicleId || v.licensePlate === plate);

   const isCN = type === 'CN';
   const colorClass = isCN ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-blue-50 border-blue-200 text-blue-900';
   const iconColor = isCN ? 'text-orange-600' : 'text-blue-600';

   return (
      <div className={`p-4 rounded-xl border ${colorClass} relative overflow-hidden`}>
         <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold uppercase text-white rounded-bl-lg ${isCN ? 'bg-orange-500' : 'bg-blue-500'}`}>
            {isCN ? 'Xe Trung Quốc' : 'Xe Việt Nam'}
         </div>

         <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border ${isCN ? 'border-orange-100' : 'border-blue-100'}`}>
               <Truck size={20} className={iconColor} />
            </div>
            <div>
               <p className="text-xs opacity-70 font-semibold">Biển số xe</p>
               <p className="text-lg font-bold font-mono">{plate || "Chưa gán xe"}</p>
            </div>
         </div>

         {info && (
            <div className="space-y-2 pt-2 border-t border-black/5 text-sm">
               <div className="flex justify-between">
                  <span className="opacity-70 text-xs">Loại xe:</span>
                  <span className="font-semibold">{info.vehicleType}</span>
               </div>
               <div className="flex justify-between">
                  <span className="opacity-70 text-xs">Tài xế:</span>
                  <span className="font-semibold">{info.driverName}</span>
               </div>
               <div className="flex justify-between">
                  <span className="opacity-70 text-xs">SĐT:</span>
                  <span className="font-semibold">{info.driverPhone}</span>
               </div>
            </div>
         )}
      </div>
   );
};

const JobDetail: React.FC<JobDetailProps> = ({ job, booking, onBack, onViewBooking }) => {

   const getServiceTypeLabel = (type: string) => {
      switch (type) {
         case 'transshipment': return 'Bốc xếp';
         case 'direct': return 'Pallet';
         case 'warehousing': return 'Mái che';
         default: return type;
      }
   };

   const getMethodLabel = (method?: string) => {
      switch (method) {
         case 'forklift': return 'Xe sang xe';
         case 'manual': return 'Xe xuống bãi';
         case 'crane': return 'Bãi lên xe';
         case 'conveyor': return 'Xe sang tàu';
         default: return '---';
      }
   };

   return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <button title='Quay lại' onClick={onBack} className="p-2.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                  <ArrowLeft size={24} />
               </button>
               <div>
                  <div className="flex items-center gap-3">
                     <h1 className="text-2xl font-bold text-gray-900">{job.jobCode}</h1>
                     <JobStatusBadge status={job.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                     Thuộc kế hoạch:
                     <button onClick={onViewBooking} className="text-brand-green font-bold hover:underline flex items-center gap-1">
                        {booking.bookingNumber} <ArrowRight size={14} />
                     </button>
                  </p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold shadow-sm">
                  <Printer size={16} /> In phiếu
               </button>
               <button className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-semibold shadow-sm">
                  <Edit size={16} /> Cập nhật trạng thái
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Column */}
            <div className="lg:col-span-2 space-y-6">

               {/* 1. General Info Card */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Briefcase size={20} className="text-brand-green" /> Thông tin dịch vụ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <InfoCard
                        label="Loại dịch vụ"
                        value={getServiceTypeLabel(job.type)}
                        icon={FileText}
                        className="bg-blue-50/30 border-blue-100"
                     />
                     <InfoCard
                        label="Hình thức sang tải"
                        value={getMethodLabel(job.transshipmentMethod)}
                        icon={Hammer}
                     />
                     <InfoCard
                        label="Ngày sử dụng dịch vụ"
                        value={new Date(job.performDate).toLocaleDateString('vi-VN')}
                        icon={Calendar}
                        className="md:col-span-2"
                     />

                     {/* Supplemental Requirements Display */}
                     {job.supplementalReqs && job.supplementalReqs.length > 0 && (
                        <div className="md:col-span-2 p-4 rounded-xl border border-yellow-200 bg-yellow-50">
                           <dt className="text-xs font-bold text-yellow-700 uppercase mb-2 flex items-center gap-1.5">
                              <AlertCircle size={14} /> Yêu cầu bổ sung
                           </dt>
                           <dd className="flex flex-wrap gap-2">
                              {job.supplementalReqs.map((req, idx) => (
                                 <span key={idx} className="px-2.5 py-1 rounded-md bg-white border border-yellow-200 text-yellow-800 text-xs font-bold shadow-sm">
                                    {req === 'Khác' ? `Khác: ${job.otherReqContent}` : req}
                                 </span>
                              ))}
                           </dd>
                        </div>
                     )}

                     <div className="md:col-span-2 p-4 rounded-xl border border-yellow-200 bg-yellow-50">
                        <dt className="text-xs font-bold text-yellow-700 uppercase mb-1 flex items-center gap-1.5">
                           <FileText size={14} /> Ghi chú công việc
                        </dt>
                        <dd className="text-sm text-gray-800 italic">{job.note || "Không có ghi chú"}</dd>
                     </div>
                  </div>
               </div>

               {/* 2. Resource Allocation */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <Truck size={20} className="text-brand-green" /> Thông tin xe
                  </h3>

                  <div className="flex flex-col md:flex-row items-stretch gap-4">
                     <div className="flex-1">
                        <VehicleBox type="CN" plate={job.vehicleCNPlate} booking={booking} vehicleId={job.vehicleCNId} />
                     </div>

                     <div className="flex flex-col items-center justify-center py-2 md:px-2 text-gray-400">
                        <div className="bg-gray-100 p-2 rounded-full">
                           <ArrowRight size={24} className="md:rotate-0 rotate-90" />
                        </div>
                        <span className="text-[10px] font-bold uppercase mt-1">Sang tải</span>
                     </div>

                     <div className="flex-1">
                        <VehicleBox type="VN" plate={job.vehicleVNPlate} booking={booking} vehicleId={job.vehicleVNId} />
                     </div>
                  </div>
               </div>

            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
               {/* Cargo Info */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-fit">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Package size={20} className="text-brand-green" /> Hàng hóa
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Tên hàng</p>
                        <p className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">{job.cargoName}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-xs font-bold text-gray-500 uppercase mb-1">Số lượng</p>
                           <p className="text-sm font-semibold text-gray-900">{job.quantity}</p>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-500 uppercase mb-1">Quy cách</p>
                           <p className="text-sm font-semibold text-gray-900">{job.packingSpec}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Related Booking Info Mini */}
               <div className="bg-white rounded-2xl p-6 border border-gray-200 h-fit">
                  <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 flex items-center gap-2">
                     Thông tin kế hoạch gốc
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex justify-between text-sm">
                        <span className="text-gray-500">Mã KH:</span>
                        <span className="font-semibold text-gray-900">{booking.customerId}</span>
                     </li>
                     <li className="flex justify-between text-sm">
                        <span className="text-gray-500">Cửa khẩu:</span>
                        <span className="font-semibold text-gray-900">{booking.borderGate}</span>
                     </li>
                     <li className="flex justify-between text-sm">
                        <span className="text-gray-500">CS phụ trách:</span>
                        <span className="font-semibold text-gray-900">{booking.csInCharge}</span>
                     </li>
                     <li className="pt-2">
                        <button onClick={onViewBooking} className="w-full py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                           Xem chi tiết Kế hoạch
                        </button>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default JobDetail;