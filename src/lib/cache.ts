
/**
 * Simple offline cache manager using localStorage
 */
export const cacheManager = {
  set: (key: string, data: any) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(data));
      localStorage.setItem(`cache_time_${key}`, Date.now().toString());
    } catch (e) {
      console.error('Error saving to cache', e);
    }
  },
  get: (key: string, ttlMs: number = 3600000) => {
    try {
      const data = localStorage.getItem(`cache_${key}`);
      const time = localStorage.getItem(`cache_time_${key}`);
      
      if (!data || !time) return null;
      
      if (Date.now() - parseInt(time) > ttlMs) {
        return null; // Expired
      }
      
      return JSON.parse(data);
    } catch (e) {
      console.error('Error getting from cache', e);
      return null;
    }
  }
};
