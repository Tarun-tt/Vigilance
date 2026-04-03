import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar, Container } from "@mui/material";
import Sidebar from "./Sidebar";

function Dashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
