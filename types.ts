
export type BookingStatus = 'received' | 'processing' | 'completed' | 'draft' | 'warning';

export interface VehicleInfo {
  id: string;
  licensePlate: string;
  vehicleType: string;
  payload: string; // Tải trọng
  trailerPlate?: string; // Biển mooc
  containerNumber?: string;
  driverName: string;
  driverPhone: string;
  eta: string; // Thời gian dự kiến đến
  // Specific for CN
  exportLoadingLink?: string;
  // Specific for VN
  cPermitDocs?: boolean; // Bộ chứng từ giấy C
  driverPassport?: boolean; // Sổ thông hành
}

export interface CargoItem {
  name: string;        // Tên hàng hóa
  type?: string;       // Loại hàng (NEW)
  quantity: string;    // Số lượng
  dimensions?: string; // Kích thước (NEW)
  packingSpec: string; // Quy cách đóng gói
  packingListFile?: File | string; // File Packing List riêng cho từng loại hàng (NEW)
}

export interface CargoInfo {
  mode: 'bulk' | 'consolidated'; // 'bulk' = Hàng nguyên, 'consolidated' = Hàng ghép
  items: CargoItem[];
  packingListUrl?: string;
}

export interface Job {
  id: string;
  jobCode: string;
  type: 'transshipment' | 'direct' | 'warehousing'; // Sang tải | Xe thẳng | Hạ bãi
  transshipmentMethod?: 'forklift' | 'manual' | 'crane' | 'conveyor' | 'none'; // Hình thức sang tải (NEW)
  status: 'pending' | 'processing' | 'completed';
  
  // Vehicle Info
  vehicleCNId?: string; // Link to CN Vehicle
  vehicleVNId?: string; // Link to VN Vehicle
  vehicleCNPlate?: string; // Display purpose
  vehicleVNPlate?: string; // Display purpose
  
  // Cargo Info (NEW)
  cargoName?: string;
  quantity?: string;
  packingSpec?: string;

  // Supplemental Requirements (NEW)
  supplementalReqs?: string[];
  otherReqContent?: string;

  performDate: string;
  note: string;
}

export interface BookingDetail extends Booking {
  // General Info
  csInCharge: string;
  createdDate: string;
  customerId: string;
  borderGate: string;
  importExportType: string;
  
  // Yard Requirements (NEW)
  needsCustomsClearance: boolean; // Thông quan
  needsYardService: boolean;      // Sử dụng dịch vụ bãi

  etaGeneral: string;
  fieldOps: string;
  fieldOpsPhone: string;
  customsOps: string;
  customsOpsPhone: string;
  generalNotes: string;
  
  // Vehicles
  vehiclesCN: VehicleInfo[];
  vehiclesVN: VehicleInfo[];
  
  // Cargo
  cargo: CargoInfo;

  // Jobs (NEW)
  jobs: Job[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  type: string;
  licensePlate: string;
  nature: string;
  status: BookingStatus;
}

export interface StatMetric {
  label: string;
  value: number;
  type: 'total' | 'processing' | 'completed' | 'warning';
  icon: any; // Lucide icon component type
}

export interface SidebarItem {
  label: string;
  icon: any;
  active?: boolean;
  path: string;
}