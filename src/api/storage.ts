export const saveToStorage = (key: string, data: unknown): Promise<void> => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 2000 + 1000;
    const shouldFail = Math.random() < 0.1;

    setTimeout(() => {
      try {
        if (shouldFail) {
          reject(new Error('Failed to save data'));
          return;
        }
        localStorage.setItem(key, JSON.stringify(data));
        resolve();
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};

export const fetchFromStorage = <T>(key: string): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 1000 + 500;

    setTimeout(() => {
      try {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : null);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};
