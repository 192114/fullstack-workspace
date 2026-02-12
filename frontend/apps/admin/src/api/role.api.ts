import {
	RoleContract,
	type RoleContract as T,
	type RoleDetail,
	type RoleListItem,
} from "@repo/api-client";
import { httpClient } from "../http-client";

export const roleApi = {
	list: (params: T.ListRequest) =>
		httpClient.get<T.ListResponse>(RoleContract.list.path, params as Record<string, unknown>),

	create: (data: T.CreateRequest) =>
		httpClient.post<RoleListItem | null>(RoleContract.create.path, data),

	getById: (id: number) =>
		httpClient.get<RoleDetail>(RoleContract.getById(id).path),

	update: (id: number, data: T.UpdateRequest) =>
		httpClient.put<unknown>(RoleContract.update(id).path, data),

	delete: (id: number) =>
		httpClient.delete<unknown>(RoleContract.delete_(id).path),

	getPermissions: (id: number) =>
		httpClient.get<number[]>(RoleContract.getPermissions(id).path),

	assignPermissions: (id: number, data: T.PermissionIdsRequest) =>
		httpClient.put<unknown>(RoleContract.assignPermissions(id).path, data),
};
