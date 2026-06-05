import { api } from "@/lib/api";

interface BulkUploadResponse {
  message: string;
  data: { urls: string[] };
}

export async function bulkUploadFiles(files: File[]) {
  if (files.length === 0) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await api.post<BulkUploadResponse>(
    "/s3/bulk-upload",
    formData,
  );

  return data.data.urls;
}
