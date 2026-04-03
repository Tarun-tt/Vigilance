import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../Dashboard";
import StepperFiveSteps from "../../StepperFiveSteps";
import StepperThreeSteps from "../../StepperThreeSteps";
import SectionPlaceholder from "../../SectionPlaceholder";
import SectionWithTable from "../../SectionWithTable";
import SimpleFormExample from "../../SimpleFormExample";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<DashboardContent />} />
        <Route path="section-1-1" element={<StepperFiveSteps />} />
        <Route path="section-1-2" element={<StepperThreeSteps />} />
        <Route path="section-1-3" element={<SectionWithTable />} />
        <Route path="section-2-1" element={<SectionWithTable />} />
        <Route
          path="section-2-2"
          element={
            <SectionPlaceholder title="Section 2.2 - Compliance Checks" />
          }
        />
        <Route
          path="section-2-3"
          element={<SectionPlaceholder title="Section 2.3 - Risk Assessment" />}
        />
      </Route>
    </Routes>
  );
};

const DashboardContent = () => {
  return (
    <div>
      <h2>Welcome to BOI Vigilance</h2>
      <p>Select an option from the sidebar to get started.</p>
    </div>
  );
};

export default AppRoutes;
