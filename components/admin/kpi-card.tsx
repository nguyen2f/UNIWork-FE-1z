"use client"

import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "purple" | "orange"
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    border: "border-l-blue-500",
    icon: "bg-blue-100 text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-l-green-500",
    icon: "bg-green-100 text-green-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-l-purple-500",
    icon: "bg-purple-100 text-purple-600",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-l-orange-500",
    icon: "bg-orange-100 text-orange-600",
  },
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}: KPICardProps) {
  const config = colorConfig[color]

  return (
    <Card className={`border-l-4 ${config.border}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : "-"} {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`${config.icon} h-12 w-12 rounded-lg flex items-center justify-center`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
