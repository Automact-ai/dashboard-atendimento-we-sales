import { useEffect, useState } from 'react'

/**
 * Hook para evitar problemas de hidratação
 * Retorna true apenas quando o componente está no cliente
 */
export function useHydrationSafe() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook para formatação segura de dados que variam entre servidor e cliente
 */
export function useSafeValue<T>(
  serverValue: T,
  clientValue: T
): T {
  const isClient = useHydrationSafe()
  return isClient ? clientValue : serverValue
} 