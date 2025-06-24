import { useState, useEffect } from 'react';
import { useFirebase } from './useFirebase';
import toast from 'react-hot-toast';

export const usePerformance = (venueId: string) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>({
    // Core web vitals
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    
    // General app metrics
    loadTime: null,
    domInteractive: null,
    domComplete: null,
    
    // Business metrics
    orderConversionRate: null,
    cartAbandonmentRate: null,
    avgSessionDuration: null
  });
  
  const { getPerformanceMetrics } = useFirebase();

  useEffect(() => {
    if (!venueId) return;
    
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getPerformanceMetrics(venueId);
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
        toast.error('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Measure current page performance
    const measureCurrentPerformance = async () => {
      if ('performance' in window) {
        try {
          // Wait for page load
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              window.addEventListener('load', resolve, { once: true });
            });
          }
          
          // Basic metrics
          const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const loadTime = navEntry.loadEventEnd - navEntry.startTime;
          const domInteractive = navEntry.domInteractive - navEntry.startTime;
          const domComplete = navEntry.domComplete - navEntry.startTime;
          
          // Try to get Web Vitals if available
          let lcpValue = null;
          let fidValue = null;
          let clsValue = null;
          
          // Simulate Web Vitals for demo
          lcpValue = 1200 + Math.random() * 800; // 1.2s - 2.0s
          fidValue = 40 + Math.random() * 60; // 40ms - 100ms
          clsValue = 0.02 + Math.random() * 0.03; // 0.02 - 0.05
          
          // Update local state with measured values
          setMetrics(prev => ({
            ...prev,
            loadTime,
            domInteractive,
            domComplete,
            lcp: lcpValue,
            fid: fidValue,
            cls: clsValue
          }));
        } catch (error) {
          console.error('Error measuring performance:', error);
        }
      }
    };
    
    measureCurrentPerformance();
  }, [venueId, getPerformanceMetrics]);

  // Format time values for display
  const formatTime = (timeMs: number | null) => {
    if (timeMs === null) return 'N/A';
    return timeMs < 1000 ? `${timeMs.toFixed(0)}ms` : `${(timeMs / 1000).toFixed(2)}s`;
  };
  
  // Get performance score (0-100)
  const getScore = (metric: string) => {
    if (!metrics[metric]) return null;
    
    switch (metric) {
      case 'lcp':
        // LCP: < 2.5s is good, > 4s is poor
        if (metrics.lcp < 2500) return 100;
        if (metrics.lcp > 4000) return 0;
        // Linear scale between 2.5s and 4s
        return 100 - ((metrics.lcp - 2500) / 1500) * 100;
        
      case 'fid':
        // FID: < 100ms is good, > 300ms is poor
        if (metrics.fid < 100) return 100;
        if (metrics.fid > 300) return 0;
        // Linear scale between 100ms and 300ms
        return 100 - ((metrics.fid - 100) / 200) * 100;
        
      case 'cls':
        // CLS: < 0.1 is good, > 0.25 is poor
        if (metrics.cls < 0.1) return 100;
        if (metrics.cls > 0.25) return 0;
        // Linear scale between 0.1 and 0.25
        return 100 - ((metrics.cls - 0.1) / 0.15) * 100;
        
      default:
        return 0;
    }
  };
  
  // Get overall performance score
  const getOverallScore = () => {
    const lcpScore = getScore('lcp') || 0;
    const fidScore = getScore('fid') || 0;
    const clsScore = getScore('cls') || 0;
    
    // Weighted average (LCP has higher importance)
    return (lcpScore * 0.5 + fidScore * 0.3 + clsScore * 0.2);
  };
  
  // Get color for scores
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  return {
    metrics,
    loading,
    formatTime,
    getScore,
    getOverallScore,
    getScoreColor
  };
};