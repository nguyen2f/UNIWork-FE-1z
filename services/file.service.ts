import { api } from "./http-client"

export const fileService = {
  upload: (projectId: number, taskId: number, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api({
      method: "POST",
      url: `/tasks/${taskId}/files`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  getFiles: (taskId: number) =>
    api({
      method: "GET",
      url: `/tasks/${taskId}/files`,
    }),

  delete: (projectId: number, taskId: number, fileId: string) =>
    api({
      method: "DELETE",
      url: `/tasks/${projectId}/${taskId}/file/${fileId}`,
    }),

  download: async (
  projectId: number,
  taskId: number,
  fileId: string,
  fileName: string,
) => {
  const response = await api({
    method: "GET",
    url: `/tasks/files/${fileId}/download`,
    responseType: "blob", // 👈 bắt buộc, để không bị parse sai binary
  })

  // Tuỳ http-client của bạn trả về gì — kiểm tra response.data hay chính response là Blob
  const blob = response.data instanceof Blob ? response.data : new Blob([response.data ?? response])

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  link.parentNode?.removeChild(link)
  window.URL.revokeObjectURL(url)
},

  preview: async (fileId: string) => {
    const response = await api({
      method: "GET",
      url: `/tasks/files/${fileId}/preview`,
    })
    return response?.url || response?.data?.url
  },
}

// Backward-compatible aliases
export const uploadFile = fileService.upload
export const deleteFile = fileService.delete
export const downloadFile = fileService.download
