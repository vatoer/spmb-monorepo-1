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

    ```sh
    pnpm add -D tailwindcss @tailwindcss/postcss postcss --filter=@repo/ui
    ```

2. Add dependency

    ```sh
    pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css --filter=@repo/ui --filter=@repo/be --filter=@repo/cp --filter=@repo/cp
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
    ```

5. Add a cn helper
    (sama)

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

2. add `components.json` untuk semua apps `apps/fe/components.json` `apps/be/components.json` `apps/cp/components.json`

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
