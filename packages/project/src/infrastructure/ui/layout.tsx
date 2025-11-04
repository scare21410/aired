import { useParams } from 'react-router-dom';

export default function ProjectLayout() {
  const { organizationId } = useParams<{ organizationId: string }>();

  return (
    <div>
      <h1>Projects - Organization {organizationId}</h1>
    </div>
  );
}
