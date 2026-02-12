import { PermissionContract } from "@repo/api-client";
import { httpClient } from "../http-client";

export const permissionApi = {
	getTree: () =>
		httpClient.get<PermissionContract.TreeResponse>(PermissionContract.getTree.path),
};
