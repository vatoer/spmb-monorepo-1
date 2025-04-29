# development

## turborepo installation

referensi: <https://turborepo.com/docs/getting-started/installation>

```ssh
pnpm dlx create-turbo@latest
```

### remove default apps

```sh
rm -rf apps/web apps/docs
```

```powershell
Remove-Item -Recurse -Force .\apps\web 
Remove-Item -Recurse -Force .\apps\docs
```

## add nextjs app to turborepo

```sh
pnpm create next-app@latest apps/fe
pnpm create next-app@latest apps/be
pnpm create next-app@latest apps/cp
```

```plaintext 
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like your code inside a `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to use Turbopack for `next dev`? ... No / Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes
```

tambahkan packages/ui ke `package.json` masing-masing apps

```json
  "dependencies": {
    ...
    "@repo/ui": "workspace:*",
    ...
  }
  "devDependencies": {
    ....
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "^9"
    ...
  }
```

update `tsconfig.json`

```json
  "extends": "@repo/typescript-config/nextjs.json",
```

update `eslint.config.mjs` dari defaultnya installnya menggunakan sharing eslint config 

dari 

```mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

menjadi 

```mjs
import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default nextJsConfig;
```

run `pnpm install` setelah update package.json

```sh
pnpm install
```

test run dev

```sh
pnpm dev
```

commit change

```sh
git add .
git commit -am"add new apps"
```


## manual install shadcn

reference: <https://ui.shadcn.com/docs/installation/manual>

