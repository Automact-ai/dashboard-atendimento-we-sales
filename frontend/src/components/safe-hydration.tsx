'use client'

import { useEffect, useState, ReactNode } from 'react'

interface SafeHydrationProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que evita problemas de hidratação renderizando
 * o conteúdo apenas no lado do cliente
 */
export function SafeHydration({ children, fallback = null }: SafeHydrationProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface ClientOnlyProps {
  children: () => ReactNode
  fallback?: ReactNode
}

/**
 * Componente que renderiza conteúdo apenas no cliente
 * Útil para valores que mudam baseado no ambiente (datas, Math.random, etc)
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{children()}</>
} 