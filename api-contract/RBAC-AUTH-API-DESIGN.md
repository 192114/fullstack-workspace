# RBAC + 登录模块 API 设计文档

## 1. 通用约定

| 约定项 | 说明 |
|--------|------|
| Base Path | `/api` |
| 统一响应 | `{ code: number, message: string, data: T \| null }`，code 0 为成功 |
| 认证方式 | Bearer Token（`Authorization: Bearer <access_token>`）或 Cookie（Web 端可选） |
| RefreshToken 传递 | Web 端 Cookie `refreshToken`；Native 端 Body 或 Header |
| 分页 Query | `page`（从 1 开始）、`pageSize`（默认 10，最大 100） |
| 分页响应 | `{ list: T[], total: number }` |

---

## 2. 认证模块 API（Auth）

### 2.1 概览

| 方法 | 路径 | 用途 | 需登录 | 需 RefreshToken | 需 RBAC |
|------|------|------|--------|-----------------|---------|
| POST | /auth/email | 发送邮件验证码 | 否 | 否 | 否 |
| POST | /auth/register | 用户注册 | 否 | 否 | 否 |
| POST | /auth/login | 用户登录（密码/验证码） | 否 | 否 | 否 |
| POST | /auth/refresh | 刷新 Token | 否 | **是** | 否 |
| POST | /auth/logout | 用户登出 | 是 | **是** | 否 |
| POST | /auth/change-password | 修改密码 | 是 | 否 | 否 |
| POST | /auth/forgot-password | 忘记密码-发送验证码 | 否 | 否 | 否 |
| POST | /auth/reset-password | 忘记密码-重置 | 否 | 否 | 否 |
| GET | /auth/me | 当前用户信息 | 是 | 否 | 否 |

### 2.2 接口详细设计

#### POST /auth/email

发送邮件验证码。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| usage | number | 是 | 1=注册 2=登录 3=重置密码 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### POST /auth/register

用户注册。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| password | string | 是 | 密码 |
| emailCode | string | 是 | 邮箱验证码 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### POST /auth/login

用户登录，支持密码登录或验证码登录。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| loginType | number | 是 | 1=密码登录 2=验证码登录 |
| password | string | 条件 | loginType=1 时必填 |
| emailCode | string | 条件 | loginType=2 时必填 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

说明：Web 端可将 refreshToken 回写 Cookie；Native 端从 data 返回后写入安全存储。

---

#### POST /auth/refresh

刷新 Token。**必须**能取到 refreshToken（Cookie 或 Body）。

**请求体（Native 端）**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| refreshToken | string | 条件 | Cookie 无时必填 |
| deviceId | string | 否 | 设备标识 |

**请求体（Web 端）**：通过 Cookie 携带 `refreshToken`，Body 可为空。

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

---

#### POST /auth/logout

用户登出。

**请求头**：`Authorization: Bearer <accessToken>`

**请求体 / Cookie**：refreshToken（Cookie 或 Body）

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### POST /auth/change-password

修改密码（需登录）。支持旧密码验证或验证码验证二选一。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| oldPassword | string | 条件 | 旧密码（方式一） |
| emailCode | string | 条件 | 邮箱验证码（方式二） |
| newPassword | string | 是 | 新密码 |

二选一：`oldPassword` 或 `emailCode`。

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### POST /auth/forgot-password

忘记密码：发送验证码到邮箱。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### POST /auth/reset-password

忘记密码：使用验证码重置密码。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| emailCode | string | 是 | 邮箱验证码 |
| newPassword | string | 是 | 新密码 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### GET /auth/me

获取当前登录用户信息。

