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
    
    --filter=@repo/be --filter=@repo/cp --filter=@repo/cp
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

## tambah komponen ke apps/fe dan lainnya

```sh
cd packages/ui
pnpm dlx shadcn@latest add button
```

atau untuk kemudahan dapat diinstall --all

```sh
pnpm dlx shadcn@latest add
```

perintah ini akan menginstall semua component yang diperlukan dari radix ui dan bbrp library yg digunanakan shadcn
