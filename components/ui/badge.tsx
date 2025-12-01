import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
    {
        variants: {
            variant: {
                PENDING: "border-transparent bg-gray-400 text-white",
                DOING: "border-transparent bg-yellow-500 text-white",
                REVIEWING: "border-transparent bg-blue-500 text-white",
                COMPLETED: "border-transparent bg-green-500 text-white",
                CANCELLED: "border-transparent bg-red-500 text-white",
            },
        },
        defaultVariants: {
            variant: "PENDING",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
