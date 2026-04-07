import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation, useNavigate } from 'react-router-dom';
import { STAGES, getSidebarPath, matchRoute } from '../../app/routeConfig';
import { boiBlue, boiOrange, boiFilterBg, boiBorder, boiMutedText } from '../../theme/theme';

const stages = STAGES;
const connectorColor = 'rgba(0, 93, 170, 0.35)';
const subMutedBlue = '#3d6d99';

function isSubItemActive(pathname, stageId, subItemId) {
  const hit = matchRoute(pathname);
  return hit?.route.stageId === stageId && hit?.route.subItemId === subItemId;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const hit = matchRoute(location.pathname);
  const activeStage = hit?.route.stageId ?? 1;

  return (
    <Box
      sx={{
        width: 300,
        flexShrink: 0,
        bgcolor: boiFilterBg,
        borderRadius: '12px',
        p: 1.75,
        alignSelf: 'flex-start',
        border: `1px solid ${boiBorder}`,
        boxShadow: '0 2px 12px rgba(0, 45, 90, 0.06)',
      }}
    >
      <List disablePadding>
        {stages.map((s, stageIndex) => {
          const isStageActive = s.id === activeStage;
          const isLast = stageIndex === stages.length - 1;
          return (
            <Box key={s.id} sx={{ display: 'flex', gap: 1.25, mb: 0.75 }}>
              <Box
                sx={{
                  width: 36,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: `2px solid ${isStageActive ? '#fff' : boiBorder}`,
                    bgcolor: '#fff',
                    color: isStageActive ? boiOrange : boiBlue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    zIndex: 1,
                    boxShadow: isStageActive ? `0 0 0 2px ${boiOrange}` : 'none',
                  }}
                >
                  {s.id}
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      minHeight: 14,
                      bgcolor: connectorColor,
                      borderRadius: 1,
                      my: 0.35,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    px: 1.25,
                    py: 0.85,
                    background: isStageActive
                      ? `linear-gradient(90deg, ${boiOrange} 0%, ${boiBlue} 100%)`
                      : 'transparent',
                    color: isStageActive ? '#fff' : boiMutedText,
                  }}
                >
                  <Typography sx={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{s.label}</Typography>
                  {isStageActive && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChevronRightIcon sx={{ fontSize: 18, color: '#fff' }} />
                    </Box>
                  )}
                </Box>

                <List component="div" disablePadding sx={{ pl: 0.5, pt: 0.65 }}>
                  {s.subItems.map((sub) => {
                    const selected = isSubItemActive(location.pathname, s.id, sub.id);
                    const target = getSidebarPath(s.id, sub.id);
                    return (
                      <ListItemButton
                        key={sub.id}
                        selected={selected}
                        onClick={() => navigate(target)}
                        sx={{
                          borderRadius: '8px',
                          py: 0.55,
                          mb: 0.2,
                          pl: 1,
                          '&.Mui-selected': {
                            bgcolor: 'rgba(243, 112, 33, 0.1)',
                            '&:hover': { bgcolor: 'rgba(243, 112, 33, 0.14)' },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            mr: 1,
                            bgcolor: selected ? boiOrange : 'transparent',
                            flexShrink: 0,
                          }}
                        />
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: selected ? 700 : 500,
                            color: selected ? boiOrange : subMutedBlue,
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}
