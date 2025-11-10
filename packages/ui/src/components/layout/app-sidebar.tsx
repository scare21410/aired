import { FolderOpen, Settings, Users } from 'lucide-react';
import { Logo } from '../ui/logo.js';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar.js';

interface Props {
  organizationId: string;
}

export function AppSidebar({ organizationId }: Props) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 text-xl font-bold">
          <Logo className="h-6 w-6" />
          <span>Aired</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem itemID="projects">
                <SidebarMenuButton asChild>
                  <a href={`/organizations/${organizationId}/projects`}>
                    <FolderOpen className="h-5 w-5" />
                    <span>Projects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem itemID="members">
                <SidebarMenuButton asChild>
                  <a href={`/organizations/${organizationId}/members`}>
                    <Users className="h-5 w-5" />
                    <span>Memebers</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem itemID="settings">
                <SidebarMenuButton asChild>
                  <a href={`/organizations/${organizationId}/settings`}>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
