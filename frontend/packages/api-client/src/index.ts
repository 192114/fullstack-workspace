/**
 * API Client - 从 OpenAPI 规范生成的类型与路径
 * 源文件: api-contract/openapi.yaml
 * 生成: pnpm run generate
 */

import type { components, paths } from "./generated/types";

const API_BASE = "/api";

export type User = components["schemas"]["User"];
export type UserCreate = components["schemas"]["UserCreate"];
export type UserListResponse = components["schemas"]["UserListResponse"];
export type UploadResponse = components["schemas"]["UploadResponse"];
export type TokenResponse = components["schemas"]["TokenResponse"];
export type ValidationError = components["schemas"]["ValidationError"];
export type UserMe = components["schemas"]["UserMe"];
export type AdminMe = components["schemas"]["AdminMe"];
export type AdminUserVo = components["schemas"]["AdminUserVo"];
export type MenuTreeItem = components["schemas"]["MenuTreeItem"];
export type RoleListItem = components["schemas"]["RoleListItem"];
export type RoleDetail = components["schemas"]["RoleDetail"];
export type RoleCreate = components["schemas"]["RoleCreate"];
export type RoleUpdate = components["schemas"]["RoleUpdate"];
export type PermissionTreeItem = components["schemas"]["PermissionTreeItem"];
export type MenuManagementTreeItem = components["schemas"]["MenuManagementTreeItem"];
export type MenuCreate = components["schemas"]["MenuCreate"];
export type MenuUpdate = components["schemas"]["MenuUpdate"];
export type AdminUserListItem = components["schemas"]["AdminUserListItem"];
export type AdminUserDetail = components["schemas"]["AdminUserDetail"];
export type AdminUserCreate = components["schemas"]["AdminUserCreate"];
export type AdminUserUpdate = components["schemas"]["AdminUserUpdate"];
export type RoleListResponse = components["schemas"]["RoleListResponse"];
export type AdminUserListResponse = components["schemas"]["AdminUserListResponse"];

export const ApiCode = { Success: 0, ValidationError: 1000 } as const;

export type ApiResult<T> = { code: number; message: string; data: T };

export namespace UserContract {
	export type ListRequest = { page: number; pageSize: number };
	export type ListResponse = UserListResponse;
	export const list = { path: `${API_BASE}/users`, method: "GET" } as const;

	export type CreateRequest = UserCreate;
	export type CreateResponse = User | null;
	export const create = { path: `${API_BASE}/users`, method: "POST" } as const;
}

export namespace UploadContract {
	export type UploadResponse = components["schemas"]["UploadResponse"];
	export const upload = { path: `${API_BASE}/upload`, method: "POST" } as const;
}

export namespace AuthContract {
	export type SendEmailRequest = components["schemas"]["SendEmail"];
	export type RegisterRequest = components["schemas"]["UserRegister"];
	export type LoginRequest = components["schemas"]["UserLogin"];
	export type RefreshRequest = components["schemas"]["RefreshTokenRequest"];
	export type LogoutRequest = components["schemas"]["LogoutRequest"];
	export type ChangePasswordRequest = components["schemas"]["ChangePasswordRequest"];
	export type ForgotPasswordRequest = components["schemas"]["ForgotPasswordRequest"];
	export type ResetPasswordRequest = components["schemas"]["ResetPasswordRequest"];
	export type TokenResponse = components["schemas"]["TokenResponse"];

	export const email = { path: `${API_BASE}/auth/email`, method: "POST" } as const;
	export const register = { path: `${API_BASE}/auth/register`, method: "POST" } as const;
	export const login = { path: `${API_BASE}/auth/login`, method: "POST" } as const;
	export const refresh = { path: `${API_BASE}/auth/refresh`, method: "POST" } as const;
	export const logout = { path: `${API_BASE}/auth/logout`, method: "POST" } as const;
	export const changePassword = { path: `${API_BASE}/auth/change-password`, method: "POST" } as const;
	export const forgotPassword = { path: `${API_BASE}/auth/forgot-password`, method: "POST" } as const;
	export const resetPassword = { path: `${API_BASE}/auth/reset-password`, method: "POST" } as const;
	export const me = { path: `${API_BASE}/auth/me`, method: "GET" } as const;
}

export namespace AdminMeContract {
	export type Response = AdminMe;
	export const getMe = { path: `${API_BASE}/admin/me`, method: "GET" } as const;
}

export namespace RoleContract {
	export type ListRequest = { page: number; pageSize: number; keyword?: string };
	export type ListResponse = RoleListResponse;
	export type CreateRequest = RoleCreate;
	export type UpdateRequest = RoleUpdate;
	export type PermissionIdsRequest = components["schemas"]["RolePermissionIds"];

	export const list = { path: `${API_BASE}/admin/roles`, method: "GET" } as const;
	export const create = { path: `${API_BASE}/admin/roles`, method: "POST" } as const;
	export const getById = (id: number) => ({ path: `${API_BASE}/admin/roles/${id}`, method: "GET" } as const);
	export const update = (id: number) => ({ path: `${API_BASE}/admin/roles/${id}`, method: "PUT" } as const);
	export const delete_ = (id: number) => ({ path: `${API_BASE}/admin/roles/${id}`, method: "DELETE" } as const);
	export const getPermissions = (id: number) =>
		({ path: `${API_BASE}/admin/roles/${id}/permissions`, method: "GET" } as const);
	export const assignPermissions = (id: number) =>
		({ path: `${API_BASE}/admin/roles/${id}/permissions`, method: "PUT" } as const);
}

export namespace PermissionContract {
	export type TreeResponse = PermissionTreeItem[];
	export const getTree = { path: `${API_BASE}/admin/permissions`, method: "GET" } as const;
}

export namespace MenuContract {
	export type TreeResponse = MenuManagementTreeItem[];
	export type CreateRequest = MenuCreate;
	export type UpdateRequest = MenuUpdate;

	export const getTree = { path: `${API_BASE}/admin/menus`, method: "GET" } as const;
	export const create = { path: `${API_BASE}/admin/menus`, method: "POST" } as const;
	export const update = (id: number) => ({ path: `${API_BASE}/admin/menus/${id}`, method: "PUT" } as const);
	export const delete_ = (id: number) => ({ path: `${API_BASE}/admin/menus/${id}`, method: "DELETE" } as const);
}

export namespace AdminUserContract {
	export type ListRequest = { page: number; pageSize: number; keyword?: string; status?: number };
	export type ListResponse = AdminUserListResponse;
	export type CreateRequest = AdminUserCreate;
	export type UpdateRequest = AdminUserUpdate;
	export type RoleIdsRequest = components["schemas"]["UserRoleIds"];

	export const list = { path: `${API_BASE}/admin/users`, method: "GET" } as const;
	export const create = { path: `${API_BASE}/admin/users`, method: "POST" } as const;
	export const getById = (id: number) => ({ path: `${API_BASE}/admin/users/${id}`, method: "GET" } as const);
	export const update = (id: number) => ({ path: `${API_BASE}/admin/users/${id}`, method: "PUT" } as const);
	export const delete_ = (id: number) => ({ path: `${API_BASE}/admin/users/${id}`, method: "DELETE" } as const);
	export const getRoles = (id: number) =>
		({ path: `${API_BASE}/admin/users/${id}/roles`, method: "GET" } as const);
	export const assignRoles = (id: number) =>
		({ path: `${API_BASE}/admin/users/${id}/roles`, method: "PUT" } as const);
}

export type { paths, components };
