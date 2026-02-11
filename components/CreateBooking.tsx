import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Truck,
  Package,
  FileText,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  User,
  Upload,
  CheckSquare,
  Warehouse,
  Paperclip,
  X
} from 'lucide-react';
import { VehicleInfo, CargoItem, BookingDetail } from '../types';

interface CreateBookingProps {
  onBack: () => void;
  initialData?: BookingDetail;
}

// Reusable Components
const FormInput: React.FC<{
  label: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}> = ({ label, value, onChange, type = "text", placeholder, required, className, name, options, disabled }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-sm font-semibold text-gray-600 flex gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'select' ? (
      <select title={label}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
      >
        {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm resize-none ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
      />
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm ${disabled ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
      />
    )}
  </div>
);

const SectionHeader: React.FC<{ title: string; icon: any; color?: string; rightElement?: React.ReactNode }> = ({ title, icon: Icon, color = "text-brand-green", rightElement }) => (
  <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-gray-100">
    <div className="flex items-center gap-2.5">
      <Icon className={color} size={22} />
      <h3 className="text-xl font-bold text-gray-800 uppercase">{title}</h3>
    </div>
    {rightElement}
  </div>
);

const CreateBooking: React.FC<CreateBookingProps> = ({ onBack, initialData }) => {
  const isEditMode = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);

  // Initial State
  const [formData, setFormData] = useState({
    csInCharge: 'Nguyễn Văn A', // Default value from logged in user
    customerId: 'CUST-VN-001',  // Default value from logged in user
    borderGate: 'Hữu Nghị',
    importExportType: 'Nhập khẩu',
    needsCustomsClearance: false, // NEW
    needsYardService: false,      // NEW
    etaGeneral: '',
    fieldOps: '',
    fieldOpsPhone: '',
    customsOps: '',
    customsOpsPhone: '',
    generalNotes: '',
    cargoMode: 'consolidated' as 'bulk' | 'consolidated',
  });

  const [vehiclesCN, setVehiclesCN] = useState<(Partial<VehicleInfo> & { isExpanded?: boolean })[]>([
    { id: 'cn-1', licensePlate: '', vehicleType: 'Container 40ft', driverName: '', driverPhone: '', isExpanded: true }
  ]);
  const [vehiclesVN, setVehiclesVN] = useState<(Partial<VehicleInfo> & { isExpanded?: boolean })[]>([
    { id: 'vn-1', licensePlate: '', vehicleType: 'Xe tải thùng', driverName: '', driverPhone: '', isExpanded: true }
  ]);
  const [cargoItems, setCargoItems] = useState<Partial<CargoItem>[]>([
    { name: '', type: '', quantity: '', dimensions: '', packingSpec: '', packingListFile: undefined }
  ]);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        csInCharge: initialData.csInCharge,
        customerId: initialData.customerId,
        borderGate: initialData.borderGate,
        importExportType: initialData.importExportType,
        needsCustomsClearance: initialData.needsCustomsClearance || false,
        needsYardService: initialData.needsYardService || false,
        etaGeneral: initialData.etaGeneral,
        fieldOps: initialData.fieldOps,
        fieldOpsPhone: initialData.fieldOpsPhone,
        customsOps: initialData.customsOps,
        customsOpsPhone: initialData.customsOpsPhone,
        generalNotes: initialData.generalNotes,
        cargoMode: initialData.cargo.mode,
      });
      setVehiclesCN(initialData.vehiclesCN.map(v => ({ ...v, isExpanded: true })));
      setVehiclesVN(initialData.vehiclesVN.map(v => ({ ...v, isExpanded: true })));
      setCargoItems(initialData.cargo.items);
    }
  }, [initialData]);

  // Handlers
  const handleGeneralChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCargoModeChange = (mode: 'bulk' | 'consolidated') => {
    setFormData(prev => ({ ...prev, cargoMode: mode }));
    if (mode === 'bulk') {
      setCargoItems(prev => prev.length > 0 ? [prev[0]] : [{ name: '', type: '', quantity: '', dimensions: '', packingSpec: '' }]);
    }
  };

  const toggleVehicleExpansion = (type: 'CN' | 'VN', index: number) => {
    if (type === 'CN') {
      const updated = [...vehiclesCN];
      updated[index] = { ...updated[index], isExpanded: !updated[index].isExpanded };
      setVehiclesCN(updated);
    } else {
      const updated = [...vehiclesVN];
      updated[index] = { ...updated[index], isExpanded: !updated[index].isExpanded };
      setVehiclesVN(updated);
    }
  };

  const addVehicle = (type: 'CN' | 'VN') => {
    const newVehicle = { id: `${type.toLowerCase()}-${Date.now()}`, licensePlate: '', vehicleType: type === 'CN' ? 'Container 40ft' : 'Xe tải thùng', isExpanded: true };
    if (type === 'CN') setVehiclesCN([...vehiclesCN, newVehicle]);
    else setVehiclesVN([...vehiclesVN, newVehicle]);
  };

  const removeVehicle = (type: 'CN' | 'VN', index: number) => {
    if (type === 'CN') {
      const updated = [...vehiclesCN];
      updated.splice(index, 1);
      setVehiclesCN(updated);
    } else {
      const updated = [...vehiclesVN];
      updated.splice(index, 1);
      setVehiclesVN(updated);
    }
  };

  const updateVehicle = (type: 'CN' | 'VN', index: number, field: keyof VehicleInfo, value: any) => {
    if (type === 'CN') {
      const updated = [...vehiclesCN];
      updated[index] = { ...updated[index], [field]: value };
      setVehiclesCN(updated);
    } else {
      const updated = [...vehiclesVN];
      updated[index] = { ...updated[index], [field]: value };
      setVehiclesVN(updated);
    }
  };

  const addCargoItem = () => {
    setCargoItems([...cargoItems, { name: '', type: '', quantity: '', dimensions: '', packingSpec: '', packingListFile: undefined }]);
  };

  const removeCargoItem = (index: number) => {
    const updated = [...cargoItems];
    updated.splice(index, 1);
    setCargoItems(updated);
  };

  const updateCargoItem = (index: number, field: keyof CargoItem, value: any) => {
    const updated = [...cargoItems];
    updated[index] = { ...updated[index], [field]: value };
    setCargoItems(updated);
  };

  const handleCargoFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updated = [...cargoItems];
      updated[index] = { ...updated[index], packingListFile: file };
      setCargoItems(updated);
    }
  };

  const removeCargoFile = (index: number) => {
    const updated = [...cargoItems];
    updated[index] = { ...updated[index], packingListFile: undefined };
    setCargoItems(updated);
  };

  const handleSubmit = () => {
    const action = isEditMode ? 'Cập nhật' : 'Tạo mới';
    alert(`Đã ${action} kế hoạch thành công (Mô phỏng)`);
    onBack();
  };

  const steps = [
    { number: 1, title: 'Thông tin chung', icon: FileText },
    { number: 2, title: 'Thông tin xe', icon: Truck },
    { number: 3, title: 'Thông tin hàng hóa', icon: Package },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(curr => curr + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(curr => curr - 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header with Navigation Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-brand-light z-20 py-4 mb-2 border-b border-gray-200/50 backdrop-blur-sm bg-brand-light/95">
        <div className="flex items-center gap-4">
          <button title="Quay lại" onClick={onBack} className="p-2.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? `Cập nhật: ${initialData?.bookingNumber}` : 'Tạo Kế hoạch Mới'}
            </h1>
          </div>
        </div>

        {/* Navigation Buttons Moved Here */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-gray-200 bg-white
                ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            <ChevronLeft size={18} /> Quay lại
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-brand-green text-white rounded-xl hover:bg-green-700 font-bold flex items-center gap-2 shadow-sm shadow-brand-green/30"
            >
              Tiếp tục <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-brand-green text-white rounded-xl hover:bg-green-700 font-bold flex items-center gap-2 shadow-sm shadow-brand-green/30"
            >
              <Save size={18} /> {isEditMode ? 'Lưu thay đổi' : 'Hoàn tất'}
            </button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-brand-green -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>

          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isActive = step.number === currentStep;

            return (
              <div key={step.number} className="relative z-10 flex flex-col items-center bg-white px-2">
                <div
                  className={`
                     w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                     ${isCompleted
                      ? 'bg-brand-green border-brand-green text-white'
                      : isActive
                        ? 'bg-white border-brand-green text-brand-green shadow-lg scale-110'
                        : 'bg-white border-gray-200 text-gray-300'
                    }
                   `}
                >
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                </div>
                <span className={`mt-2 text-sm font-bold transition-colors ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1: General Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 animate-in fade-in slide-in-from-right-8 duration-300">
            <SectionHeader title="Bước 1: Thông tin chung" icon={FileText} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <FormInput
                label="CS Phụ trách"
                name="csInCharge"
                value={formData.csInCharge}
                onChange={handleGeneralChange}
                placeholder="Tên nhân viên CS"
                disabled={true}
              />
              <FormInput
                label="Mã Khách hàng"
                name="customerId"
                value={formData.customerId}
                onChange={handleGeneralChange}
                placeholder="VD: CUST-001"
                disabled={true}
              />
              <FormInput
                required
                label="Ngày dự kiến đến"
                name="etaGeneral"
                type="datetime-local"
                value={formData.etaGeneral}
                onChange={handleGeneralChange}
              />
              <FormInput
                required
                label="Loại hình XNK"
                name="importExportType"
                type="select"
                value={formData.importExportType}
                onChange={handleGeneralChange}
                options={[
                  { value: 'Nhập khẩu', label: 'Nhập khẩu' },
                  { value: 'Xuất khẩu', label: 'Xuất khẩu' }
                ]}
              />
              <FormInput
                required
                label="Cửa khẩu"
                name="borderGate"
                type="select"
                value={formData.borderGate}
                onChange={handleGeneralChange}
                options={[
                  { value: 'Hữu Nghị', label: 'Hữu Nghị' },
                  { value: 'Tân Thanh', label: 'Tân Thanh' },
                  { value: 'Móng Cái', label: 'Móng Cái' },
                  { value: 'Lào Cai', label: 'Lào Cai' }
                ]}
              />
            </div>

            {/* Needs Block (Separate Section) */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
              <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                Nhu cầu trong bãi
              </h4>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer min-w-[200px] ${formData.needsCustomsClearance ? 'bg-white border-brand-green ring-1 ring-brand-green/20 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    name="needsCustomsClearance"
                    checked={formData.needsCustomsClearance}
                    onChange={handleGeneralChange}
                    className="w-5 h-5 text-brand-green rounded focus:ring-brand-green border-gray-300"
                  />
                  <span className={`font-medium text-base ${formData.needsCustomsClearance ? 'text-brand-green' : 'text-gray-700'}`}>Thông quan</span>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer min-w-[200px] ${formData.needsYardService ? 'bg-white border-brand-green ring-1 ring-brand-green/20 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    name="needsYardService"
                    checked={formData.needsYardService}
                    onChange={handleGeneralChange}
                    className="w-5 h-5 text-brand-green rounded focus:ring-brand-green border-gray-300"
                  />
                  <span className={`font-medium text-base ${formData.needsYardService ? 'text-brand-green' : 'text-gray-700'}`}>Sử dụng dịch vụ bãi</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><User size={16} /> Ops Hiện trường</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Họ tên" placeholder="Nhập họ tên" name="fieldOps" value={formData.fieldOps} onChange={handleGeneralChange} />
                  <FormInput label="Số điện thoại" placeholder="Nhập số điện thoại" name="fieldOpsPhone" value={formData.fieldOpsPhone} onChange={handleGeneralChange} />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><FileText size={16} /> Ops Thủ tục</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Họ tên" placeholder="Nhập họ tên" name="customsOps" value={formData.customsOps} onChange={handleGeneralChange} />
                  <FormInput label="Số điện thoại" placeholder="Nhập số điện thoại" name="customsOpsPhone" value={formData.customsOpsPhone} onChange={handleGeneralChange} />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <FormInput
                type="textarea"
                label="Ghi chú"
                name="generalNotes"
                value={formData.generalNotes}
                onChange={handleGeneralChange}
                placeholder="Nhập các lưu ý quan trọng về lô hàng..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Vehicles */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* CN Vehicles */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col h-full">
                <SectionHeader
                  title={`Xe Trung Quốc (${vehiclesCN.length})`}
                  icon={Truck}
                  color="text-orange-600"
                  rightElement={
                    <button onClick={() => addVehicle('CN')} className="text-sm bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                      <Plus size={16} /> Thêm xe
                    </button>
                  }
                />

                <div className="space-y-4 flex-1">
                  {vehiclesCN.map((v, index) => (
                    <div key={index} className="border border-orange-100 rounded-xl p-4 bg-orange-50/30 relative group">
                      <div
                        className="flex items-center justify-between mb-2 border-b border-orange-200/50 pb-2 cursor-pointer select-none"
                        onClick={() => toggleVehicleExpansion('CN', index)}
                      >
                        <div className="flex items-center gap-2">
                          {v.isExpanded ? <ChevronDown size={18} className="text-orange-600" /> : <ChevronRight size={18} className="text-orange-400" />}
                          <span className="font-bold text-orange-800 text-sm">Xe TQ #{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeVehicle('CN', index); }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Xóa xe"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {v.isExpanded && (
                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                          <FormInput
                            required
                            label="Biển số xe"
                            value={v.licensePlate}
                            onChange={(e) => updateVehicle('CN', index, 'licensePlate', e.target.value)}
                            placeholder="Nhập biển số xe"
                          />
                          <FormInput
                            required
                            label="Loại xe"
                            type="select"
                            value={v.vehicleType}
                            onChange={(e) => updateVehicle('CN', index, 'vehicleType', e.target.value)}
                            options={[
                              { value: 'Container 40ft', label: 'Container 40ft' },
                              { value: 'Container 20ft', label: 'Container 20ft' },
                              { value: 'Xe tải thùng', label: 'Xe tải thùng' }
                            ]}
                          />
                          <FormInput
                            label="Tải trọng xe"
                            required
                            type="select"
                            value={v.payload}
                            onChange={(e) => updateVehicle('CN', index, 'payload', e.target.value)}
                            options={[
                              { value: '10 Tấn', label: '10 Tấn' },
                              { value: '15 Tấn', label: '15 Tấn' },
                              { value: '20 Tấn', label: '20 Tấn' },
                              { value: '30 Tấn', label: '30 Tấn' },
                              { value: 'Khác', label: 'Khác' }
                            ]}
                          />
                          <FormInput
                            label="Biển kiểm soát mooc"
                            placeholder="Nhập biển kiểm soát mooc"
                            value={v.containerNumber}
                            onChange={(e) => updateVehicle('CN', index, 'containerNumber', e.target.value)}
                          />
                          <FormInput
                            label="Số cont"
                            placeholder="Nhập số cont"
                            value={v.containerNumber}
                            onChange={(e) => updateVehicle('CN', index, 'containerNumber', e.target.value)}
                          />
                          <FormInput
                            label="Thời gian dự kiến đến"
                            type="datetime-local"
                            value={v.eta || ''}
                            onChange={(e) => updateVehicle('CN', index, 'eta', e.target.value)}
                          />
                          {/* Only show Export Loading Link if type is "Nhập khẩu" */}
                          {formData.importExportType === 'Nhập khẩu' && (
                            <div className="col-span-2">
                              <FormInput
                                label="Link xếp hàng (Loading Link)"
                                value={v.exportLoadingLink || ''}
                                onChange={(e) => updateVehicle('CN', index, 'exportLoadingLink', e.target.value)}
                                placeholder="https://..."
                              />
                            </div>
                          )}
                          <div className="col-span-2 pt-2 border-t border-orange-100 mt-1 grid grid-cols-2 gap-3">
                            <FormInput label="Tên lái xe" placeholder="Nhập tên lái xe" value={v.driverName} onChange={(e) => updateVehicle('CN', index, 'driverName', e.target.value)} />
                            <FormInput label="SĐT lái xe" required placeholder="Nhập số điện thoại" value={v.driverPhone} onChange={(e) => updateVehicle('CN', index, 'driverPhone', e.target.value)} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {vehiclesCN.length === 0 && (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">Chưa có thông tin xe</div>
                  )}
                </div>
              </div>

              {/* VN Vehicles */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col h-full">
                <SectionHeader
                  title={`Xe Việt Nam (${vehiclesVN.length})`}
                  icon={Truck}
                  color="text-blue-600"
                  rightElement={
                    <button onClick={() => addVehicle('VN')} className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                      <Plus size={16} /> Thêm xe
                    </button>
                  }
                />

                <div className="space-y-4 flex-1">
                  {vehiclesVN.map((v, index) => (
                    <div key={index} className="border border-blue-100 rounded-xl p-4 bg-blue-50/30 relative group">
                      <div
                        className="flex items-center justify-between mb-2 border-b border-blue-200/50 pb-2 cursor-pointer select-none"
                        onClick={() => toggleVehicleExpansion('VN', index)}
                      >
                        <div className="flex items-center gap-2">
                          {v.isExpanded ? <ChevronDown size={18} className="text-blue-600" /> : <ChevronRight size={18} className="text-blue-400" />}
                          <span className="font-bold text-blue-800 text-sm">Xe VN #{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeVehicle('VN', index); }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Xóa xe"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {v.isExpanded && (
                        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                          <FormInput
                            required
                            label="Biển số xe"
                            value={v.licensePlate}
                            onChange={(e) => updateVehicle('VN', index, 'licensePlate', e.target.value)}
                            placeholder="Nhập biển số xe"
                          />
                          <FormInput
                            required
                            label="Loại xe"
                            type="select"
                            value={v.vehicleType}
                            onChange={(e) => updateVehicle('VN', index, 'vehicleType', e.target.value)}
                            options={[
                              { value: 'Xe tải thùng', label: 'Xe tải thùng' },
                              { value: 'Container 40ft', label: 'Container 40ft' },
                              { value: 'Xe 3 chân', label: 'Xe 3 chân' }
                            ]}
                          />
                          <FormInput
                            required
                            label="Tải trọng"
                            type="select"
                            value={v.payload}
                            onChange={(e) => updateVehicle('VN', index, 'payload', e.target.value)}
                            options={[
                              { value: '1.5 Tấn', label: '1.5 Tấn' },
                              { value: '2.5 Tấn', label: '2.5 Tấn' },
                              { value: '5 Tấn', label: '5 Tấn' },
                              { value: '10 Tấn', label: '10 Tấn' },
                              { value: '15 Tấn', label: '15 Tấn' },
                              { value: '20 Tấn', label: '20 Tấn' },
                              { value: 'Khác', label: 'Khác' }
                            ]}
                          />
                          <FormInput
                            label="Biển kiểm soát mooc"
                            placeholder="Nhập biển kiểm soát mooc"
                            value={v.containerNumber}
                            onChange={(e) => updateVehicle('VN', index, 'containerNumber', e.target.value)}
                          />
                          <FormInput
                            label="Số cont"
                            placeholder="Nhập số cont"
                            value={v.containerNumber}
                            onChange={(e) => updateVehicle('VN', index, 'containerNumber', e.target.value)}
                          />
                          <FormInput
                            required
                            label="Thời gian dự kiến đến"
                            type="datetime-local"
                            value={v.eta || ''}
                            onChange={(e) => updateVehicle('VN', index, 'eta', e.target.value)}
                          />
                          <div className="col-span-2 pt-2 border-t border-blue-100 mt-1 grid grid-cols-2 gap-3">
                            <FormInput label="Tên lái xe" placeholder="Nhập tên lái xe" value={v.driverName} onChange={(e) => updateVehicle('VN', index, 'driverName', e.target.value)} />
                            <FormInput required label="SĐT lái xe" placeholder="Nhập số điện thoại lái xe" value={v.driverPhone} onChange={(e) => updateVehicle('VN', index, 'driverPhone', e.target.value)} />
                          </div>

                          {/* Modified Upload Section for VN Vehicles */}
                          <div className="col-span-2 mt-3 pt-3 border-t border-blue-100">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                  <Upload size={12} /> Giấy C
                                </label>
                                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <p className="text-xs text-gray-500 font-medium">Tải lên file</p>
                                  </div>
                                  <input type="file" className="hidden" />
                                </label>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                  <Upload size={12} /> Sổ thông hành
                                </label>
                                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <p className="text-xs text-gray-500 font-medium">Tải lên file</p>
                                  </div>
                                  <input type="file" className="hidden" />
                                </label>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  ))}
                  {vehiclesVN.length === 0 && (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">Chưa có thông tin xe</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Cargo Info */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 animate-in fade-in slide-in-from-right-8 duration-300">
            <SectionHeader
              title="Bước 3: Thông tin hàng hóa"
              icon={Package}
              rightElement={
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleCargoModeChange('consolidated')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.cargoMode === 'consolidated' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500'}`}
                  >Hàng ghép</button>
                  <button
                    onClick={() => handleCargoModeChange('bulk')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.cargoMode === 'bulk' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500'}`}
                  >Hàng nguyên</button>
                </div>
              }
            />

            <div className="mb-6">
              {formData.cargoMode === 'bulk' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  <FormInput
                    label="Tên hàng hóa"
                    value={cargoItems[0]?.name}
                    onChange={(e) => updateCargoItem(0, 'name', e.target.value)}
                    placeholder="Nhập tên hàng"
                  />
                  <FormInput
                    label="Loại hàng"
                    value={cargoItems[0]?.type}
                    onChange={(e) => updateCargoItem(0, 'type', e.target.value)}
                    placeholder="Nhập loại hàng"
                  />
                  <FormInput
                    label="Kích thước"
                    value={cargoItems[0]?.dimensions}
                    onChange={(e) => updateCargoItem(0, 'dimensions', e.target.value)}
                    placeholder="Nhập kích thước"
                  />
                  <FormInput
                    label="Số lượng"
                    value={cargoItems[0]?.quantity}
                    onChange={(e) => updateCargoItem(0, 'quantity', e.target.value)}
                    placeholder="VD: 30 Tấn"
                  />
                  <FormInput
                    label="Quy cách đóng gói"
                    value={cargoItems[0]?.packingSpec}
                    onChange={(e) => updateCargoItem(0, 'packingSpec', e.target.value)}
                    placeholder="VD: Đổ rời / Bao jumbo"
                  />
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden block animate-in fade-in duration-300">
                    <thead className="bg-gray-50 block w-full">
                      <tr className="grid grid-cols-12 gap-2 px-4 py-3">
                        <th className="col-span-1 text-left text-xs font-bold text-gray-500 uppercase">STT</th>
                        <th className="col-span-3 text-left text-xs font-bold text-gray-500 uppercase">Tên hàng hóa</th>
                        <th className="col-span-2 text-left text-xs font-bold text-gray-500 uppercase">Loại hàng</th>
                        <th className="col-span-1 text-left text-xs font-bold text-gray-500 uppercase">Số lượng</th>
                        <th className="col-span-1 text-left text-xs font-bold text-gray-500 uppercase">Quy cách</th>
                        <th className="col-span-1 text-left text-xs font-bold text-gray-500 uppercase">Kích thước</th>
                        <th className="col-span-2 text-left text-xs font-bold text-gray-500 uppercase">Packing List</th>
                        <th className="col-span-1"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 block w-full">
                      {cargoItems.map((item, idx) => (
                        <tr key={idx} className="grid grid-cols-12 gap-2 px-4 py-3 items-start group hover:bg-gray-50">
                          <td className="col-span-1 py-2 text-sm font-medium text-gray-500 flex items-center h-full">{idx + 1}</td>
                          <td className="col-span-3">
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-brand-green focus:border-brand-green text-sm"
                              placeholder="Nhập tên hàng"
                              value={item.name}
                              onChange={(e) => updateCargoItem(idx, 'name', e.target.value)}
                            />
                          </td>
                          <td className="col-span-2">
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-brand-green focus:border-brand-green text-sm"
                              placeholder="Loại hàng"
                              value={item.type}
                              onChange={(e) => updateCargoItem(idx, 'type', e.target.value)}
                            />
                          </td>
                          <td className="col-span-1">
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-brand-green focus:border-brand-green text-sm"
                              placeholder="SL"
                              value={item.quantity}
                              onChange={(e) => updateCargoItem(idx, 'quantity', e.target.value)}
                            />
                          </td>
                          <td className="col-span-1">
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-brand-green focus:border-brand-green text-sm"
                              placeholder="Quy cách"
                              value={item.packingSpec}
                              onChange={(e) => updateCargoItem(idx, 'packingSpec', e.target.value)}
                            />
                          </td>
                          <td className="col-span-1">
                            <input
                              type="text"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-brand-green focus:border-brand-green text-sm"
                              placeholder="D x R x C"
                              value={item.dimensions}
                              onChange={(e) => updateCargoItem(idx, 'dimensions', e.target.value)}
                            />
                          </td>

                          <td className="col-span-2">
                            {item.packingListFile ? (
                              <div className="flex items-center gap-1 bg-green-50 text-brand-green px-2 py-1.5 rounded border border-green-200 max-w-full">
                                <Paperclip size={12} className="shrink-0" />
                                <span className="text-xs truncate max-w-[80px]" title={typeof item.packingListFile === 'string' ? item.packingListFile : item.packingListFile.name}>
                                  {typeof item.packingListFile === 'string' ? item.packingListFile : item.packingListFile.name}
                                </span>
                                <button title="Xóa" onClick={() => removeCargoFile(idx)} className="ml-auto text-green-700 hover:text-red-500">
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex items-center justify-center gap-1 w-full px-2 py-1.5 border border-dashed border-gray-300 rounded hover:border-brand-green hover:bg-green-50 hover:text-brand-green text-gray-500 transition-colors text-xs font-semibold">
                                <Upload size={12} />
                                <span>Upload</span>
                                <input type="file" className="hidden" onChange={(e) => handleCargoFileChange(idx, e)} />
                              </label>
                            )}
                          </td>

                          <td className="col-span-1 flex justify-center py-1">
                            <button
                              title="Xóa"
                              onClick={() => removeCargoItem(idx)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={addCargoItem}
                    className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:border-brand-green hover:text-brand-green transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Thêm hàng hóa
                  </button>
                </>
              )}
            </div>

            {/* Packing List Upload Section - Only Show for Bulk Mode */}
            {formData.cargoMode === 'bulk' && (
              <div className="pt-6 border-t border-gray-100">
                <label className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-brand-green" /> Upload Packing List (Tổng)
                </label>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-brand-green" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Nhấn để tải lên hoặc kéo thả file vào đây</p>
                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ định dạng: .xlsx, .xls, .pdf, .doc, .docx (Tối đa 10MB)</p>
                  </div>
                  <input title="Upload Packing List" type="file" className="hidden" />
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBooking;