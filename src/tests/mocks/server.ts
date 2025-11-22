// Mock server setup for testing
// This can be extended with MSW (Mock Service Worker) if needed

export const mockApiResponse = <T>(data: T, delay = 0): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message: string, status = 500): Promise<never> => {
  return Promise.reject({
    response: {
      status,
      data: { message },
    },
  });
};


