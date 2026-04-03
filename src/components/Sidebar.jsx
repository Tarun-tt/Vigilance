// components/Sidebar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Numbers as NumbersIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

const menuItems = [
  {
    id: "1",
    title: "Section 1",
    icon: <NumbersIcon />,
    children: [
      { id: "1.1", title: "1.1 For 5 Steps", path: "/section-1-1" },
      { id: "1.2", title: "1.2 for 3 Steps", path: "/section-1-2" },
      { id: "1.3", title: "1.3 - Case Management", path: "/section-1-3" },
    ],
  },
  {
    id: "2",
    title: "Section 2",
    icon: <DashboardIcon />,
    children: [
      { id: "2.1", title: "2.1 - Audit Reports", path: "/section-2-1" },
      { id: "2.2", title: "2.2 - Compliance Checks", path: "/section-2-2" },
      { id: "2.3", title: "2.3 - Risk Assessment", path: "/section-2-3" },
    ],
  },
];

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get the current path without hash for HashRouter
  const currentPath = location.pathname;

  const [openSections, setOpenSections] = useState(() => {
    // Initialize sections that should be open based on current path
    const initialOpen = {};
    menuItems.forEach((section) => {
      const hasActiveChild = section.children.some(
        (child) => currentPath === child.path,
      );
      if (hasActiveChild) {
        initialOpen[section.id] = true;
      }
    });
    return initialOpen;
  });

  // Handle auto-open sections when path changes - Fixed infinite loop
  useEffect(() => {
    menuItems.forEach((section) => {
      const hasActiveChild = section.children.some(
        (child) => currentPath === child.path,
      );

      setOpenSections((prev) => {
        // Only update if the state actually needs to change
        if (hasActiveChild && !prev[section.id]) {
          return { ...prev, [section.id]: true };
        }
        return prev;
      });
    });
  }, [currentPath]); // Only depend on currentPath, not openSections

  const handleSectionClick = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (isMobile && handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  const isActive = (path) => {
    return currentPath === path;
  };

  const isSectionActive = (section) => {
    return section.children.some((child) => isActive(child.path));
  };

  const drawer = (
    <>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          BOI VIGILANCE
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((section) => {
          const sectionActive = isSectionActive(section);
          const isOpen = openSections[section.id];

          return (
            <React.Fragment key={section.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSectionClick(section.id)}
                  sx={{
                    ...(sectionActive &&
                      !isOpen && {
                        bgcolor: "#e8f5e9",
                        "&:hover": {
                          bgcolor: "#c8e6c9",
                        },
                      }),
                    ...(isOpen && {
                      bgcolor: "#e8f5e9",
                      borderLeft: "4px solid #2e7d32",
                      "&:hover": {
                        bgcolor: "#c8e6c9",
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: sectionActive || isOpen ? "#2e7d32" : "#666",
                    }}
                  >
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.title}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: sectionActive || isOpen ? "bold" : 500,
                        color: sectionActive || isOpen ? "#2e7d32" : "#333",
                      },
                    }}
                  />
                  {isOpen ? (
                    <ExpandLess sx={{ color: "#2e7d32" }} />
                  ) : (
                    <ExpandMore
                      sx={{
                        color: sectionActive && !isOpen ? "#2e7d32" : "#666",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.children.map((child) => (
                    <ListItemButton
                      key={child.id}
                      sx={{
                        pl: 4,
                        ...(isActive(child.path) && {
                          bgcolor: "#c8e6c9",
                          borderLeft: "4px solid #2e7d32",
                          "&:hover": {
                            bgcolor: "#a5d6a7",
                          },
                        }),
                        "&:hover": {
                          bgcolor: "#e0e0e0",
                        },
                      }}
                      onClick={() => handleMenuItemClick(child.path)}
                    >
                      <ListItemText
                        primary={child.title}
                        primaryTypographyProps={{
                          sx: {
                            ...(isActive(child.path) && {
                              color: "#2e7d32",
                              fontWeight: "bold",
                            }),
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#f5f5f5",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}

export default Sidebar;
