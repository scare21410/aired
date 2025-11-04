import type { RouteObject } from 'react-router-dom';
import Layout from './layout.js';
import ProjectList from './pages/project-list.js';
import ProjectDetail from './pages/project-detail.js';

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
