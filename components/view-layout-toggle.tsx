"use client"

import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewLayoutToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewLayoutToggle({ view, onViewChange }: ViewLayoutToggleProps) {
  return (
    <div className="flex gap-1 border rounded-lg p-1">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="h-8"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
