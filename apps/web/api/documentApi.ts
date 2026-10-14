import { API } from "./api";

export interface DocumentItem {
  id: string;
  userId: string;
  originalName: string;
  s3Key: string;
  mimeType: string;
  size: number;
  status: "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export const documentApi = {
  getDocs: () => API.get("document").then((res) => res.data),

  uploadDoc: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => res.data);
  },
};