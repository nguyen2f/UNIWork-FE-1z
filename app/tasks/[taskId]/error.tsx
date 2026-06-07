"use client"
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Task Detail Page Error:", error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full bg-white border border-red-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="h-8 w-8" />
          <h2 className="text-xl font-bold">Something went wrong!</h2>
        </div>
        
        <div className="bg-red-50 text-red-900 p-4 rounded-md overflow-auto mb-6">
          <p className="font-mono text-sm whitespace-pre-wrap">{error.message}</p>
          {error.stack && (
            <p className="font-mono text-xs mt-4 text-red-700 whitespace-pre-wrap opacity-80">{error.stack}</p>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
