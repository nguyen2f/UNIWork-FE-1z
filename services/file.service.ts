import { api } from "./http-client"

export const fileService = {
  upload: (projectId: number, taskId: number, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return api({
      method: "POST",
      url: `/tasks/${projectId}/${taskId}/file/upload`,
      data: formData,
    })
  },

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
      url: `/tasks/${projectId}/${taskId}/file/${fileId}/download`,
      responseType: "blob",
    })

    const url = window.URL.createObjectURL(response.data)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)

    return response
  },
}

// Backward-compatible aliases
export const uploadFile = fileService.upload
export const deleteFile = fileService.delete
export const downloadFile = fileService.download
