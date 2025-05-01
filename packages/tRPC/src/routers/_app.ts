import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { usersRouter } from '../modules/users/server/procedures';
export const appRouter = createTRPCRouter({
  users: usersRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;