import { Outlet, useParams } from 'react-router-dom';
import {
  AdminLayout,
  Sidebar,
  SidebarNavGroup,
  SidebarNavItem,
  Header,
  Logo,
  ThemeToggle,
} from '@aired/ui';
import { IoFolderOpen, IoPeople, IoSettings } from 'react-icons/io5';

export default function ProjectLayout() {
  const { organizationId } = useParams<{ organizationId: string }>();

  const sidebar = (
    <Sidebar
      logo={
        <div className="flex items-center gap-2 text-xl font-bold">
          <Logo className="h-6 w-6" />
          <span>Aired</span>
        </div>
      }
      navigation={
        <div className="space-y-4">
          <SidebarNavGroup>
            <SidebarNavItem
              icon={<IoFolderOpen className="h-5 w-5" />}
              label="Projects"
              active={true}
              href={`/organizations/${organizationId!}/projects`}
            />
            <SidebarNavItem
              icon={<IoPeople className="h-5 w-5" />}
              label="Members"
              href={`/organizations/${organizationId!}/members`}
            />
            <SidebarNavItem
              icon={<IoSettings className="h-5 w-5" />}
              label="Settings"
              href={`/organizations/${organizationId!}/settings`}
            />
          </SidebarNavGroup>
        </div>
      }
      footer={
        <div className="text-xs text-muted-foreground">
          Organization: {organizationId}
        </div>
      }
    />
  );

  const header = (
    <Header
      actions={<ThemeToggle />}
      user={{
        name: 'Demo User',
        email: 'demo@example.com',
      }}
    />
  );

  return (
    <AdminLayout sidebar={sidebar} header={header}>
      <div className="p-6">
        <Outlet />
      </div>
    </AdminLayout>
  );
}
