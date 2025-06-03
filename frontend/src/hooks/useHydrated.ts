import { useEffect, useState } from 'react'

/**
 * Hook para detectar quando a hidratação do cliente terminou
 * Útil para evitar erros de hidratação causados por extensões do navegador
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
} 