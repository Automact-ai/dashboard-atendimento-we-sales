import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Função de formatação de data COMPLETAMENTE segura para hidratação
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Usa apenas APIs básicas do JavaScript para formatação consistente
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return `${day}/${month}/${year}`
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Usa apenas APIs básicas do JavaScript para formatação consistente
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Função para formatação de data consistente que não causa hidratação
export function formatDateSafe(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Usa padStart para garantir formatação consistente
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Função para formatação de tempo consistente 
export function formatTimeSafe(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  
  return `${hours}:${minutes}`
}
