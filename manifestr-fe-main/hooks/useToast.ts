import { useToast as useToastContext } from '../components/ui/Toast';

export const useToast = () => {
  const { success, error, info } = useToastContext();

  const showToast = (message: string, type?: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        success(message);
        break;
      case 'error':
        error(message);
        break;
      case 'info':
      default:
        info(message);
        break;
    }
  };

  return { showToast, success, error, info };
};
