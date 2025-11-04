import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

async function loadProjectRoutes() {
  const { routerFactory: projectRouterFactory } = await import(
    '@aired/project'
  );
  return projectRouterFactory();
}

export default function routerFactory() {
  return {
    path: '/',
    element: (
      <div>
        <header>
          <h1>Aired App</h1>
          <nav>
            <a href="/organizations/e03e7324-931a-488f-a6a4-f367da43054b/projects">
              Organization A Projects
            </a>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    ),
    children: [
      {
        path: 'organizations/:organizationId/projects',
        lazy: async () => {
          const route = await loadProjectRoutes();
          return {
            Component: route.Component,
            children: route.children,
          };
        },
      },
    ],
  } satisfies RouteObject;
}