1. Add tailwind CSS

    [manual install CSS using postcss](https://tailwindcss.com/docs/installation/using-postcss)

    - install tailwind
  
      ```sh
      pnpm add -D tailwindcss @tailwindcss/postcss postcss --filter=@repo/ui
      ```
    - Add Tailwind to your PostCSS configuration `postcss.config.mjs`

      ```mjs
      export default {
        plugins: {
          "@tailwindcss/postcss": {},
        }
      }
      ```

    - import Tailwind CSS in `globals.css` di `packages/ui/src/styles/globals.css`

      ```css
      @import "tailwindcss";
      ```


2. Add dependency

    ```sh
    pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css --filter=@repo/ui    
    ```

3. configure path aliases

    configure `packages/ui/tsconfig.json`

    ```json
    "compilerOptions": {
      "outDir": "dist",
      "baseUrl": ".",
      "paths": {
        "@repo/ui/*": ["./src/*"],
      }
    },
      ```

4. Configure styles

    tambahkan style ke `packages/ui/src/styles/globals.css` seperti di manual

    kemudian tambahkan juga

    ```css
    @import "tailwindcss";
    @import "tw-animate-css";
    @source "../../../apps/**/*.{ts,tsx}";
    @source "../../../components/**/*.{ts,tsx}";
    @source "../**/*.{ts,tsx}";

    @custom-variant dark (&:is(.dark *));

    :root {
      --background: oklch(1 0 0);
      --foreground: oklch(0.145 0 0);
      --card: oklch(1 0 0);
      --card-foreground: oklch(0.145 0 0);
      --popover: oklch(1 0 0);
      --popover-foreground: oklch(0.145 0 0);
      --primary: oklch(0.205 0 0);
      --primary-foreground: oklch(0.985 0 0);
      --secondary: oklch(0.97 0 0);
      --secondary-foreground: oklch(0.205 0 0);
      --muted: oklch(0.97 0 0);
      --muted-foreground: oklch(0.556 0 0);
      --accent: oklch(0.97 0 0);
      --accent-foreground: oklch(0.205 0 0);
      --destructive: oklch(0.577 0.245 27.325);
      --destructive-foreground: oklch(0.577 0.245 27.325);
      --border: oklch(0.922 0 0);
      --input: oklch(0.922 0 0);
      --ring: oklch(0.708 0 0);
      --chart-1: oklch(0.646 0.222 41.116);
      --chart-2: oklch(0.6 0.118 184.704);
      --chart-3: oklch(0.398 0.07 227.392);
      --chart-4: oklch(0.828 0.189 84.429);
      --chart-5: oklch(0.769 0.188 70.08);
      --radius: 0.625rem;
      --sidebar: oklch(0.985 0 0);
      --sidebar-foreground: oklch(0.145 0 0);
      --sidebar-primary: oklch(0.205 0 0);
      --sidebar-primary-foreground: oklch(0.985 0 0);
      --sidebar-accent: oklch(0.97 0 0);
      --sidebar-accent-foreground: oklch(0.205 0 0);
      --sidebar-border: oklch(0.922 0 0);
      --sidebar-ring: oklch(0.708 0 0);
    }

    .dark {
      --background: oklch(0.145 0 0);
      --foreground: oklch(0.985 0 0);
      --card: oklch(0.145 0 0);
      --card-foreground: oklch(0.985 0 0);
      --popover: oklch(0.145 0 0);
      --popover-foreground: oklch(0.985 0 0);
      --primary: oklch(0.985 0 0);
      --primary-foreground: oklch(0.205 0 0);
      --secondary: oklch(0.269 0 0);
      --secondary-foreground: oklch(0.985 0 0);
      --muted: oklch(0.269 0 0);
      --muted-foreground: oklch(0.708 0 0);
      --accent: oklch(0.269 0 0);
      --accent-foreground: oklch(0.985 0 0);
      --destructive: oklch(0.396 0.141 25.723);
      --destructive-foreground: oklch(0.637 0.237 25.331);
      --border: oklch(0.269 0 0);
      --input: oklch(0.269 0 0);
      --ring: oklch(0.439 0 0);
      --chart-1: oklch(0.488 0.243 264.376);
      --chart-2: oklch(0.696 0.17 162.48);
      --chart-3: oklch(0.769 0.188 70.08);
      --chart-4: oklch(0.627 0.265 303.9);
      --chart-5: oklch(0.645 0.246 16.439);
      --sidebar: oklch(0.205 0 0);
      --sidebar-foreground: oklch(0.985 0 0);
      --sidebar-primary: oklch(0.488 0.243 264.376);
      --sidebar-primary-foreground: oklch(0.985 0 0);
      --sidebar-accent: oklch(0.269 0 0);
      --sidebar-accent-foreground: oklch(0.985 0 0);
      --sidebar-border: oklch(0.269 0 0);
      --sidebar-ring: oklch(0.439 0 0);
    }

    @theme inline {
      --color-background: var(--background);
      --color-foreground: var(--foreground);
      --color-card: var(--card);
      --color-card-foreground: var(--card-foreground);
      --color-popover: var(--popover);
      --color-popover-foreground: var(--popover-foreground);
      --color-primary: var(--primary);
      --color-primary-foreground: var(--primary-foreground);
      --color-secondary: var(--secondary);
      --color-secondary-foreground: var(--secondary-foreground);
      --color-muted: var(--muted);
      --color-muted-foreground: var(--muted-foreground);
      --color-accent: var(--accent);
      --color-accent-foreground: var(--accent-foreground);
      --color-destructive: var(--destructive);
      --color-destructive-foreground: var(--destructive-foreground);
      --color-border: var(--border);
      --color-input: var(--input);
      --color-ring: var(--ring);
      --color-chart-1: var(--chart-1);
      --color-chart-2: var(--chart-2);
      --color-chart-3: var(--chart-3);
      --color-chart-4: var(--chart-4);
      --color-chart-5: var(--chart-5);
      --radius-sm: calc(var(--radius) - 4px);
      --radius-md: calc(var(--radius) - 2px);
      --radius-lg: var(--radius);
      --radius-xl: calc(var(--radius) + 4px);
      --color-sidebar: var(--sidebar);
      --color-sidebar-foreground: var(--sidebar-foreground);
      --color-sidebar-primary: var(--sidebar-primary);
      --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
      --color-sidebar-accent: var(--sidebar-accent);
      --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
      --color-sidebar-border: var(--sidebar-border);
      --color-sidebar-ring: var(--sidebar-ring);
    }

    @layer base {
      * {
        @apply border-border outline-ring/50;
      }
      body {
        @apply bg-background text-foreground;
      }
    }
    ```

5. Add a cn helper `packages/ui/src/lib/utils.ts`

    ```ts
    import { clsx, type ClassValue } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    ```

6. Create a components.json file `packages/ui/components.json`

    ```json
    {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": "new-york",
      "rsc": false,
      "tsx": true,
      "tailwind": {
        "config": "",
        "css": "src/styles/globals.css",
        "baseColor": "neutral",
        "cssVariables": true,
        "prefix": ""
      },
      "aliases": {
        "components": "@repo/ui/components",
        "utils": "@repo/ui/lib/utils",
        "hooks": "@repo/ui/hooks",
        "lib": "@repo/ui/lib",
        "ui": "@repo/ui/components/ui"
      },
      "iconLibrary": "lucide"
    }
    ```

7. update `packages/ui/package.json`

    ```json
      "exports": {
        "./globals.css": "./src/styles/globals.css",
        "./postcss.config": "./postcss.config.mjs",
        "./lib/*": "./src/lib/*.ts",
        "./components/*": "./src/components/*.tsx",
        "./hooks/*": "./src/hooks/*.ts"
      },
    ```

### update nextjs apps

1. configure path aliases

    perbarui `tsconfig.json` untuk semua apps `apps/fe/tsconfig.json` `apps/be/tsconfig.json` `apps/cp/tsconfig.json`

    ```json
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["./src/*"],
          "@repo/ui/*": ["../../packages/ui/src/*"],
        }
      }
    ```

    | Part                     | Purpose                                                                 | Example                                |
    |--------------------------|-------------------------------------------------------------------------|----------------------------------------|
    | tsconfig.json > paths    | Tells TypeScript where to find modules at build time (for type checking, intellisense, etc). | `@repo/ui/* → ../../packages/ui/src/*` |
    | package.json > dependencies | Tells your bundler / runtime (like Next.js, Vite, etc.) how to install and resolve the real code at runtime. | `@repo/ui → workspace package`         |

2. create `components.json` untuk semua apps `apps/fe/components.json` `apps/be/components.json` `apps/cp/components.json`

    ```json
    {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": "new-york",
      "rsc": false,
      "tsx": true,
      "tailwind": {
        "config": "",
        "css": "../../packages/ui/src/styles/globals.css",
        "baseColor": "neutral",
        "cssVariables": true,
        "prefix": ""
      },
      "aliases": {
        "components": "@/components",
        "utils": "@repo/ui/lib/utils",
        "ui": "@repo/ui/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks"
      },
      "iconLibrary": "lucide"
    }
    ```

3. update import css in `layout.tsx`

```diff
- import "./globals.css";
+ import "@repo/ui/globals.css";
```

### tambah komponen ke apps/fe dan lainnya

```sh
cd packages/ui
pnpm dlx shadcn@latest add button
```

atau untuk kemudahan dapat diinstall --all

```sh
pnpm dlx shadcn@latest add
```

perintah ini akan menginstall semua component yang diperlukan dari radix ui dan bbrp library yg digunanakan shadcn

copy untuk template

```
Copy-Item -Recurse -Path .\apps\be -Destination .\apps\tpl

Remove-Item -Recurse -Force .\apps\tpl\node_modules
Remove-Item -Recurse -Force .\apps\tpl\.next
Remove-Item -Recurse -Force .\apps\tpl\.turbo
```

## Install Prisma

referensi <https://www.prisma.io/docs/guides/turborepo#2-add-a-new-database-package-to-the-turborepo-prisma-monorepo>


### Add a new database package to the monorepo

```sh
mkdir packages/database
cd packages/database
touch packages/database/package.json
```

Define the package.json file as follows:

`packages/database/package.json`

```diff
+ {
+  "name": "@repo/db",
+  "version": "0.0.0"
+    "devDependencies": {
+      "@repo/eslint-config": "workspace:*",
+      "@repo/typescript-config": "workspace:*",
+    }
+ }
```


```sh
cd packages/database
pnpm add -D prisma @types/node --filter=@repo/db
pnpm add @prisma/client --filter=@repo/db
```

### setup tsconfig

```sh
touch packages/database/tsconfig.json
```

```json
{
  "extends": "@repo/typescript-config/base.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "tsup.config.ts"],
  "exclude": ["node_modules"]
}
```

### Initialize prisma 

```sh
cd packages/database
touch prisma/db-auth/schema.prisma
```

update content `prisma/db-auth/schema.prisma`

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
  output        = "../../node_modules/@prisma-db-auth/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_AUTH")
}

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  name          String?
  password      String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now())
}

