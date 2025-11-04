import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import rpcClientFactory from '../../rpc-client/rpc-client-factory.js';

export default function ProjectList() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { current: client } = useRef(rpcClientFactory().trpc);

  const { data: projects, isLoading } = client.projects.list.useQuery({
    organizationId: organizationId!,
  });

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No projects found for this organization.</div>;
  }

  return (
    <div>
      <h2>Projects for Organization {organizationId}</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>
              <Link
                to={`/organizations/${organizationId!}/projects/${project.id}`}
              >
                {project.name}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </div>
  );
}
