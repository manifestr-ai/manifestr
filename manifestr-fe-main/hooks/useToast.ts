import { useCallback } from 'react';

export const useToast = () => {
  const showToast = useCallback((message: string, type?: string) => {
    console.log(`[Toast ${type || 'info'}]:`, message);
    // You can integrate with a toast library here (react-hot-toast, sonner, etc.)
    // For now, just logging to console
  }, []);

  return { showToast };
};
