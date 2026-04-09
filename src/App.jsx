import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/ToastContext";
import Layout from "./components/layout/Layout";
import VettingPage from "./pages/Vetting/VettingPage";

function App({ route = "/" }) {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to={route} replace />} />
          <Route path="/vetting" element={<VettingPage />} />
          <Route path="*" element={<Navigate to={route} replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App;
