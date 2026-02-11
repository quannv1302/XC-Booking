import React from 'react';
import { Layers, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatMetric } from '../types';

const stats: StatMetric[] = [
  { label: 'Tổng số Kế hoạch', value: 45, type: 'total', icon: Layers },
  { label: 'Đang thực hiện', value: 12, type: 'processing', icon: Activity },
  { label: 'Đã hoàn thành', value: 28, type: 'completed', icon: CheckCircle2 },
  { label: 'Có cảnh báo', value: 5, type: 'warning', icon: AlertTriangle },
];

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        
        let colorClasses = '';
        switch(stat.type) {
          case 'total': colorClasses = 'bg-blue-50 text-blue-600'; break;
          case 'processing': colorClasses = 'bg-yellow-50 text-yellow-600'; break;
          case 'completed': colorClasses = 'bg-emerald-50 text-emerald-600'; break;
          case 'warning': colorClasses = 'bg-red-50 text-red-600'; break;
        }

        return (
          <div key={idx} className={`p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group`}>
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">{stat.label}</p>
              <h3 className="text-4xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses}`}>
              <Icon size={28} strokeWidth={2.5} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;