import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig, type TestProjectConfiguration } from 'vitest/config';

// Read the packages directory and find all subdirectories
const packagesDir = path.resolve(import.meta.dirname, 'packages');
const packageDirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .map((dir) => path.join(dir.name));

const unitTestDefinitions = packageDirs.map((dir) => ({
  // plugins: [swc.vite()],
  test: {
    include: ['**/*.spec.{ts,tsx,js,jsx}'],
    name: path.join('unit', dir),
    root: path.join(packagesDir, dir),
    threads: false,
  },
})) satisfies TestProjectConfiguration[];

const integrationTestDefinitions = packageDirs.map((dir) => ({
  // plugins: [swc.vite()],
  test: {
    include: ['**/*.itest.{ts,tsx,js,jsx}'],
    name: path.join('integration', dir),
    root: path.join(packagesDir, dir),
    environment: 'node',
    hookTimeout: 30000,
    threads: false,
  },
})) satisfies TestProjectConfiguration[];

// Define the workspace configuration

export default defineConfig({
  test: {
    projects: [...unitTestDefinitions, ...integrationTestDefinitions],
  },
});