**请求头**：`Authorization: Bearer <accessToken>`

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": "number",
    "email": "string",
    "nickname": "string",
    "avatarUrl": "string",
    "gender": "number",
    "birthday": "string",
    "bio": "string"
  }
}
```

---

## 3. Admin RBAC 模块 API

### 3.1 概览

| 方法 | 路径 | 用途 | 需登录 | 需 RefreshToken | 需 RBAC |
|------|------|------|--------|-----------------|---------|
| GET | /admin/me | 当前用户 + 菜单 + 权限 | 是 | 否 | 否（登录即可） |
| GET | /admin/roles | 角色列表 | 是 | 否 | role:list |
| POST | /admin/roles | 创建角色 | 是 | 否 | role:create |
| GET | /admin/roles/:id | 角色详情 | 是 | 否 | role:detail |
| PUT | /admin/roles/:id | 更新角色 | 是 | 否 | role:update |
| DELETE | /admin/roles/:id | 删除角色 | 是 | 否 | role:delete |
| GET | /admin/roles/:id/permissions | 角色权限列表 | 是 | 否 | role:detail |
| PUT | /admin/roles/:id/permissions | 分配角色权限 | 是 | 否 | role:update |
| GET | /admin/permissions | 权限树 | 是 | 否 | permission:list |
| GET | /admin/menus | 菜单树（管理用） | 是 | 否 | menu:list |
| POST | /admin/menus | 创建菜单 | 是 | 否 | menu:create |
| PUT | /admin/menus/:id | 更新菜单 | 是 | 否 | menu:update |
| DELETE | /admin/menus/:id | 删除菜单 | 是 | 否 | menu:delete |
| GET | /admin/users | 用户列表 | 是 | 否 | user:list |
| POST | /admin/users | 创建用户 | 是 | 否 | user:create |
| GET | /admin/users/:id | 用户详情 | 是 | 否 | user:detail |
| PUT | /admin/users/:id | 更新用户 | 是 | 否 | user:update |
| DELETE | /admin/users/:id | 删除用户 | 是 | 否 | user:delete |
| GET | /admin/users/:id/roles | 用户角色列表 | 是 | 否 | user:detail |
| PUT | /admin/users/:id/roles | 分配用户角色 | 是 | 否 | user:update |

### 3.2 接口详细设计

#### GET /admin/me

获取当前 Admin 用户信息、菜单树、权限列表。用于登录后初始化布局与权限。

**请求头**：`Authorization: Bearer <accessToken>`

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "user": {
      "id": "number",
      "email": "string",
      "nickname": "string",
      "avatarUrl": "string"
    },
    "menus": [
      {
        "id": "number",
        "name": "string",
        "path": "string",
        "component": "string",
        "icon": "string",
        "children": []
      }
    ],
    "permissions": ["role:list", "user:create"]
  }
}
```

---

#### GET /admin/roles

角色列表（分页）。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码，从 1 开始 |
| pageSize | number | 是 | 每页条数，最大 100 |
| keyword | string | 否 | 搜索关键词（code/name） |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "number",
        "code": "string",
        "name": "string",
        "description": "string",
        "type": "number",
        "status": "number",
        "createTime": "string"
      }
    ],
    "total": "number"
  }
}
```

---

#### POST /admin/roles

创建角色。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 角色编码 |
| name | string | 是 | 角色名称 |
| description | string | 否 | 描述 |
| type | number | 是 | 1=Admin 2=普通用户 |
| status | number | 否 | 0=禁用 1=启用，默认 1 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": "number"
  }
}
```

---

#### GET /admin/roles/:id

角色详情。

**路径参数**：`id` - 角色 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": "number",
    "code": "string",
    "name": "string",
    "description": "string",
    "type": "number",
    "status": "number",
    "createTime": "string",
    "updateTime": "string"
  }
}
```

---

#### PUT /admin/roles/:id

更新角色。

**路径参数**：`id` - 角色 ID

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 角色名称 |
| description | string | 否 | 描述 |
| status | number | 否 | 0=禁用 1=启用 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### DELETE /admin/roles/:id

删除角色。

**路径参数**：`id` - 角色 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### GET /admin/roles/:id/permissions

获取角色权限 ID 列表。

**路径参数**：`id` - 角色 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": [1, 2, 3]
}
```

---

#### PUT /admin/roles/:id/permissions

分配角色权限。

**路径参数**：`id` - 角色 ID

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| permissionIds | number[] | 是 | 权限 ID 列表 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### GET /admin/permissions

获取权限树（树形结构）。

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": [
    {
      "id": "number",
      "code": "string",
      "name": "string",
      "type": "number",
      "parentId": "number",
      "sortOrder": "number",
      "children": []
    }
  ]
}
```

---

#### GET /admin/menus

菜单树（管理用，树形）。

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": [
    {
      "id": "number",
      "permissionId": "number",
      "parentId": "number",
      "name": "string",
      "path": "string",
      "component": "string",
      "icon": "string",
      "sortOrder": "number",
      "visible": "number",
      "children": []
    }
  ]
}
```

---

#### POST /admin/menus