```

```sh
cd packages/database
touch .gitignore
touch .env
```

update content `.gitignore` add `.env` file to ignore

```.gitignore
.env
```

update content `.env`

```.env
DATABASE_URL_AUTH="postgresql://postgres:postgres@localhost:5454/monorepoauth?schema=public"
```

### Create scripts to execute Prisma CLI commands

Let's add some scripts to the package.json inside packages/database:

```diff
{
  "name": "@repo/db",
  "version": "0.1.0",
+   "scripts": {
+     "db:generate:auth": "prisma generate --schema=./prisma/db-auth/schema.prisma",
+     "db:migrate:auth": "prisma migrate dev --skip-generate --schema=./prisma/db-auth/schema.prisma",
+     "db:deploy:auth": "prisma migrate deploy --schema=./prisma/db-auth/schema.prisma"
+   },
  "devDependencies": {
    "prisma": "^6.7.0"
  },
  "dependencies": {
    "@prisma/client": "^6.7.0"
  }
}
```

Let's also add these scripts to turbo.json in the root:

```diff
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
+    "db:generate:auth": {
+      "cache": false
+    },
+    "db:migrate:auth": {
+      "cache": false,
+      "persistent": true // This is necessary to interact with the CLI and assign names to your database migrations.
+    },
+    "db:deploy:auth": {
+      "cache": false
+    }
+  }
}
```

1. migrate prisma schema to database
   
   go to root project

    ```sh
    pnpm turbo db:migrate:auth
    ```

2. generate types from schema

    ```sh
    pnpm turbo db:generate:auth
    ```

### Export prisma types and an instance of PrismaClient to be used across the monorepo

Next, export the generated types and an instance of `PrismaClient` so it can used in your applications.

In the `packages/database` directory, create a `src` folder and add a `client-auth.ts` file. This file will define an instance of `PrismaClient`:

```sh
touch packages/database/src/client-auth.ts
```

```ts
import { PrismaClient } from "@prisma-db-auth/client";

