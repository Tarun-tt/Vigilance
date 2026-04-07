import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { boiBlue, boiBorder, boiSuccessGreen, boiMutedText } from '../../theme/theme';

export function HorizontalStepper({ steps, activeIndex, onStepChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          borderBottom: `2px solid ${boiBorder}`,
          position: 'relative',
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const color = isActive ? boiBlue : isComplete ? boiSuccessGreen : boiMutedText;

          return (
            <Box
              key={step.id}
              onClick={() => onStepChange(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onStepChange(index);
                }
              }}
              sx={{
                flex: '1 1 160px',
                minWidth: 140,
                cursor: 'pointer',
                textAlign: 'center',
                py: 1.75,
                px: 1,
                position: 'relative',
                borderBottom: isActive ? `4px solid ${boiBlue}` : '4px solid transparent',
                marginBottom: '-2px',
                '&:hover': { bgcolor: 'rgba(0, 93, 170, 0.05)' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  flexWrap: 'wrap',
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 14, color }}>{step.label}</Typography>
                {isComplete && <CheckCircleIcon sx={{ fontSize: 20, color: boiSuccessGreen }} />}
              </Box>
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: `10px solid ${boiBlue}`,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
