import * as React from 'react';
import { IoMenu, IoClose } from 'react-icons/io5';
import { cn } from '../../lib/utils.js';
import { ScrollArea } from '../ui/scroll-area.js';
import { Separator } from '../ui/separator.js';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.js';
import { Button } from '../ui/button.js';

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const AdminLayoutContext = React.createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
} | null>(null);

export function useAdminLayout() {
  const context = React.useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayout');
  }
  return context;
}

export function AdminLayout({ children, sidebar, header }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <AdminLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-screen overflow-hidden">
        {sidebar && (
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => {
                  setSidebarOpen(false);
                }}
              />
            )}
            {/* Sidebar */}
            <aside
              className={cn(
                'border-r bg-card transition-all duration-300',
                sidebarOpen ? 'w-64' : 'w-20',
              )}
            >
              <ScrollArea className="h-full">{sidebar}</ScrollArea>
            </aside>
          </>
        )}
        <div className="flex flex-1 flex-col overflow-hidden">
          {header && <header className="border-b">{header}</header>}
          <main className="flex-1 overflow-auto">
            <ScrollArea className="h-full">{children}</ScrollArea>
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}

interface SidebarProps {
  logo?: React.ReactNode;
  navigation: React.ReactNode;
  footer?: React.ReactNode;
}

export function Sidebar({ logo, navigation, footer }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen } = useAdminLayout();

  return (
    <div className="flex h-full flex-col">
      {logo && (
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <div>{logo}</div>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
            className={cn(!sidebarOpen && 'mx-auto')}
          >
            {sidebarOpen ? (
              <IoClose className="h-5 w-5" />
            ) : (
              <IoMenu className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
      <nav className="flex-1 p-4">{navigation}</nav>
      {sidebarOpen && footer && (
        <>
          <Separator />
          <div className="p-4">{footer}</div>
        </>
      )}
    </div>
  );
}

interface SidebarNavItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export function SidebarNavItem({
  icon,
  label,
  active,
  href,
  onClick,
}: SidebarNavItemProps) {
  const { sidebarOpen } = useAdminLayout();

  const className = cn(
    'flex w-full items-center gap-3 rounded-md py-2 text-sm transition-colors',
    active
      ? 'bg-primary text-primary-foreground'
      : 'hover:bg-accent hover:text-accent-foreground',
    sidebarOpen ? 'px-3' : 'justify-center px-2',
  );

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {sidebarOpen && <span>{label}</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        title={!sidebarOpen ? label : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={className}
      title={!sidebarOpen ? label : undefined}
    >
      {content}
    </button>
  );
}

interface SidebarNavGroupProps {
  title?: string;
  children: React.ReactNode;
}

export function SidebarNavGroup({ title, children }: SidebarNavGroupProps) {
  const { sidebarOpen } = useAdminLayout();

  return (
    <div className="space-y-1">
      {title && sidebarOpen && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface HeaderProps {
  title?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
}

export function Header({ title, breadcrumbs, actions, user }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col gap-1">
        {breadcrumbs}
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
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

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {item.onClick || item.href ? (
            <button
              onClick={item.onClick}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span
              className={
                index === items.length - 1 ? 'text-foreground font-medium' : ''
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
