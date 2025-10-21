import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  colorClass: string;
  bgClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, colorClass, bgClass }) => {
  return (
    <div className={`border ${colorClass} ${bgClass} p-4 md:p-6 rounded-lg shadow-sm`}>
      <h2 className={`text-sm font-semibold ${colorClass.replace('border-', 'text-').replace('500', '300')}`}>
        {title}
      </h2>
      <p className={`text-lg font-bold ${colorClass.replace('border-', 'text-')}`}>
        {value}
      </p>
    </div>
  );
};

export default StatsCard;