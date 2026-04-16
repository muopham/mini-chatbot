import api from "./axios";

export const upload = {
 async uploadImage(file: File): Promise<string> {
 const formData = new FormData();
 formData.append("file", file);
 const res = await api.post("/upload/image", formData, {
 headers: { "Content-Type": "multipart/form-data" },
 });
 return res.data.url;
 },
};
