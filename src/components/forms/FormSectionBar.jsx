import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { boiBlue, boiTableHeaderBg, boiBorder } from '../../theme/theme';

export function FormSectionBar({ title, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: boiTableHeaderBg,
        border: `1px solid ${boiBorder}`,
        borderRadius: '10px 10px 0 0',
        px: 2,
        py: 1,
        mb: 0,
      }}
    >
      <Typography sx={{ flex: 1, fontWeight: 700, fontSize: 14, color: boiBlue }}>{title}</Typography>
      {action}
    </Box>
  );
}
