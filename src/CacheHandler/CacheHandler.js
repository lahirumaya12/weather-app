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
      return data;
    } else {
      localStorage.removeItem(`weatherData_${cityCode}`);
    }
  } else {
  }
  return null;
};
