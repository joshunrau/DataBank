import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

import { userRouter } from './user';

export const appRouter = router({
  sayHello: publicProcedure.query(() => {
    return 'hello from the server';
  }),
  logToServer: publicProcedure.input(z.string()).mutation((req) => {
    console.log(`Client says: ${req.input}`);
  }),
  user: userRouter
});

export type AppRouter = typeof appRouter;