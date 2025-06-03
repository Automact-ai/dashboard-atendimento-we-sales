'use client'

import { useEffect, useState } from 'react'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { ChartCard } from '@/components/dashboard/chart-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Bot,
  Calendar,
  Filter 
} from 'lucide-react'
import { 
  dashboardApi, 
  DashboardMetrics, 
  TopProduct, 
  TopObjection, 
  ContactReason, 
  TimeSeriesData 
} from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topObjections, setTopObjections] = useState<TopObjection[]>([])
  const [contactReasons, setContactReasons] = useState<ContactReason[]>([])
  const [salesData, setSalesData] = useState<TimeSeriesData[]>([])
  const [conversationsData, setConversationsData] = useState<TimeSeriesData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Estados dos filtros
  const [periodFilter, setPeriodFilter] = useState<'7d' | '30d' | '90d'>('30d')
  const [agentFilter, setAgentFilter] = useState<'all' | 'customer_support' | 'sales_support'>('all')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [
          metricsData,
          productsData,
          objectionsData,
          reasonsData,
          salesTimeData,
          conversationsTimeData
        ] = await Promise.all([
          dashboardApi.getMetrics(),
          dashboardApi.getTopProducts(),
          dashboardApi.getTopObjections(),
          dashboardApi.getContactReasons(),
          dashboardApi.getSalesOverTime(periodFilter),
          dashboardApi.getConversationsOverTime(periodFilter)
        ])

        // Aplicar filtros dos agentes aos dados
        let filteredMetrics = { ...metricsData }
        let filteredProducts = [...productsData]
        let filteredObjections = [...objectionsData]
        let filteredReasons = [...reasonsData]
        let filteredSalesData = [...salesTimeData]
        let filteredConversationsData = [...conversationsTimeData]

        // Simular filtro por agente (normalmente isso viria do backend)
        if (agentFilter !== 'all') {
          const agentMultiplier = agentFilter === 'sales_support' ? 0.6 : 0.4
          
          filteredMetrics = {
            ...filteredMetrics,
            total_conversations: Math.round(filteredMetrics.total_conversations * agentMultiplier),
            completed_conversations: Math.round(filteredMetrics.completed_conversations * agentMultiplier),
            total_sales: agentFilter === 'sales_support' ? filteredMetrics.total_sales : Math.round(filteredMetrics.total_sales * 0.1),
            total_revenue: agentFilter === 'sales_support' ? filteredMetrics.total_revenue : Math.round(filteredMetrics.total_revenue * 0.1),
          }

          filteredSalesData = filteredSalesData.map(item => ({
            ...item,
            sales_count: item.sales_count ? Math.round(item.sales_count * agentMultiplier) : 0,
            total_revenue: item.total_revenue ? Math.round(item.total_revenue * agentMultiplier) : 0
          }))

          filteredConversationsData = filteredConversationsData.map(item => ({
            ...item,
            conversation_count: item.conversation_count ? Math.round(item.conversation_count * agentMultiplier) : 0,
            completed_count: item.completed_count ? Math.round(item.completed_count * agentMultiplier) : 0
          }))
        }

        setMetrics(filteredMetrics)
        setTopProducts(filteredProducts)
        setTopObjections(filteredObjections)
        setContactReasons(filteredReasons)
        setSalesData(filteredSalesData)
        setConversationsData(filteredConversationsData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [periodFilter, agentFilter])

  const getPeriodText = (period: string) => {
    switch (period) {
      case '7d':
        return 'Últimos 7 dias'
      case '30d':
        return 'Últimos 30 dias'
      case '90d':
        return 'Últimos 90 dias'
      default:
        return period
    }
  }

  const getAgentText = (agent: string) => {
    switch (agent) {
      case 'all':
        return 'Todos os Agentes'
      case 'customer_support':
        return 'Suporte ao Cliente'
      case 'sales_support':
        return 'Suporte Comercial'
      default:
        return agent
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filtro de Período */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Período
              </label>
              <div className="flex gap-2">
                <Button
                  variant={periodFilter === '7d' ? 'default' : 'outline'}
                  onClick={() => setPeriodFilter('7d')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  7 dias
                </Button>
                <Button
                  variant={periodFilter === '30d' ? 'default' : 'outline'}
                  onClick={() => setPeriodFilter('30d')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  30 dias
                </Button>
                <Button
                  variant={periodFilter === '90d' ? 'default' : 'outline'}
                  onClick={() => setPeriodFilter('90d')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  90 dias
                </Button>
              </div>
            </div>

            {/* Filtro de Agente */}
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Agente
              </label>
              <div className="flex gap-2">
                <Button
                  variant={agentFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setAgentFilter('all')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Bot className="h-3 w-3" />
                  Todos
                </Button>
                <Button
                  variant={agentFilter === 'customer_support' ? 'default' : 'outline'}
                  onClick={() => setAgentFilter('customer_support')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Bot className="h-3 w-3" />
                  Suporte
                </Button>
                <Button
                  variant={agentFilter === 'sales_support' ? 'default' : 'outline'}
                  onClick={() => setAgentFilter('sales_support')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Bot className="h-3 w-3" />
                  Vendas
                </Button>
              </div>
            </div>
          </div>
          
          {/* Indicador dos filtros ativos */}
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filtros ativos:</span>
            <Badge variant="secondary">{getPeriodText(periodFilter)}</Badge>
            <Badge variant="secondary">{getAgentText(agentFilter)}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricsCard
          title="Total de Contatos"
          value={metrics?.total_conversations || 0}
          change={12.5}
          changeType="positive"
          icon={MessageSquare}
          description="vs. mês anterior"
        />
        <MetricsCard
          title="Total de Vendas"
          value={metrics?.total_sales || 0}
          change={8.2}
          changeType="positive"
          icon={ShoppingCart}
          description="vs. mês anterior"
        />
        <MetricsCard
          title="Receita Total"
          value={metrics?.total_revenue || 0}
          change={15.3}
          changeType="positive"
          icon={DollarSign}
          format="currency"
          description="vs. mês anterior"
        />
        <MetricsCard
          title="Taxa de Conversão"
          value={metrics ? (metrics.total_sales / Math.max(metrics.total_conversations, 1)) * 100 : 0}
          change={-2.1}
          changeType="negative"
          icon={TrendingUp}
          format="percentage"
          description="vs. mês anterior"
        />
        <MetricsCard
          title="Ticket Médio"
          value={metrics ? metrics.total_revenue / Math.max(metrics.total_sales, 1) : 0}
          change={5.7}
          changeType="positive"
          icon={DollarSign}
          format="currency"
          description="vs. mês anterior"
        />
        <MetricsCard
          title="Objeções Tratadas"
          value={metrics ? (metrics.handled_objections / Math.max(metrics.total_objections, 1)) * 100 : 0}
          icon={Bot}
          format="percentage"
          description="taxa de resolução"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Vendas ao Longo do Tempo"
          data={salesData as unknown as Record<string, unknown>[]}
          type="area"
          dataKey="sales_count"
          xAxisKey="date"
          color="var(--primary)"
        />
        <ChartCard
          title="Contatos ao Longo do Tempo"
          data={conversationsData as unknown as Record<string, unknown>[]}
          type="line"
          dataKey="conversation_count"
          xAxisKey="date"
          color="var(--accent)"
        />
      </div>

      {/* Tabelas e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales_count} vendas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {formatCurrency(product.total_revenue || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Objeções */}
        <Card>
          <CardHeader>
            <CardTitle>Principais Objeções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topObjections.slice(0, 5).map((objection, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {objection.objection_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {objection.count} ocorrências
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {objection.success_rate.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivos de Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos de Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactReasons.slice(0, 5).map((reason, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {reason.reason_category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reason.count} contatos
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {reason.resolved_count} resolvidos
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 