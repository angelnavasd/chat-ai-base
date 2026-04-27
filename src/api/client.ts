import axios from 'axios';

const IS_MOCK = import.meta.env.VITE_USE_MOCKS === 'true';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Interceptor: attach Firebase token to every request
apiClient.interceptors.request.use(async (config) => {
  if (IS_MOCK) return config;

  // Dynamic import to avoid loading firebase in mock mode unnecessarily
  const { getAuth } = await import('firebase/auth');
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { IS_MOCK };
