import { api } from "@/lib/api"

export const uploadFile = async (
  projectId: number,
  taskId: number,
  file: File
) => {
  const formData = new FormData()
  formData.append("file", file)

  return api({
    method: "POST",
    url: `/task/${projectId}/${taskId}/file/upload`,
    data: formData,
  })
}

export const deleteFile = async (
  projectId: number,
  taskId: number,
  fileId: string
) => {
  return api({
    method: "DELETE",
    url: `/task/${projectId}/${taskId}/file/${fileId}`,
  })
}

export const downloadFile = async (
  projectId: number,
  taskId: number,
  fileId: string,
  fileName: string
) => {
  const response = await api({
    method: "GET",
    url: `/task/${projectId}/${taskId}/file/${fileId}/download`,
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
}
