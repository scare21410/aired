import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    return <div>Loading project...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h2>{project.name}</h2>
      <Link to={`/organizations/${organizationId!}/projects`}>
        Back to Projects
      </Link>
    </div>
  );
}
