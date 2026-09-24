import React from 'react';
import { StatCard } from '../common/StatCard';
import { ShieldCheck, PhoneCall, BellRing, Cpu } from 'lucide-react';
import { ThreatMetric } from '../../types/fraud.types';

interface MetricsCardProps {
  metrics: ThreatMetric[];
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ metrics }) => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <PhoneCall className="w-5 h-5" />;
      case 1:
        return <ShieldCheck className="w-5 h-5" />;
      case 2:
        return <BellRing className="w-5 h-5" />;
      case 3:
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  const getVariant = (index: number): 'primary' | 'cyan' | 'safe' | 'fraud' | 'neutral' => {
    switch (index) {
      case 0: return 'safe';     // Protected Voice Calls -> Emerald/Teal
      case 1: return 'fraud';    // Scams Intercepted -> Ruby/Red
      case 2: return 'neutral';  // Elder Guardian Alerts -> Amber
      case 3: return 'cyan';     // Detection Latency -> Cyan/Electric Blue
      default: return 'neutral';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric: ThreatMetric, idx: number) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          isPositive={metric.isPositive}
          subtitle={metric.subtitle}
          icon={getIcon(idx)}
          variant={getVariant(idx)}
        />
      ))}
    </div>
  );
};
