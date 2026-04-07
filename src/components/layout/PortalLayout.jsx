import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

export function PortalLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
