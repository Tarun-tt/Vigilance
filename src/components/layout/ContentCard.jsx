import Box from '@mui/material/Box';

export function ContentCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        p: { xs: 2, sm: 2.5 },
        boxShadow: '0 4px 28px rgba(0, 45, 90, 0.08)',
        border: '1px solid #e3eaf2',
        minHeight: 320,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
