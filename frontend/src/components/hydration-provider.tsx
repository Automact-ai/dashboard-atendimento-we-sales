'use client'

import { useEffect, useState, ReactNode } from 'react'

interface HydrationProviderProps {
  children: ReactNode
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Marca como hidratado imediatamente quando o componente monta no cliente
    setIsHydrated(true)
  }, [])

  // Se estamos no servidor ou ainda não hidratou, renderiza sem problemas
  if (!isHydrated) {
    return (
      <div suppressHydrationWarning>
        {children}
      </div>
    )
  }

  // Após hidratação, renderiza normalmente
  return <>{children}</>
} 