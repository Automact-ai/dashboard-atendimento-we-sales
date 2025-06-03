'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Bot, 
  MessageSquare, 
  Star, 
  Clock,
  Users,
  TrendingUp,
  Shield,
  DollarSign
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface AgentData {
  id: string
  name: string
  type: 'customer_support' | 'sales_support'
  status: 'online' | 'offline' | 'busy'
  description: string
  specialties: string[]
  performance: {
    conversations_handled: number
    average_response_time: number // em segundos
    satisfaction_rate: number // porcentagem
    sales_converted?: number
  }
  availability: {
    hours: string
    timezone: string
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Dados fixos dos agentes
    setTimeout(() => {
      const agentsData: AgentData[] = [
        {
          id: 'agent-customer-support',
          name: 'Agente de Suporte ao Cliente',
          type: 'customer_support',
          status: 'online',
          description: 'Especializado em atendimento ao cliente, resolução de problemas técnicos, dúvidas sobre produtos e suporte pós-venda.',
          specialties: [
            'Suporte Técnico',
            'Dúvidas sobre Produtos',
            'Pós-venda',
            'Reclamações',
            'Trocas e Devoluções'
          ],
          performance: {
            conversations_handled: 847,
            average_response_time: 45, // 45 segundos
            satisfaction_rate: 94.2
          },
          availability: {
            hours: '24/7',
            timezone: 'GMT-3 (Brasília)'
          }
        },
        {
          id: 'agent-sales-support',
          name: 'Agente de Suporte Comercial',
          type: 'sales_support',
          status: 'online',
          description: 'Focado em vendas, tratamento de objeções, negociação de preços e conversão de leads em clientes.',
          specialties: [
            'Vendas e Negociação',
            'Tratamento de Objeções',
            'Consultoria de Produtos',
            'Upselling',
            'Cross-selling'
          ],
          performance: {
            conversations_handled: 623,
            average_response_time: 32, // 32 segundos
            satisfaction_rate: 96.8,
            sales_converted: 387
          },
          availability: {
            hours: '08:00 - 20:00',
            timezone: 'GMT-3 (Brasília)'
          }
        }
      ]
      setAgents(agentsData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-accent text-[#091724] border border-accent'
      case 'busy':
        return 'bg-primary text-[#f9fbfc] border border-primary'
      case 'offline':
        return 'bg-muted text-muted-foreground border border-border'
      default:
        return 'bg-muted text-muted-foreground border border-border'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'busy':
        return 'Ocupado'
      case 'offline':
        return 'Offline'
      default:
        return status
    }
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'customer_support':
        return <Shield className="h-6 w-6" />
      case 'sales_support':
        return <DollarSign className="h-6 w-6" />
      default:
        return <Bot className="h-6 w-6" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agentes IA</h1>
          <p className="text-muted-foreground">
            Informações sobre os agentes de atendimento do sistema
          </p>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Conversas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(agents.reduce((sum, agent) => sum + agent.performance.conversations_handled, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              processadas pelos agentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio de Resposta
            </CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(agents.reduce((sum, agent) => sum + agent.performance.average_response_time, 0) / agents.length)}s
            </div>
            <p className="text-xs text-muted-foreground">
              média entre agentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Satisfação
            </CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {((agents.reduce((sum, agent) => sum + agent.performance.satisfaction_rate, 0) / agents.length)).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              satisfação geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas Convertidas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(agents.find(a => a.performance.sales_converted)?.performance.sales_converted || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              pelo agente comercial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Informações dos Agentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="h-fit">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getAgentIcon(agent.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-foreground">{agent.name}</CardTitle>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {getStatusText(agent.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Descrição */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Descrição</h4>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>

              {/* Especialidades */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversas Atendidas</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatNumber(agent.performance.conversations_handled)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tempo de Resposta</span>
                    <span className="text-sm font-medium text-foreground">
                      {agent.performance.average_response_time}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taxa de Satisfação</span>
                    <span className="text-sm font-medium text-foreground">
                      {agent.performance.satisfaction_rate}%
                    </span>
                  </div>
                  {agent.performance.sales_converted && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Vendas Convertidas</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatNumber(agent.performance.sales_converted)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Disponibilidade */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Disponibilidade</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Horário</span>
                    <span className="text-sm font-medium text-foreground">
                      {agent.availability.hours}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fuso Horário</span>
                    <span className="text-sm font-medium text-foreground">
                      {agent.availability.timezone}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 