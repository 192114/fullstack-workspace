# @repo/api-client

从 workspace 根目录 `api-contract/openapi.yaml` 生成的 TypeScript 类型与路径常量，供 frontend 使用。

## 生成

```bash
pnpm run generate
```

或从 frontend 根目录：

```bash
pnpm --filter @repo/api-client run generate
```

## 使用

```typescript
import { UserContract } from "@repo/api-client";
import { httpClient } from "../http-client";

export const userApi = {
  list: (params: UserContract.ListRequest) =>
    httpClient.get<UserContract.ListResponse>(UserContract.list.path, params),
};
```
