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
	export type TokenResponse = components["schemas"]["TokenResponse"];

	export const email = { path: `${API_BASE}/auth/email`, method: "POST" } as const;
	export const register = { path: `${API_BASE}/auth/register`, method: "POST" } as const;
	export const login = { path: `${API_BASE}/auth/login`, method: "POST" } as const;
	export const refresh = { path: `${API_BASE}/auth/refresh`, method: "POST" } as const;
	export const logout = { path: `${API_BASE}/auth/logout`, method: "POST" } as const;
}

export type { paths, components };
