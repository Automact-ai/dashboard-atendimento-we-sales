'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface ChartCardProps {
  title: string
  data: Record<string, unknown>[]
  type: 'line' | 'area' | 'bar' | 'pie'
  dataKey: string
  xAxisKey?: string
  color?: string
  height?: number
}

// Cores otimizadas para tema escuro
const COLORS = ['#5e7bf9', '#a1feff', '#74b3ff', '#a78bfa', '#60a5fa']

export function ChartCard({
  title,
  data,
  type,
  dataKey,
  xAxisKey = 'date',
  color = 'var(--primary)',
  height = 300
}: ChartCardProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--card-foreground)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--card-foreground)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={color}
              fillOpacity={0.2}
            />
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--card-foreground)'
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--card-foreground)'
              }}
            />
          </PieChart>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Tipo de gráfico não suportado
          </div>
        )
    }
  }

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 