import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { OrganizationIdSchema } from '@aired/domain';
import { transformerFactory } from '@aired/trpc';

const t = initTRPC.create({
  transformer: transformerFactory(),
});

export const { router } = t;
export const publicProcedure = t.procedure;

export const organizationProcedure = publicProcedure
  .input(z.object({ organizationId: OrganizationIdSchema }))
  .use(function organizationProcedure({ next, input }) {
    return next({
      ctx: {
        organizationId: input.organizationId,
      },
    });
  });
