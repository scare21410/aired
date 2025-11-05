import { Outlet, useParams, useNavigate } from 'react-router-dom';
import {
  AdminLayout,
  Sidebar,
  SidebarNavGroup,
  SidebarNavItem,
  Header,
  Logo,
} from '@aired/ui';

export default function ProjectLayout() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();

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
          <SidebarNavGroup title="Menu">
            <SidebarNavItem
              label="Projects"
              active={true}
              onClick={() => {
                navigate(`/organizations/${organizationId!}/projects`);
              }}
            />
            <SidebarNavItem
              label="Members"
              onClick={() => {
                navigate(`/organizations/${organizationId!}/members`);
              }}
            />
            <SidebarNavItem
              label="Settings"
              onClick={() => {
                navigate(`/organizations/${organizationId!}/settings`);
              }}
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
