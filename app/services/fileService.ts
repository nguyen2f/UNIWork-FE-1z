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

