"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { compactNumber, fullNumber } from "@/lib/format"
import type { DailyPoint } from "@/lib/data/analytics"

const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false } as const
const grid = <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string; unit?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-foreground tabular-nums">{fullNumber(p.value)}{unit}</span>
        </p>
      ))}
    </div>
  )
}

export function ViewsChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        <XAxis dataKey="label" {...axis} minTickGap={24} />
        <YAxis {...axis} tickFormatter={(v: number) => compactNumber(v)} width={48} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="views" name="Views" stroke="var(--chart-1)" strokeWidth={2} fill="url(#viewsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function EngagementChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        {grid}
        <XAxis dataKey="label" {...axis} minTickGap={24} />
        <YAxis {...axis} domain={["dataMin - 1", "dataMax + 1"]} tickFormatter={(v: number) => `${Math.round(v)}%`} width={44} />
        <Tooltip content={<ChartTooltip unit="%" />} />
        <Line type="monotone" dataKey="engagement" name="Engagement rate" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function TopContentChart({ data }: { data: { name: string; views: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" {...axis} tickFormatter={(v: number) => compactNumber(v)} />
        <YAxis type="category" dataKey="name" {...axis} width={150} tick={{ fontSize: 11, fill: "var(--foreground)" }} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="views" name="Views" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PlatformChart({ data }: { data: { label: string; views: number; engagement: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        {grid}
        <XAxis dataKey="label" {...axis} />
        <YAxis yAxisId="v" {...axis} tickFormatter={(v: number) => compactNumber(v)} width={48} />
        <YAxis yAxisId="e" orientation="right" {...axis} tickFormatter={(v: number) => `${v}%`} width={36} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
        <Bar yAxisId="v" dataKey="views" name="Views" fill="var(--chart-1)" radius={[6, 6, 0, 0]} barSize={28} />
        <Bar yAxisId="e" dataKey="engagement" name="Engagement %" fill="var(--chart-2)" radius={[6, 6, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
