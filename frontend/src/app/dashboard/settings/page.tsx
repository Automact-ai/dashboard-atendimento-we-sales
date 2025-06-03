'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Save, 
  Key, 
  Bell,
  Shield,
  Palette,
  Database,
  MessageSquare
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Salvar Todas
        </Button>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input id="company-name" placeholder="Digite o nome da empresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email da Empresa</Label>
              <Input id="company-email" type="email" placeholder="contato@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefone</Label>
              <Input id="company-phone" placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Input id="timezone" placeholder="America/Sao_Paulo" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-description">Descrição da Empresa</Label>
            <Textarea 
              id="company-description" 
              placeholder="Descreva sua empresa e seus produtos/serviços..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            APIs e Integrações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="openai-key">Chave da API OpenAI</Label>
              <Input id="openai-key" type="password" placeholder="sk-..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-token">Token do WhatsApp</Label>
              <Input id="whatsapp-token" type="password" placeholder="Token da API" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram-token">Token do Telegram</Label>
              <Input id="telegram-token" type="password" placeholder="Bot Token" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram-token">Token do Instagram</Label>
              <Input id="instagram-token" type="password" placeholder="Access Token" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="test-mode" />
            <Label htmlFor="test-mode">Modo de Teste (Sandbox)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Configurações de Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="response-time">Tempo de Resposta (segundos)</Label>
              <Input id="response-time" type="number" placeholder="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-messages">Máx. Mensagens por Conversa</Label>
              <Input id="max-messages" type="number" placeholder="50" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Respostas Automáticas</Label>
                <p className="text-sm text-muted-foreground">Ativar respostas automáticas fora do horário</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Transferir para Humano</Label>
                <p className="text-sm text-muted-foreground">Permitir transferência para atendentes humanos</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Salvar Histórico</Label>
                <p className="text-sm text-muted-foreground">Manter histórico de todas as conversas</p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
            <Textarea 
              id="welcome-message" 
              placeholder="Olá! Como posso ajudá-lo hoje?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email de Notificações</Label>
              <p className="text-sm text-muted-foreground">Receber notificações por email</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Notificações no navegador</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Alertas de Vendas</Label>
              <p className="text-sm text-muted-foreground">Notificar quando uma venda for realizada</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Relatórios Automáticos</Label>
              <p className="text-sm text-muted-foreground">Envio automático de relatórios diários</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
              <Input id="session-timeout" type="number" placeholder="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attempts">Max. Tentativas de Login</Label>
              <Input id="max-attempts" type="number" placeholder="3" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">Exigir 2FA para todos os usuários</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Logs de Auditoria</Label>
                <p className="text-sm text-muted-foreground">Registrar todas as ações dos usuários</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Criptografia de Dados</Label>
                <p className="text-sm text-muted-foreground">Criptografar dados sensíveis</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Tema Escuro</Label>
              <p className="text-sm text-muted-foreground">Usar tema escuro como padrão</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Modo Compacto</Label>
              <p className="text-sm text-muted-foreground">Interface mais condensada</p>
            </div>
            <Switch />
          </div>
          
          <div className="space-y-2">
            <Label>Cores da Marca</Label>
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 bg-[#091724] rounded border border-border"></div>
              <div className="w-8 h-8 bg-[#091f2f] rounded border border-border"></div>
              <div className="w-8 h-8 bg-[#5e7bf9] rounded border border-border"></div>
              <div className="w-8 h-8 bg-[#a1feff] rounded border border-border"></div>
              <div className="w-8 h-8 bg-[#f9fbfc] rounded border border-border"></div>
              <Button variant="outline" size="sm">Personalizar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup e Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup e Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Backup Automático</Label>
              <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
            </div>
            <Switch />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Fazer Backup Agora
            </Button>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Restaurar Backup
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="retention-days">Retenção de Dados (dias)</Label>
            <Input id="retention-days" type="number" placeholder="365" />
            <p className="text-xs text-muted-foreground">
              Dados serão automaticamente removidos após este período
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 