import Box from '@mui/material/Box';
import { AppSidebar } from './AppSidebar';

export function MainLayout({ children }) {
  return (
    <Box
      component="main"
      id="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        gap: 2,
        p: 2,
        maxWidth: 1760,
        mx: 'auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <AppSidebar />
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
