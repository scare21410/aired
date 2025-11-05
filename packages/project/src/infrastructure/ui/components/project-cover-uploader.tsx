import { useState } from 'react';
import { generateProjectCoverUrl } from '../utils/generate-project-cover.js';

interface ProjectCoverUploaderProps {
  projectId: string;
  projectName: string;
  currentCoverUrl?: string;
  onCoverChange: (coverUrl: string) => void;
}

export function ProjectCoverUploader({
  projectId,
  projectName,
  currentCoverUrl,
  onCoverChange,
}: ProjectCoverUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(currentCoverUrl);

  function handleGenerateRandom() {
    const randomSeed = `${projectId}-${Date.now().toString()}`;
    const generatedUrl = generateProjectCoverUrl(randomSeed);
    setPreview(generatedUrl);
    onCoverChange(generatedUrl);
  }

  function handleGenerateFromName() {
    const generatedUrl = generateProjectCoverUrl(projectName);
    setPreview(generatedUrl);
    onCoverChange(generatedUrl);
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 512 * 1024) {
      alert('File size must be less than 512KB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('File must be an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onCoverChange(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square max-w-md mx-auto overflow-hidden rounded-lg border">
        {preview ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No cover image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGenerateFromName}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate from Name
          </button>
          <button
            type="button"
            onClick={handleGenerateRandom}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Generate Random
          </button>
        </div>

        <label className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center cursor-pointer">
          Upload Image (512x512)
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
