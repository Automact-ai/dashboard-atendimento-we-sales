'use client'

import { Bell, Search, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportApi } from '@/lib/api'

interface HeaderProps {
  title: string
  subtitle?: string
  showExport?: boolean
}

export function Header({ title, subtitle, showExport = false }: HeaderProps) {
  const handleExport = async (type: 'conversations' | 'sales' | 'metrics', format: 'csv' | 'json') => {
    try {
      let blob: Blob
      let filename: string

      switch (type) {
        case 'conversations':
          blob = await exportApi.exportConversations(format)
          filename = `conversas.${format}`
          break
        case 'sales':
          blob = await exportApi.exportSales(format)
          filename = `vendas.${format}`
          break
        case 'metrics':
          blob = await exportApi.exportMetrics(format)
          filename = `metricas.${format}`
          break
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao exportar:', error)
    }
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10 w-64 bg-input border-border"
            />
          </div>

          {/* Export */}
          {showExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport('conversations', 'csv')}>
                  Conversas (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('conversations', 'json')}>
                  Conversas (JSON)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('sales', 'csv')}>
                  Vendas (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('sales', 'json')}>
                  Vendas (JSON)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('metrics', 'csv')}>
                  Métricas (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('metrics', 'json')}>
                  Métricas (JSON)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  )
} 