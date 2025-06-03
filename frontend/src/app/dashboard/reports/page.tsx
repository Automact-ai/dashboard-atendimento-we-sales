'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartCard } from '@/components/dashboard/chart-card'
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react'

export default function ReportsPage() {
  // Dados simulados para gráficos
  const performanceData = [
    { mes: 'Jan', vendas: 120, conversas: 450, receita: 24000 },
    { mes: 'Feb', vendas: 98, conversas: 380, receita: 19600 },
    { mes: 'Mar', vendas: 156, conversas: 520, receita: 31200 },
    { mes: 'Abr', vendas: 134, conversas: 460, receita: 26800 },
    { mes: 'Mai', vendas: 178, conversas: 580, receita: 35600 },
    { mes: 'Jun', vendas: 145, conversas: 490, receita: 29000 },
  ]

  const channelData = [
    { canal: 'WhatsApp', conversas: 245 },
    { canal: 'Chat Web', conversas: 189 },
    { canal: 'Telegram', conversas: 87 },
    { canal: 'Instagram', conversas: 156 },
    { canal: 'Email', conversas: 234 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análises detalhadas do seu atendimento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Relatórios Gerados
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Crescimento
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+18.2%</div>
            <p className="text-xs text-muted-foreground">vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">234</div>
            <p className="text-xs text-muted-foreground">relatórios baixados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agendados
            </CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">relatórios automáticos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Performance Mensal"
          data={performanceData}
          type="line"
          dataKey="vendas"
          xAxisKey="mes"
          color="var(--primary)"
        />
        <ChartCard
          title="Conversas por Canal"
          data={channelData}
          type="bar"
          dataKey="conversas"
          xAxisKey="canal"
          color="var(--accent)"
        />
      </div>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Relatório de Vendas</h3>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Análise completa das vendas, conversões e receita por período
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Gerar Relatório
              </Button>
            </div>

            <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Performance dos Agentes</h3>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Desempenho individual dos agentes IA e métricas de eficiência
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Gerar Relatório
              </Button>
            </div>

            <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Satisfação do Cliente</h3>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Feedback dos clientes e índices de satisfação por canal
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Gerar Relatório
              </Button>
            </div>

            <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Conversas por Período</h3>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Volume de conversas e distribuição temporal do atendimento
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Gerar Relatório
              </Button>
            </div>

            <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Produtos Mais Vendidos</h3>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Ranking de produtos por vendas, receita e popularidade
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Gerar Relatório
              </Button>
            </div>

            <div className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Objeções e Respostas</h3>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Análise das principais objeções e efetividade das respostas
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 