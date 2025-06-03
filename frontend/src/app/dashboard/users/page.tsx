'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity,
  Search,
  MoreHorizontal
} from 'lucide-react'
import { formatDateSafe, formatTimeSafe } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Supervisor' | 'Operador'
  status: 'Ativo' | 'Inativo'
  lastLogin: string
  avatar: string
}

export default function UsersPage() {
  const users: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com',
      role: 'Admin',
      status: 'Ativo',
      lastLogin: '2024-01-15T14:30:00Z',
      avatar: 'JS'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      role: 'Supervisor',
      status: 'Ativo',
      lastLogin: '2024-01-15T12:15:00Z',
      avatar: 'MS'
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@empresa.com',
      role: 'Operador',
      status: 'Inativo',
      lastLogin: '2024-01-12T16:45:00Z',
      avatar: 'PO'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      role: 'Operador',
      status: 'Ativo',
      lastLogin: '2024-01-15T11:20:00Z',
      avatar: 'AC'
    }
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-destructive text-[#f9fbfc] border border-destructive'
      case 'Supervisor':
        return 'bg-primary text-[#f9fbfc] border border-primary'
      case 'Operador':
        return 'bg-accent text-[#091724] border border-accent'
      default:
        return 'bg-muted text-muted-foreground border border-border'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-accent text-[#091724] border border-accent'
      case 'Inativo':
        return 'bg-muted text-muted-foreground border border-border'
      default:
        return 'bg-muted text-muted-foreground border border-border'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.length}
            </div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Ativos
            </CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.status === 'Ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">online hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.role === 'Admin').length}
            </div>
            <p className="text-xs text-muted-foreground">com acesso total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Operadores
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.role === 'Operador').length}
            </div>
            <p className="text-xs text-muted-foreground">atendimento ativo</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Todos
              </Button>
              <Button variant="outline" size="sm">
                Ativos
              </Button>
              <Button variant="outline" size="sm">
                Inativos
              </Button>
              <Button variant="outline" size="sm">
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-[#f9fbfc] font-medium">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Último login: {formatDateSafe(user.lastLogin)} às{' '}
                      {formatTimeSafe(user.lastLogin)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 