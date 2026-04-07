import Chip from '@mui/material/Chip';

const STATUS_STYLES = {
  Approved: { bg: '#e3f2e5', color: '#1b5e20' },
  Draft: { bg: '#fff4e8', color: '#bf360c' },
  Pending: { bg: '#e3f0fb', color: '#0d47a1' },
  'Not approved': { bg: '#fdecea', color: '#b71c1c' },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: '#f0f2f4', color: '#455a64' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 600,
        borderRadius: 999,
        height: 26,
        fontSize: 12,
        '& .MuiChip-label': { px: 1.25 },
      }}
    />
  );
}
