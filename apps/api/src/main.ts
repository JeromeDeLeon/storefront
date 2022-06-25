import Fastify from 'fastify';
import {
  fastifyTRPCPlugin,
  type CreateFastifyContextOptions,
} from '@trpc/server/adapters/fastify';
import type { inferAsyncReturnType } from '@trpc/server';
import { z } from 'zod';
import { router } from '@trpc/server';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? 'anonymous' };

  return { req, res, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;

type User = {
  id: string;
  name: string;
  bio?: string;
};

const users: Record<string, User> = {};

export const appRouter = router()
  .query('getUserById', {
    input: z.string(),
    resolve({ input }) {
      return users[input]; // input type is string
    },
  })
  .mutation('createUser', {
    // validate input with Zod
    input: z.object({
      name: z.string().min(3),
      bio: z.string().max(142).optional(),
    }),
    output: z.object({
      name: z.string().min(3),
      bio: z.string().max(142).optional(),
    }),
    resolve({ input }) {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

const server = Fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/wdw',
  trpcOptions: {
    router: appRouter,
    createContext: (ctx: unknown) => ctx,
  },
});

(async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();
