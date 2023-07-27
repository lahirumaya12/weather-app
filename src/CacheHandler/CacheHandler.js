export const cacheData = (data, cityCode, CacheExpiration) => {
    const timestamp = new Date().getTime();
    const cachedData = {
      timestamp,
      data,
      CacheExpiration,
    };
    localStorage.setItem(`weatherData_${cityCode}`, JSON.stringify(cachedData));
  };
  

  export const getCachedData = (cityCode) => {
    const cachedData = localStorage.getItem(`weatherData_${cityCode}`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const { timestamp, data, CacheExpiration } = parsedData;
      const currentTime = new Date().getTime();
      if (currentTime - timestamp <= CacheExpiration) {
        console.log("data  " + data);
      return data;
      } else {
        console.log("removeItem");
        localStorage.removeItem(`weatherData_${cityCode}`);
      }
    }
    return null;
  };