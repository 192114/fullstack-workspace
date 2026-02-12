import {
	AdminUserContract,
	type AdminUserContract as T,
	type AdminUserDetail,
	type AdminUserListItem,
} from "@repo/api-client";
import { httpClient } from "../http-client";

export const adminUserApi = {
	list: (params: T.ListRequest) =>
		httpClient.get<T.ListResponse>(AdminUserContract.list.path, params as Record<string, unknown>),

	create: (data: T.CreateRequest) =>
		httpClient.post<AdminUserListItem | null>(AdminUserContract.create.path, data),

	getById: (id: number) =>
		httpClient.get<AdminUserDetail>(AdminUserContract.getById(id).path),

	update: (id: number, data: T.UpdateRequest) =>
		httpClient.put<unknown>(AdminUserContract.update(id).path, data),

	delete: (id: number) =>
		httpClient.delete<unknown>(AdminUserContract.delete_(id).path),

	getRoles: (id: number) =>
		httpClient.get<number[]>(AdminUserContract.getRoles(id).path),

	assignRoles: (id: number, data: T.RoleIdsRequest) =>
		httpClient.put<unknown>(AdminUserContract.assignRoles(id).path, data),
};
