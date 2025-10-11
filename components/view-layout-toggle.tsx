"use client"

import { Button } from "@/components/ui/button"
import { Grid3x3, List } from "lucide-react"

interface ViewLayoutToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewLayoutToggle({ view, onViewChange }: ViewLayoutToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="gap-2"
      >
        <Grid3x3 className="h-4 w-4" />
        Grid
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
    </div>
  )
}
