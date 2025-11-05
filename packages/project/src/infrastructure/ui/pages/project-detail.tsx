import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoChevronBack, IoPencil } from 'react-icons/io5';
import { Button } from '@aired/ui';
import rpcClientFactory from '../../rpc-client/rpc-client-factory.js';
import { getProjectCoverUrl } from '../utils/generate-project-cover.js';

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
          <Button variant="outline">
            <IoChevronBack className="mr-1 h-5 w-5" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const coverUrl = getProjectCoverUrl(project.coverImageUrl, project.id);

  return (
    <div>
      <div
        className="w-[calc(100%+3rem)] h-64 bg-cover bg-center relative flex items-center justify-center -ml-6 -mr-6 -mt-6"
        style={{ backgroundImage: `url(${coverUrl})` }}
      >
        <div className="absolute top-4 left-6">
          <Link to={`/organizations/${organizationId!}/projects`}>
            <Button variant="outline">
              <IoChevronBack className="mr-1 h-5 w-5" />
              Back
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-6">
          <Button>
            <IoPencil className="mr-1 h-5 w-5" />
            Edit
          </Button>
        </div>
        <h1 className="text-5xl font-bold text-white px-6 text-center text-shadow-lg/30">
          {project.name}
        </h1>
      </div>
    </div>
  );
}
