import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@aired/ui';
import rpcClientFactory from '../../rpc-client/rpc-client-factory.js';

export default function ProjectList() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { current: client } = useRef(rpcClientFactory().trpc);

  const { data: projects, isLoading } = client.projects.list.useQuery({
    organizationId: organizationId!,
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading projects...</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">
          No projects found for this organization.
        </p>
        <Button>Create Project</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Projects</h2>
        <Button>Create Project</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/organizations/${organizationId!}/projects/${project.id}`}
            className="block"
          >
            <div className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                View project details
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
