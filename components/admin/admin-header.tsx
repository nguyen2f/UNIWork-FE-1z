"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

interface AdminHeaderProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  showExport?: boolean
}

export function AdminHeader({
  title,
  description,
  actionLabel,
  onAction,
  showExport,
}: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-start p-6 border-b">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <div className="flex gap-2">
        {showExport && (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
