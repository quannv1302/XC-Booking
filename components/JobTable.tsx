
import React from 'react';
import { Job, BookingStatus } from '../types';
import { ArrowRight, Calendar, Hammer, Truck } from 'lucide-react';

// Extend Job type to include parent Booking info for display
export interface JobWithBooking extends Job {
  bookingNumber: string;
  bookingId: string;
}

interface JobTableProps {
  jobs: JobWithBooking[];
  onViewJob: (job: JobWithBooking) => void;
}

const JobTable: React.FC<JobTableProps> = ({ jobs, onViewJob }) => {
  
  const getServiceTypeLabel = (type: string) => {
    switch(type) {
        case 'transshipment': return 'Sang tải';
        case 'direct': return 'Xe thẳng';
        case 'warehousing': return 'Hạ bãi';
        default: return type;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">STT</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã YC</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kế hoạch</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Loại DV</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Xe TQ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Xe VN</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hàng hoá</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày thực hiện</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr 
                    key={job.id} 
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewJob(job)}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-brand-green">{job.jobCode}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-700 hover:text-brand-green hover:underline">
                       {job.bookingNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm font-medium text-gray-900">{getServiceTypeLabel(job.type)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-mono font-bold text-xs border border-orange-200">
                          {job.vehicleCNPlate || '---'}
                        </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
                          {job.vehicleVNPlate || '---'}
                        </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-800" title={job.cargoName}>{job.cargoName || '---'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                     <span className="text-sm text-gray-600">
                        {new Date(job.performDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                     </span>
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                     Không có yêu cầu nào được tìm thấy.
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
         <span>Hiển thị {jobs.length} kết quả</span>
         <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sau</button>
         </div>
      </div>
    </div>
  );
};

export default JobTable;
