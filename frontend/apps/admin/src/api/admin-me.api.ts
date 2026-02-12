import { AdminMeContract } from "@repo/api-client";
import { httpClient } from "../http-client";

export const adminMeApi = {
	getMe: () =>
		httpClient.get<AdminMeContract.Response>(AdminMeContract.getMe.path),
};
