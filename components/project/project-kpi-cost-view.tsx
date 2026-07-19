"use client"

import { useState, useEffect } from "react"
import { reportService } from "@/services/report.service"
import type { MemberKpiDTO } from "@/types/report.types"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Info, Download, Trophy, Medal, Award } from "lucide-react"
import { toast } from "sonner"

interface ProjectKpiCostViewProps {
  projectId: number
}

export function ProjectKpiCostView({ projectId }: ProjectKpiCostViewProps) {
  const [data, setData] = useState<MemberKpiDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    fetchData()
  }, [projectId, dateRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      const begin = dateRange.from ? dateRange.from.getTime() : undefined
      const end = dateRange.to ? dateRange.to.getTime() : undefined
      const res = await reportService.getMemberKpiCostReport(projectId, begin, end)
      if (Array.isArray(res)) {
        setData(res)
      } else if ((res as any)?.data && Array.isArray((res as any).data)) {
        setData((res as any).data)
      }
    } catch (error) {
      toast.error("Failed to load KPI data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const headers = ["Member", "Completed Tasks", "Hours Spent", "KPI Score"]
    const rows = data.map(d => [
      d.userName,
      d.totalCompletedTasks,
      d.totalHoursSpent,
      d.kpiScore,
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n")
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `kpi_report_project_${projectId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (index === 1) return <Medal className="h-4 w-4 text-slate-400" />
    if (index === 2) return <Award className="h-4 w-4 text-amber-700" />
    return <span className="text-xs text-slate-400 font-mono w-4 text-center">{index + 1}</span>
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 100) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (score >= 50) return "bg-blue-50 text-blue-700 border-blue-200"
    if (score >= 20) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-slate-50 text-slate-600 border-slate-200"
  }

  // Calculate summary stats
  const totalKpi = data.reduce((sum, d) => sum + d.kpiScore, 0)
  const totalCompletedTasks = data.reduce((sum, d) => sum + d.totalCompletedTasks, 0)
  const avgKpi = data.length > 0 ? (totalKpi / data.length) : 0

  return (
    <div className="space-y-5 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Member KPI Score</h3>
          <p className="text-sm text-slate-500">Evaluate member performance based on completed tasks, priority, and deadline adherence</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Filter by Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range: any) => setDateRange(range)}
                numberOfMonths={2}
              />
              <div className="p-3 border-t border-slate-100 flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => setDateRange({ from: undefined, to: undefined })}>
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2 bg-white text-slate-700" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-4">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Total KPI Points</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{totalKpi.toFixed(1)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-extrabold text-blue-700 mt-1">{avgKpi.toFixed(1)}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Tasks Completed</p>
            <p className="text-2xl font-extrabold text-indigo-700 mt-1">{totalCompletedTasks}</p>
          </div>
        </div>
      )}

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 w-10 text-center">#</TableHead>
                <TableHead className="font-semibold text-slate-700">Team Member</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Completed Tasks</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Hours Spent</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">
                  <div className="flex items-center justify-center gap-1">
                    KPI Score
                    <Info className="h-3 w-3 text-slate-400" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      Analyzing data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No completed tasks found in this period.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={row.userId} className="hover:bg-slate-50/50">
                    <TableCell className="text-center">
                      {getRankIcon(index)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                          {(row.userName || "?").charAt(0).toUpperCase()}
                        </div>
                        {row.userName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {row.totalCompletedTasks}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-slate-600">{row.totalHoursSpent} hrs</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-sm font-bold ${getScoreBadgeColor(row.kpiScore)}`}>
                        {row.kpiScore.toFixed(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex gap-3">
        <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
        <div>
          <p className="font-semibold mb-1">How is KPI Score calculated?</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-700/80">
            <li><strong>Base Score:</strong> Each completed task earns 10 base points.</li>
            <li><strong>Priority Weight:</strong> LOW ×1.0, MEDIUM ×1.2, HIGH ×1.5, CRITICAL ×2.0</li>
            <li><strong>Deadline Adherence:</strong> Completed early (+20% bonus), Completed late (-20% penalty), On-time (no modifier).</li>
            <li><strong>Duration:</strong> Time between task creation and completion date.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
