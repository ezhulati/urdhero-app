import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface WaiterCallState {
  [tableId: string]: {
    isCalled: boolean;
    calledAt: Date;
    callerId?: string;
  };
}

const WAITER_CALL_STORAGE_KEY = 'urdhero-waiter-calls';

export const useWaiterCall = () => {
  const [calls, setCalls] = useState<WaiterCallState>({});
  const [loading, setLoading] = useState(true);

  // Load calls from localStorage on mount
  useEffect(() => {
    try {
      const savedCalls = localStorage.getItem(WAITER_CALL_STORAGE_KEY);
      if (savedCalls) {
        const parsedCalls = JSON.parse(savedCalls);
        // Convert date strings back to Date objects
        Object.keys(parsedCalls).forEach(tableId => {
          if (parsedCalls[tableId].calledAt) {
            parsedCalls[tableId].calledAt = new Date(parsedCalls[tableId].calledAt);
          }
        });
        setCalls(parsedCalls);
      }
    } catch (error) {
      console.error('Error loading waiter calls from localStorage:', error);
      localStorage.removeItem(WAITER_CALL_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save calls to localStorage whenever calls change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(WAITER_CALL_STORAGE_KEY, JSON.stringify(calls));
      } catch (error) {
        console.error('Error saving waiter calls to localStorage:', error);
      }
    }
  }, [calls, loading]);

  const callWaiter = (tableId: string, callerId?: string) => {
    if (calls[tableId]?.isCalled) {
      toast.error('Kamarierin është thirrur tashmë për këtë tavolinë');
      return false;
    }

    setCalls(prev => ({
      ...prev,
      [tableId]: {
        isCalled: true,
        calledAt: new Date(),
        callerId
      }
    }));

    toast.success('Kamarierin është thirrur me sukses!', {
      duration: 4000,
      icon: '🔔'
    });

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    return true;
  };

  const resetCall = (tableId: string) => {
    setCalls(prev => {
      const newCalls = { ...prev };
      delete newCalls[tableId];
      return newCalls;
    });

    toast.success(`Thirrja për ${tableId} u rivendos`, {
      duration: 2000,
      icon: '✅'
    });
  };

  const resetAllCalls = () => {
    setCalls({});
    toast.success('Të gjitha thirrjet u rivendosën', {
      duration: 2000,
      icon: '✅'
    });
  };

  const isWaiterCalled = (tableId: string) => {
    return calls[tableId]?.isCalled || false;
  };

  const getCallInfo = (tableId: string) => {
    return calls[tableId] || null;
  };

  const getAllCalls = () => {
    return Object.entries(calls)
      .filter(([_, call]) => call.isCalled)
      .map(([tableId, call]) => ({
        tableId,
        ...call
      }));
  };

  const getPendingCallsCount = () => {
    return Object.values(calls).filter(call => call.isCalled).length;
  };

  return {
    callWaiter,
    resetCall,
    resetAllCalls,
    isWaiterCalled,
    getCallInfo,
    getAllCalls,
    getPendingCallsCount,
    loading
  };
};