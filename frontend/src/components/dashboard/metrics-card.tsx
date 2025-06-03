import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface MetricsCardProps {
  title: string
  value: number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  format?: 'number' | 'currency' | 'percentage'
  description?: string
}

export function MetricsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  format = 'number',
  description
}: MetricsCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      default:
        return formatNumber(val)
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'bg-accent text-[#091724] border border-accent'
      case 'negative':
        return 'bg-destructive text-[#f9fbfc] border border-destructive'
      default:
        return 'bg-muted text-muted-foreground border border-border'
    }
  }

  const getChangeSymbol = () => {
    if (change === undefined) return ''
    if (change > 0) return '+'
    return ''
  }

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        <div className="flex items-center justify-between mt-2">
          {change !== undefined && (
            <Badge variant="outline" className={getChangeColor()}>
              {getChangeSymbol()}{change.toFixed(1)}%
            </Badge>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 