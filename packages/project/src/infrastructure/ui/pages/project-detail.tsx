import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Separator } from '@aired/ui';
import rpcClientFactory from '../../rpc-client/rpc-client-factory.js';

export default function ProjectDetail() {
  const { organizationId, id } = useParams<{
    organizationId: string;
    id: string;
  }>();
  const { current: client } = useRef(rpcClientFactory().trpc);

  const { data: project, isLoading } = client.projects.read.useQuery(
    {
      organizationId: organizationId!,
      id: id!,
    },
    {
      enabled: !!id && !!organizationId,
    },
  );

  if (isLoading) {
    return <div className="text-muted-foreground">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Link to={`/organizations/${organizationId!}/projects`}>
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{project.name}</h2>
        <div className="flex gap-2">
          <Link to={`/organizations/${organizationId!}/projects`}>
            <Button variant="outline">Back to Projects</Button>
          </Link>
          <Button>Edit Project</Button>
        </div>
      </div>
      <Separator />
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4">Project Details</h3>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Project Id
            </dt>
            <dd className="text-sm">{project.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Name</dt>
            <dd className="text-sm">{project.name}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
