import {
	MenuContract,
	type MenuContract as T,
} from "@repo/api-client";
import { httpClient } from "../http-client";

export const menuApi = {
	getTree: () =>
		httpClient.get<T.TreeResponse>(MenuContract.getTree.path),

	create: (data: T.CreateRequest) =>
		httpClient.post<unknown>(MenuContract.create.path, data),

	update: (id: number, data: T.UpdateRequest) =>
		httpClient.put<unknown>(MenuContract.update(id).path, data),

	delete: (id: number) =>
		httpClient.delete<unknown>(MenuContract.delete_(id).path),
};
