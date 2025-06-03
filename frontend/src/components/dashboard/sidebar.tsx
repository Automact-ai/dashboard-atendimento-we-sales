'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  BarChart3, 
  Bot, 
  Home, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { authApi } from '@/lib/api'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Vendas', href: '/dashboard/sales', icon: ShoppingCart },
  { name: 'Agentes', href: '/dashboard/agents', icon: Bot },
  { name: 'Relatórios', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Usuários', href: '/dashboard/users', icon: Users },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    authApi.logout()
  }

  return (
    <div className={cn(
      "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground uppercase font-bold">We Sales FY</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground",
                  isCollapsed && "px-2",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center space-x-3",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              AD
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@empresa.com
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full mt-3 justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        )}
      </div>
    </div>
  )
} 