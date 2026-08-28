import { useMemo } from 'react';
import { useCallSimulation } from '../context/CallSimulationContext';
import { getVerdictFromScore, getThreatColor } from '../utils/riskCalculator';
import { SCAM_CATEGORIES } from '../utils/constants';

export const useRealtimeRisk = () => {
  const sim = useCallSimulation();

  const verdict = useMemo(() => {
    return getVerdictFromScore(sim.currentRiskScore);
  }, [sim.currentRiskScore]);

  const threatStyles = useMemo(() => {
    return getThreatColor(sim.currentRiskScore);
  }, [sim.currentRiskScore]);

  const categoryMeta = useMemo(() => {
    return SCAM_CATEGORIES[sim.currentCategory] || SCAM_CATEGORIES.NONE;
  }, [sim.currentCategory]);

  return {
    ...sim,
    verdict,
    threatStyles,
    categoryMeta,
  };
};
