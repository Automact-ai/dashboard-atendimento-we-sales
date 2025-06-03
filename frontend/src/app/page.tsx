'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Bot, Loader2 } from 'lucide-react'
import { useHydrated } from '@/hooks/useHydrated'

export default function HomePage() {
  const router = useRouter()
  const hydrated = useHydrated()

  useEffect(() => {
    if (!hydrated) return // Aguarda hidratação

    const token = Cookies.get('auth_token')
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router, hydrated])

  // Mostra loading até a hidratação terminar
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-stone-900 rounded-full">
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Dashboard de Atendimento
          </h1>
          <div className="flex items-center justify-center space-x-2 text-stone-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Inicializando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-stone-900 rounded-full">
            <Bot className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Dashboard de Atendimento
        </h1>
        <div className="flex items-center justify-center space-x-2 text-stone-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    </div>
  )
}
