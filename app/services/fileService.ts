const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function uploadFile(taskId: number, file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/files/upload?taskId=${taskId}`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  return response.json()
}

export async function deleteFile(fileId: number) {
  const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Delete failed")
  }

  return response.json()
}

export async function downloadFile(fileUrl: string, fileName: string) {
  const response = await fetch(fileUrl)
  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