const globalForPrisma = global as unknown as { prismaDbAuth: PrismaClient };

export const prismaDbAuth =
  globalForPrisma.prismaDbAuth || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaDbAuth = prismaDbAuth;
```

Then create an `index.ts` file in the `src` folder to re-export the generated prisma types and the `PrismaClient` instance:


```sh
touch packages/database/src/index.ts
```

```ts
export { prismaDbAuth } from './client-auth' // exports instance of prisma 
export * from "@prisma-db-auth/client" // exports generated types from prisma
```

Follow the [Just-in-Time packaging pattern](https://turbo.build/repo/docs/core-concepts/internal-packages#just-in-time-packages) and create an entrypoint to the package inside packages/database/package.json:

```diff
{
  "name": "@repo/db",
  "version": "0.1.0",
  "scripts": {
    "db:generate:auth": "prisma generate --schema=./prisma/db-auth/schema.prisma",
    "db:migrate:auth": "prisma migrate dev --skip-generate --schema=./prisma/db-auth/schema.prisma",
    "db:deploy:auth": "prisma migrate deploy --schema=./prisma/db-auth/schema.prisma"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/node": "^22.15.3",
    "prisma": "^6.7.0"
  },
  "dependencies": {
    "@prisma/client": "^6.7.0"
  },
+  "exports": {
+    ".": "./src/index.ts"
+  }
}
```

### Importing the database package into the fe app in the monorepo

```diff
{
  "dependencies": {
+   "@repo/db": "workspace:*"
  }
} 
```
setiap kali merubah package.json jangan lupa untuk install

```sh
cd apps/fe
pnpm install
```

pastikan setiaps app mempunyai `.env` masing-masing

```.env
DATABASE_URL_AUTH="postgresql://postgres:postgres@localhost:5454/monorepoauth?schema=public"
```

kemudian jalankan pnpm dev

```sh
cd apps/fe
pnpm dev
```

pastikan tidak ada yang error