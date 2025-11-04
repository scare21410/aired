import { z } from 'zod';
import { ProjectIdSchema } from '@aired/domain';
import ReadProject from '../../application/use-case/read-project.js';
import ListProjects from '../../application/use-case/list-projects.js';
import type IProjectRepositoryFactory from '../../application/repository/project-repository-factory.js';
import { organizationProcedure, router } from './trpc.js';

export default function rpcFactory(
  projectRepositoryFactory: IProjectRepositoryFactory,
) {
  const readProjectUseCase = new ReadProject(
    projectRepositoryFactory.createReadonlyRepository(),
  );

  const listProjectsUseCase = new ListProjects(
    projectRepositoryFactory.createQuery(),
  );

  return router({
    projects: {
      read: organizationProcedure
        .input(z.object({ id: ProjectIdSchema }))
        .query(async ({ input }) => {
          return readProjectUseCase.execute(input.id, input.organizationId);
        }),

      list: organizationProcedure.query(async ({ ctx }) => {
        return listProjectsUseCase.execute(ctx.organizationId);
      }),
    },
  });
}
