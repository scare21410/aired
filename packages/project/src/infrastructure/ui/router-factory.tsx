import { AppLayout } from '@aired/ui';
import { Outlet, type RouteObject, useParams } from 'react-router-dom';
import ProjectList from './pages/project-list.js';
import ProjectDetail from './pages/project-detail.js';

const Layout = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <AppLayout organizationId={organizationId!}>
      <Outlet />
    </AppLayout>
  );
};

export default function routerFactory() {
  return {
    path: 'organizations/:organizationId/projects',
    Component: Layout,
    children: [
      {
        index: true,
        Component: ProjectList,
      },
      {
        path: ':id',
        Component: ProjectDetail,
      },
    ],
  } satisfies RouteObject;
}
