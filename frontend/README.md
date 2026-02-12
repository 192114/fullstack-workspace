# Front Template

pnpm + Turborepo monorepo with Vue, React, Solid, Biome, TypeScript, and Tailwind CSS v4.

API 类型自 `@repo/api-client`（packages/api-client 从 workspace 根 `api-contract/openapi.yaml` 生成）。

## Tech Stack

- **Package Manager**: pnpm 10.x
- **Build System**: Turborepo 2.7
- **Lint/Format**: Biome 2.3
- **TypeScript**: 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Frameworks**: Vue 3, React 19, SolidJS

## Project Structure

```
front-template/
├── apps/
│   ├── web-vue/      # Vue 3 + Vite
│   ├── web-react/    # React 19 + Vite
├── packages/
│   ├── config-typescript/  # Shared TS configs
│   ├── config-tailwind/    # Shared Tailwind 4 CSS
│   ├── design-tokens/      # UI design tokens (colors, spacing, typography)
│   ├── http-client/        # HTTP client with auth & refresh
│   ├── ui-react/           # Shared React UI components
│   └── ui-vue/             # Shared Vue UI components
├── pnpm-workspace.yaml
├── turbo.json
└── biome.json
```

### App src structure (feature-based)

```
src/
├── features/         # 按业务域划分
│   └── {domain}/
├── components/       # 纯 UI 组件
├── layouts/          # 布局
├── routes/           # 路由配置
├── services/         # 业务逻辑
├── api/              # API 请求（唯一 HTTP 入口，类型自 @repo/api-client）
├── store/            # 全局状态
├── hooks/
├── utils/
├── types/
└── constants/
```

## Commands

```bash
# Install dependencies
pnpm install

# Build all apps
pnpm build

# Dev (all apps)
pnpm dev

# Dev (single app)
pnpm --filter web-vue dev

# Type check
pnpm check-types

# Lint
pnpm lint

# Format
pnpm format

# Lint with auto-fix
pnpm lint:fix
```

## Adding a New App

1. Create app in `apps/` (e.g. `pnpm create vite apps/web-svelte --template svelte-ts`)
2. Add `@repo/config-typescript` and `@repo/config-tailwind` as devDependencies
3. Extend the appropriate tsconfig (`@repo/config-typescript/{vue,react,solid}.json`)
4. Add `@tailwindcss/vite` and `tailwindcss` to vite.config.ts
5. Import `@repo/config-tailwind/base.css` in your main CSS
