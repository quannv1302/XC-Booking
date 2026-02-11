import React from 'react';
import { Booking, BookingStatus } from '../types';
import { MoreHorizontal, ArrowRight, Eye } from 'lucide-react';

const bookings: Booking[] = [
  { id: '1', bookingNumber: 'BK-2023-001', type: 'Nhập khẩu', licensePlate: '12C-456.78', nature: 'Hàng tiêu dùng', status: 'received' },
  { id: '1', bookingNumber: 'BK-2023-002', type: 'Xuất khẩu', licensePlate: '98A-123.45', nature: 'Điện tử', status: 'processing' },
  { id: '1', bookingNumber: 'BK-2023-003', type: 'Quá cảnh', licensePlate: '29H-999.99', nature: 'Nguyên liệu', status: 'warning' },
  { id: '1', bookingNumber: 'BK-2023-004', type: 'Nhập khẩu', licensePlate: '15C-333.22', nature: 'Thực phẩm lạnh', status: 'completed' },
  { id: '1', bookingNumber: 'BK-2023-005', type: 'Xuất khẩu', licensePlate: '88C-567.89', nature: 'Dệt may', status: 'draft' },
  { id: '1', bookingNumber: 'BK-2023-006', type: 'Nhập khẩu', licensePlate: '34C-111.02', nature: 'Linh kiện', status: 'processing' },
];

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  let styles = '';
  let label = '';

   switch (status) {
    case 'received':
      styles = 'text-xs bg-blue-100 text-blue-700 border border-blue-200';
      label = 'Đã tiếp nhận';
      break;
    case 'processing':
      styles = 'text-xs bg-yellow-100 text-yellow-800 border border-yellow-200';
      label = 'Đang xử lý';
      break;
    case 'completed':
      styles = 'text-xs bg-green-100 text-green-700 border border-green-200';
      label = 'Hoàn thành';
      break;
    case 'warning':
      styles = 'text-xs bg-red-100 text-red-700 border border-red-200';
      label = 'Cảnh báo';
      break;
    case 'draft':
      styles = 'text-xs bg-gray-100 text-gray-600 border border-gray-200';
      label = 'Nháp';
      break;
  }

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${styles}`}>
      {label}
    </span>
  );
};

interface BookingTableProps {
  onViewDetail: (id: string) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ onViewDetail }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Mã Kế hoạch</th>
              <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Loại hình</th>
              <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Biển số xe TQ</th>
              <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Tính chất</th>
              <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-5 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking, index) => (
              <tr 
                key={booking.id} 
                className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                onClick={() => onViewDetail(booking.id)}
              >
                <td className="px-6 py-6 text-base text-gray-500 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-6 text-base font-bold text-gray-800 group-hover:text-brand-green transition-colors">
                  {booking.bookingNumber}
                </td>
                <td className="px-6 py-6 text-base text-gray-600">
                  {booking.type}
                </td>
                <td className="px-4 py-2 text-base text-gray-800 bg-gray-50 rounded inline-block my-4 mx-6 border border-gray-200 px-3 py-1 w-fit">
                  {booking.licensePlate}
                </td>
                <td className="px-6 py-6 text-base text-gray-600">
                  {booking.nature}
                </td>
                <td className="px-6 py-6">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-6 text-right">
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetail(booking.id);
                    }}
                    className="text-base font-semibold text-brand-green hover:text-green-700 flex items-center justify-end gap-1.5 ml-auto group/btn"
                   >
                      Xem chi tiết 
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Placeholder */}
      <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-between text-base text-gray-500">
        <span>Hiển thị 1-6 trong 45 kết quả</span>
        <div className="flex gap-2">
            <button className="px-4 py-1.5 border rounded hover:bg-gray-50 disabled:opacity-50">Trước</button>
            <button className="px-4 py-1.5 border rounded hover:bg-gray-50 bg-brand-green text-white border-brand-green">1</button>
            <button className="px-4 py-1.5 border rounded hover:bg-gray-50">2</button>
            <button className="px-4 py-1.5 border rounded hover:bg-gray-50">3</button>
            <button className="px-4 py-1.5 border rounded hover:bg-gray-50">Sau</button>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;