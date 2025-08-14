'use client';

import { useState, useEffect, useCallback } from 'react';

const DAILY_LIMIT = 10;
const USAGE_KEY = 'dentalNameCraftUsage';

interface UsageData {
  count: number;
  timestamp: number;
}

export function useUsageTracker() {
  const [usageData, setUsageData] = useState<UsageData>({ count: 0, timestamp: 0 });

  useEffect(() => {
    try {
      const storedUsage = localStorage.getItem(USAGE_KEY);
      if (storedUsage) {
        const parsed: UsageData = JSON.parse(storedUsage);
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;

        // Reset if it's been more than 24 hours
        if (now - parsed.timestamp > oneDay) {
          localStorage.removeItem(USAGE_KEY);
          setUsageData({ count: 0, timestamp: 0 });
        } else {
          setUsageData(parsed);
        }
      }
    } catch (error) {
      console.error('Could not access usage data from localStorage:', error);
    }
  }, []);

  const canGenerate = useCallback(() => {
    return usageData.count < DAILY_LIMIT;
  }, [usageData.count]);

  const recordGeneration = useCallback(() => {
    setUsageData(prevData => {
      const isFirstGeneration = prevData.count === 0;
      const newCount = prevData.count + 1;
      const newTimestamp = isFirstGeneration ? new Date().getTime() : prevData.timestamp;

      const newData: UsageData = {
        count: newCount,
        timestamp: newTimestamp,
      };
      
      try {
        localStorage.setItem(USAGE_KEY, JSON.stringify(newData));
      } catch (error) {
         console.error('Could not save usage data to localStorage:', error);
      }

      return newData;
    });
  }, []);

  return { usageData, canGenerate, recordGeneration };
}
