import { UploadContract } from "@repo/api-client";
import { httpClient } from "../http-client";

/** FormData 上传示例：传入 FormData 时自动使用 multipart/form-data */
export const uploadApi = {
	upload: (formData: FormData) =>
		httpClient.post<UploadContract.UploadResponse>(UploadContract.upload.path, formData),
};
