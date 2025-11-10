import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.js';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../ui/sidebar.js';
import { AppSidebar } from './app-sidebar.js';

interface AdminLayoutProps {
  children?: React.ReactNode;
  defaultSidebarOpen?: boolean;
  organizationId: string;
}

export function AppLayout({
  children,
  organizationId,
  defaultSidebarOpen = true,
}: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <AppSidebar organizationId={organizationId} />
      <SidebarInset>
        <SidebarTrigger />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

interface AdminHeaderProps {
  title?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
}

export function AdminHeader({
  title,
  breadcrumbs,
  actions,
  user,
}: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex flex-col gap-1">
          {breadcrumbs}
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {actions}
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
