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
    })

    if (response?.url || response?.data?.url) {
      const url = response.url || response.data.url
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    }

    return response
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
