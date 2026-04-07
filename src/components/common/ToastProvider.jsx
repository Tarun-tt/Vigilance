import { SnackbarProvider } from 'notistack';

export function ToastProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={4000}
    >
      {children}
    </SnackbarProvider>
  );
}
