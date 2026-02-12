import { UserContract } from "@repo/api-client";
import { httpClient } from "../http-client";

export const userApi = {
	list: (params: UserContract.ListRequest) =>
		httpClient.get<UserContract.ListResponse>(UserContract.list.path, params),

	create: (data: UserContract.CreateRequest) =>
		httpClient.post<UserContract.CreateResponse>(UserContract.create.path, data),
};
