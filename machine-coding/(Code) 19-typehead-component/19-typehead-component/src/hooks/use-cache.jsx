import {useRef} from "react";

// Utility function to get the current timestamp
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

// Custom hook for cache management with expiration
const useCache = (key, expirationInSeconds) => {
  const cache = useRef(JSON.parse(localStorage.getItem(key)) || {});

  const setCache = (query, data) => {
    const timestamp = getCurrentTimestamp();
    cache.current[query] = {data, timestamp};
    localStorage.setItem(key, JSON.stringify(cache.current));
  };

  const getCache = (query) => {
    const cachedData = cache.current[query];
    if (cachedData) {
      const {data, timestamp} = cachedData;
      if (getCurrentTimestamp() - timestamp < expirationInSeconds) {
        return data;
      } else {
        // Cache expired
        delete cache.current[query];
        localStorage.setItem(key, JSON.stringify(cache.current));
      }
    }
    return null;
  };

  return {setCache, getCache};
};

export default useCache;
