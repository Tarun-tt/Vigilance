import { useSnackbar } from 'notistack';

export function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const toast = (message, variant = 'default') => {
    enqueueSnackbar(message, { variant });
  };

  return { toast, success: (m) => toast(m, 'success'), error: (m) => toast(m, 'error'), closeSnackbar };
}
