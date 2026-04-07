import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { boiBlue, boiOrange, boiBorder, boiMutedText } from '../../theme/theme';

function TabLabel({ num, text, active }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 0.75,
        color: active ? boiBlue : boiMutedText,
        fontWeight: active ? 700 : 500,
        fontSize: 15,
      }}
    >
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 15, color: 'inherit' }}>
        {num}
      </Typography>
      <Typography component="span" sx={{ fontWeight: 'inherit', fontSize: 15, color: 'inherit' }}>
        {text}
      </Typography>
    </Box>
  );
}

export function FormTabs({ value, onChange }) {
  const idx = value === 'view' ? 0 : 1;

  return (
    <Box
      sx={{
        position: 'relative',
        borderBottom: `2px solid ${boiBorder}`,
        mb: 2.5,
        bgcolor: '#fff',
        borderRadius: '12px 12px 0 0',
        px: 1,
        pt: 0.5,
      }}
    >
      <Tabs
        value={idx}
        onChange={(_, v) => onChange(v === 0 ? 'view' : 'add')}
        variant="fullWidth"
        sx={{
          minHeight: 58,
          '& .MuiTab-root': {
            minHeight: 58,
            textTransform: 'none',
            py: 1.5,
            px: 2,
            borderRadius: '10px 10px 0 0',
            color: boiMutedText,
            '&.Mui-selected': {
              color: boiBlue,
              bgcolor: 'transparent',
            },
          },
          '& .MuiTabs-indicator': {
            height: 4,
            bgcolor: boiBlue,
            borderRadius: '4px 4px 0 0',
          },
        }}
      >
        <Tab disableRipple label={<TabLabel num="01" text="View Approval Forms" active={idx === 0} />} />
        <Tab disableRipple label={<TabLabel num="02" text="Add Approval Form" active={idx === 1} />} />
      </Tabs>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: -2,
          left: idx === 0 ? '25%' : '75%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `10px solid ${boiOrange}`,
          zIndex: 1,
        }}
      />
    </Box>
  );
}
