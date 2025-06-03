'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChartCard } from '@/components/dashboard/chart-card'
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Package,
  Search,
  Calendar
} from 'lucide-react'
import { formatCurrency, formatDateSafe } from '@/lib/utils'

interface Sale {
  id: string
  customer_name: string
  product_name: string
  amount: number
  status: 'completed' | 'pending' | 'cancelled'
  date: string
  payment_method: string
  agent?: string
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // Simulando dados enquanto o backend não está disponível
    setTimeout(() => {
      const mockSales: Sale[] = [
        {
          id: '1',
          customer_name: 'João Silva',
          product_name: 'Coturno Militar Tático',
          amount: 649.90,
          status: 'completed',
          date: '2024-01-15T10:30:00Z',
          payment_method: 'Cartão de Crédito',
          agent: 'Ana Costa'
        },
        {
          id: '2',
          customer_name: 'Maria Santos',
          product_name: 'Meia Militar Térmica',
          amount: 89.90,
          status: 'completed',
          date: '2024-01-15T09:15:00Z',
          payment_method: 'PIX',
          agent: 'Carlos Mendes'
        },
        {
          id: '3',
          customer_name: 'Pedro Oliveira',
          product_name: 'Bota Militar Combat',
          amount: 799.90,
          status: 'pending',
          date: '2024-01-15T08:45:00Z',
          payment_method: 'Boleto'
        },
        {
          id: '4',
          customer_name: 'Ana Costa',
          product_name: 'Tênis Militar Operacional',
          amount: 459.90,
          status: 'cancelled',
          date: '2024-01-14T16:20:00Z',
          payment_method: 'Cartão de Débito'
        },
        {
          id: '5',
          customer_name: 'Carlos Mendes',
          product_name: 'Coturno Paraquedista',
          amount: 729.90,
          status: 'completed',
          date: '2024-01-14T14:15:00Z',
          payment_method: 'PIX',
          agent: 'João Silva'
        },
        {
          id: '6',
          customer_name: 'Roberto Lima',
          product_name: 'Bota Militar Impermeável',
          amount: 549.90,
          status: 'completed',
          date: '2024-01-14T11:30:00Z',
          payment_method: 'Cartão de Crédito',
          agent: 'Ana Costa'
        }
      ]
      setSales(mockSales)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent text-[#091724] border border-accent'
      case 'pending':
        return 'bg-primary text-[#f9fbfc] border border-primary'
      case 'cancelled':
        return 'bg-destructive text-[#f9fbfc] border border-destructive'
      default:
        return 'bg-muted text-muted-foreground border border-border'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalSales = sales.filter(s => s.status === 'completed').length
  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, sale) => sum + sale.amount, 0)
  const pendingSales = sales.filter(s => s.status === 'pending').length
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0

  // Dados para gráfico (simulando vendas ao longo do tempo)
  const salesChartData = [
    { date: '2024-01-10', vendas: 32, receita: 17568 },
    { date: '2024-01-11', vendas: 28, receita: 15372 },
    { date: '2024-01-12', vendas: 34, receita: 18666 },
    { date: '2024-01-13', vendas: 29, receita: 15921 },
    { date: '2024-01-14', vendas: 42, receita: 23058 },
    { date: '2024-01-15', vendas: 38, receita: 20862 },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Vendas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              vendas concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              em vendas concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground">
              por venda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas Pendentes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingSales}</div>
            <p className="text-xs text-muted-foreground">
              aguardando processamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Vendas ao Longo do Tempo"
          data={salesChartData}
          type="bar"
          dataKey="vendas"
          xAxisKey="date"
          color="var(--primary)"
        />
        <ChartCard
          title="Receita ao Longo do Tempo"
          data={salesChartData}
          type="area"
          dataKey="receita"
          xAxisKey="date"
          color="var(--accent)"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                size="sm"
              >
                Concluídas
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('cancelled')}
                size="sm"
              >
                Canceladas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <div className="space-y-4">
        {filteredSales.map((sale) => (
          <Card key={sale.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {sale.customer_name}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(sale.status)}>
                      {getStatusText(sale.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Produto:</span>
                      <p className="font-medium text-foreground">{sale.product_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <p className="font-medium text-foreground">{formatCurrency(sale.amount)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pagamento:</span>
                      <p className="font-medium text-foreground">{sale.payment_method}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data:</span>
                      <p className="font-medium text-foreground">
                        {formatDateSafe(sale.date)}
                      </p>
                    </div>
                  </div>
                  {sale.agent && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Vendido por: {sale.agent}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {sale.status === 'pending' && (
                    <Button variant="default" size="sm">
                      Processar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma venda encontrada
            </h3>
            <p className="text-muted-foreground">
              Não há vendas que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 