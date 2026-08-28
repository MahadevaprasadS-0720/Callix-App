import { useState, useEffect, useCallback } from 'react';
import { CallRecord } from '../types/call.types';
import { firestoreService } from '../services/firestoreService';

export const useCallHistory = () => {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    try {
      setLoading(true);
      const data = await firestoreService.getCalls();
      setCalls(data);
      setError(null);
    } catch (err) {
      setError('Failed to load call history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const deleteCall = async (callId: string) => {
    await firestoreService.deleteCall(callId);
    setCalls((prev: CallRecord[]) => prev.filter((c: CallRecord) => c.callId !== callId));
  };

  const resetCalls = () => {
    const fresh = firestoreService.resetDemoCalls();
    setCalls(fresh);
  };

  return {
    calls,
    loading,
    error,
    refetch: fetchCalls,
    deleteCall,
    resetCalls,
  };
};
