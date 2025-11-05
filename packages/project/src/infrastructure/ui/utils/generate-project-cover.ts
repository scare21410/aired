import GeoPattern from 'geopattern';

export function generateProjectCoverUrl(seed: string): string {
  const pattern = GeoPattern.generate(seed);
  return pattern.toDataUri();
}

export function getProjectCoverUrl(
  coverImageUrl: string | undefined,
  projectId: string,
): string {
  return coverImageUrl ?? generateProjectCoverUrl(projectId);
}
