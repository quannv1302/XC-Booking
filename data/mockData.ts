
import { BookingDetail as BookingDetailType } from '../types';

// Mock Data Source (Simulated Database)
export const MOCK_DB: Record<string, BookingDetailType> = {
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
