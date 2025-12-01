import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        // Default variants
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",

        // Task Status variants
        PENDING: "border-transparent bg-slate-100 text-slate-700",
        TODO: "border-transparent bg-slate-100 text-slate-700",
        DOING: "border-transparent bg-amber-100 text-amber-700",
        IN_PROGRESS: "border-transparent bg-blue-100 text-blue-700",
        REVIEWING: "border-transparent bg-purple-100 text-purple-700",
        REVIEW: "border-transparent bg-purple-100 text-purple-700",
        COMPLETED: "border-transparent bg-emerald-100 text-emerald-700",
        DONE: "border-transparent bg-emerald-100 text-emerald-700",
        CANCELLED: "border-transparent bg-red-100 text-red-700",

        // Project Status variants
        PLANNING: "border-transparent bg-indigo-100 text-indigo-700",
        ON_HOLD: "border-transparent bg-orange-100 text-orange-700",

        // Priority variants
        CRITICAL: "border-transparent bg-red-500 text-white",
        HIGH: "border-transparent bg-rose-100 text-rose-700",
        MEDIUM: "border-transparent bg-amber-100 text-amber-700",
        LOW: "border-transparent bg-sky-100 text-sky-700",

        // Event Type variants
        MEETING: "border-transparent bg-blue-100 text-blue-700",
        DEADLINE: "border-transparent bg-red-100 text-red-700",
        PRESENTATION: "border-transparent bg-green-100 text-green-700",
        WORKSHOP: "border-transparent bg-orange-100 text-orange-700",

        // Risk Level variants
        HIGH_RISK: "border-transparent bg-red-100 text-red-700",
        MEDIUM_RISK: "border-transparent bg-amber-100 text-amber-700",
        LOW_RISK: "border-transparent bg-green-100 text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
