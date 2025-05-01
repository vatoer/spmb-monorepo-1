# tRPC integration

referensi: <https://trpc.io/docs/client/tanstack-react-query/server-components>

## installation

```sh
mkdir packages/tRPC
cd packages/tRPC
touch packages/tRPC/package.json
touch packages/tRPC/tsconfig.json
```

`package.json`

```json
{
	"name": "@repo/trpc",
	"version": "0.1.0",
	"dependencies": {
		"@repo/db": "workspace:*",
		"node": "^22",
		"react": "^19",
		"react-dom":"^19"
	},
	"devDependencies": {
		"@repo/eslint-config": "workspace:*",
		"@repo/typescript-config": "workspace:*",
		"types/node": "^22",
		"@types/react": "^19",
		"@types/react-dom": "^19"        
	}
```

`tsconfig.json`

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@repo/trpc/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

1. install deps

```sh
cd packages/tRPC
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query@latest zod client-only server-only
```

2. create a tRPC router

initialize tRPC in `src/init.ts` using `iniTRPC` function

```sh
touch packages/tRPC/src/init.ts
```

```ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

```sh
touch packages/tRPC/src/router/_app.ts
```

```ts
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
```

3. Create a Query Client Factory

```sh
touch packages/tRPC/src/query-client.ts
```

`query-client.ts`

```ts
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
```

install `superjson`

```sh
pnpm add superjson --filter=@repo/trpc
```

4. Create a tRPC client for Client Components

```sh
touch packages/tRPC/src/client.tsx
```

`client.tsx`

```tsx
'use client';
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

```sh
touch packages/tRPC/.env.dist
```

```.env
NEXT_PUBLIC_APP_URL="http://localhost:xxxx"
```

```sh
vi apps/fe/.env
```

```diff
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

update `client.tsx`

```diff
-    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
-    return 'http://localhost:3000';
+    return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'; // fallback for server-side

```

Mount the provider in the root of your application (e.g. app/layout.tsx when using Next.js).

update `apps/fe/package.json`

```diff
  "dependencies": {
    "@repo/db": "workspace:*",
+    "@repo/trpc": "workspace:*",
    "@repo/ui": "workspace:*",
```

update `apps/fe/tsconfig.json`

```diff
"paths": {
      "@/*": ["./src/*"],
+			"@repo/trpc/*": ["../../packages/tRPC/src/*"],
      "@repo/ui/*": ["../../packages/ui/src/*"]
    }
```

install perubahan

```sh
pnpm install --filter=fe
```

`apps/fe/layout.tsx`

```diff
+ import { TRPCReactProvider } from "@repo/trpc/client";
// ...
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
+       <TRPCReactProvider>        
          {children}
+       </TRPCReactProvider>
      </body>
// ...
```

5. Create a tRPC caller for Server Components

```sh
touch packages/tRPC/src/server.tsx
```

`server.tsx`

```tsx
import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: '...' })],
  }),
  queryClient: getQueryClient,
});
```

## Using yout API

### using in fe 

```sh
touch packages/tRPC/src/modules/users/server/procedures.ts
```

`procedures.ts`

```ts
import { baseProcedure, createTRPCRouter } from "@repo/trpc/init";

export const usersRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ()=>{
        return [{"hello": "world"}]
    }),
})
```

update _app.ts

```diff
- import { z } from 'zod';
- import { baseProcedure, createTRPCRouter } from '../init';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
-  hello: baseProcedure
-    .input(
-      z.object({
-        text: z.string(),
-      }),
-    )
-    .query((opts) => {
-      return {
-        greeting: `hello ${opts.input.text}`,
-      };
-    }),
  users: usersRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
```

#### Getting data in server components

`apps\fe\src\app\page.tsx`

```diff
+ import { getQueryClient, trpc } from "@repo/trpc/server";

export default async function Home() {
  const usersFromPrisma = await prismaDbAuth.user.findMany();
  console.log(usersFromPrisma);

  // try from trpc
+  const queryClient = getQueryClient();
+  const usersFromTRPC = await queryClient.fetchQuery(trpc.users.getMany.queryOptions())
+  console.log(usersFromTRPC);

  return (
    <div className="bg-blue-500 h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg text-white">
        Turborepo Shadcn Integration
      </p>
      <div className="mt-8">
        <Button variant="destructive" size="lg">
          Click Me
        </Button>
      </div>
+      <div>
+        {JSON.stringify(usersFromTRPC)}
+      </div>
      
    </div>
  );
}

```

#### Getting data in client component components

```
pnpm add @tanstack/react-query --filter=fe
```

```sh
touch apps/fe/src/modules/users/components/client-greeting.tsx
```

`client-greeting.tsx`

```tsx
'use client';
import { useTRPC } from '@repo/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
export function ClientGreeting() {
  const trpc = useTRPC();
  const data = useSuspenseQuery(trpc.users.getMany.queryOptions());
  return <div>{JSON.stringify(data)}</div>;
}
```

`apps\fe\src\app\page.tsx`

```diff
+ import { ClientGreeting } from "@/modules/users/components/client-greeting";
...
      <div className="mt-8">
        <Button variant="destructive" size="lg">
          Click Me
        </Button>
      </div>      
...
+      <ClientGreeting />
```

```sh
touch /packages/trpc/src/api/trpc/[trpc]/route.ts
touch /app/fe/src/app/api/trpc/[trpc]/route.ts
```

```ps
New-Item -ItemType File -Path .\packages\tRPC\src\api\trpc\[trpc]\route.ts -Force
New-Item -ItemType File -Path .\apps\fe\src\app\api\trpc\[trpc]\route.ts -Force
```

`/packages/trpc/src/api/trpc/[trpc]/route.ts`

```ts
import { createTRPCContext } from '@repo/trpc/init';
import { appRouter } from '@repo/trpc/routers/_app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
```

`apps\fe\src\app\api\trpc\[trpc]\route.ts`

```ts
export { handler as GET, handler as POST } from '@repo/trpc/api/trpc/[trpc]/route';
```

perhatikan disini bahwa api di paket trpc berada langsung dibawah `src\api` sedangankan di apps fe dibawah `src\app\api`