创建菜单。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| permissionId | number | 是 | 关联权限 ID |
| parentId | number | 是 | 父菜单 ID，0 为根 |
| name | string | 是 | 菜单名称 |
| path | string | 否 | 前端路由 path |
| component | string | 否 | 前端组件路径 |
| icon | string | 否 | 图标 |
| sortOrder | number | 否 | 排序，默认 0 |
| visible | number | 否 | 0=隐藏 1=可见，默认 1 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": "number"
  }
}
```

---

#### PUT /admin/menus/:id

更新菜单。

**路径参数**：`id` - 菜单 ID

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| permissionId | number | 否 | 关联权限 ID |
| parentId | number | 否 | 父菜单 ID |
| name | string | 否 | 菜单名称 |
| path | string | 否 | 前端路由 path |
| component | string | 否 | 前端组件路径 |
| icon | string | 否 | 图标 |
| sortOrder | number | 否 | 排序 |
| visible | number | 否 | 0=隐藏 1=可见 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### DELETE /admin/menus/:id

删除菜单。

**路径参数**：`id` - 菜单 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### GET /admin/users

用户列表（分页）。Admin 用户管理。

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数 |
| keyword | string | 否 | 搜索关键词（email/nickname） |
| status | number | 否 | 0=禁用 1=正常 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "number",
        "email": "string",
        "nickname": "string",
        "avatarUrl": "string",
        "status": "number",
        "createTime": "string"
      }
    ],
    "total": "number"
  }
}
```

---

#### POST /admin/users

创建用户。

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱 |
| password | string | 是 | 密码 |
| nickname | string | 否 | 昵称 |
| status | number | 否 | 0=禁用 1=正常，默认 1 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": "number"
  }
}
```

---

#### GET /admin/users/:id

用户详情。

**路径参数**：`id` - 用户 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": {
    "id": "number",
    "email": "string",
    "nickname": "string",
    "avatarUrl": "string",
    "gender": "number",
    "birthday": "string",
    "bio": "string",
    "status": "number",
    "createTime": "string",
    "updateTime": "string"
  }
}
```

---

#### PUT /admin/users/:id

更新用户。

**路径参数**：`id` - 用户 ID

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatarUrl | string | 否 | 头像 URL |
| gender | number | 否 | 性别 |
| birthday | string | 否 | 生日 |
| bio | string | 否 | 简介 |
| status | number | 否 | 0=禁用 1=正常 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### DELETE /admin/users/:id

删除用户。

**路径参数**：`id` - 用户 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

#### GET /admin/users/:id/roles

获取用户角色 ID 列表。

**路径参数**：`id` - 用户 ID

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": [1, 2]
}
```

---

#### PUT /admin/users/:id/roles

分配用户角色。

**路径参数**：`id` - 用户 ID

**请求体**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roleIds | number[] | 是 | 角色 ID 列表 |

**响应**

```json
{
  "code": 0,
  "message": "成功",
  "data": null
}
```

---

## 4. 权限与 RefreshToken 说明

### 4.1 需登录

请求需携带有效 accessToken，方式：

- Header: `Authorization: Bearer <access_token>`
- 或 Cookie（若 Web 端配置了 accessToken 写入 Cookie）

### 4.2 需 RefreshToken

| 接口 | 说明 |
|------|------|
| POST /auth/refresh | 必须能取到 refreshToken（Cookie 或 Body），否则无法刷新 |
| POST /auth/logout | 必须能取到 refreshToken，用于撤销会话 |

- Web 端：通过 Cookie `refreshToken` 自动携带
- Native 端：通过 Body 或 Header 显式传递

### 4.3 需 RBAC

在 accessToken 校验通过后，再校验权限。例如：

- `role:list`：可调用 GET /admin/roles
- `role:create`：可调用 POST /admin/roles
- `role:detail`：可调用 GET /admin/roles/:id、GET /admin/roles/:id/permissions
- `role:update`：可调用 PUT /admin/roles/:id、PUT /admin/roles/:id/permissions
- `role:delete`：可调用 DELETE /admin/roles/:id
- `permission:list`：可调用 GET /admin/permissions
- `menu:list` / `menu:create` / `menu:update` / `menu:delete`：对应菜单 CRUD
- `user:list` / `user:create` / `user:detail` / `user:update` / `user:delete`：对应用户 CRUD

实现方式：后端使用 `@PreAuthorize("hasAuthority('role:list')")` 等注解进行权限校验。
