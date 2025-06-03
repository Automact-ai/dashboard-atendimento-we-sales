import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  email: string
  password: string
}

export interface DashboardMetrics {
  total_conversations: number
  completed_conversations: number
  total_sales: number
  total_revenue: number
  total_objections: number
  handled_objections: number
  total_contacts: number
}

export interface TopProduct {
  product_name: string
  sales_count: number
  total_revenue: number
}

export interface TopObjection {
  objection_type: string
  count: number
  handled_count: number
  success_rate: number
}

export interface ContactReason {
  reason_category: string
  count: number
  resolved_count: number
}

export interface TimeSeriesData {
  date: string
  sales_count?: number
  total_revenue?: number
  conversation_count?: number
  completed_count?: number
}

// Dados mockados
const mockDashboardMetrics: DashboardMetrics = {
  total_conversations: 1847,
  completed_conversations: 1623,
  total_sales: 387,
  total_revenue: 212463, // Ticket médio de aprox. 549
  total_objections: 156,
  handled_objections: 142,
  total_contacts: 1847
}

const mockTopProducts: TopProduct[] = [
  {
    product_name: "Coturno Militar Tático",
    sales_count: 89,
    total_revenue: 53911
  },
  {
    product_name: "Bota Militar Combat",
    sales_count: 76,
    total_revenue: 45524
  },
  {
    product_name: "Tênis Militar Operacional",
    sales_count: 63,
    total_revenue: 37737
  },
  {
    product_name: "Meia Militar Térmica",
    sales_count: 98,
    total_revenue: 19600
  },
  {
    product_name: "Coturno Paraquedista",
    sales_count: 61,
    total_revenue: 39649
  }
]

const mockTopObjections: TopObjection[] = [
  {
    objection_type: "Preço muito alto",
    count: 45,
    handled_count: 38,
    success_rate: 84.4
  },
  {
    objection_type: "Prazo de entrega",
    count: 32,
    handled_count: 29,
    success_rate: 90.6
  },
  {
    objection_type: "Qualidade do produto",
    count: 28,
    handled_count: 26,
    success_rate: 92.8
  },
  {
    objection_type: "Necessidade real",
    count: 25,
    handled_count: 22,
    success_rate: 88.0
  },
  {
    objection_type: "Forma de pagamento",
    count: 26,
    handled_count: 27,
    success_rate: 100.0
  }
]

const mockContactReasons: ContactReason[] = [
  {
    reason_category: "Informações sobre produtos",
    count: 487,
    resolved_count: 456
  },
  {
    reason_category: "Status do pedido",
    count: 342,
    resolved_count: 338
  },
  {
    reason_category: "Suporte técnico",
    count: 298,
    resolved_count: 276
  },
  {
    reason_category: "Reclamações",
    count: 156,
    resolved_count: 142
  },
  {
    reason_category: "Trocas e devoluções",
    count: 234,
    resolved_count: 198
  }
]

const mockSalesOverTime: TimeSeriesData[] = [
  { date: '2024-01-01', sales_count: 28, total_revenue: 15372 },
  { date: '2024-01-02', sales_count: 34, total_revenue: 18666 },
  { date: '2024-01-03', sales_count: 31, total_revenue: 17019 },
  { date: '2024-01-04', sales_count: 29, total_revenue: 15921 },
  { date: '2024-01-05', sales_count: 42, total_revenue: 23058 },
  { date: '2024-01-06', sales_count: 38, total_revenue: 20862 },
  { date: '2024-01-07', sales_count: 45, total_revenue: 24705 },
  { date: '2024-01-08', sales_count: 33, total_revenue: 18117 },
  { date: '2024-01-09', sales_count: 37, total_revenue: 20313 },
  { date: '2024-01-10', sales_count: 40, total_revenue: 21960 },
  { date: '2024-01-11', sales_count: 35, total_revenue: 19215 },
  { date: '2024-01-12', sales_count: 32, total_revenue: 17568 },
  { date: '2024-01-13', sales_count: 44, total_revenue: 24156 },
  { date: '2024-01-14', sales_count: 39, total_revenue: 21411 },
  { date: '2024-01-15', sales_count: 36, total_revenue: 19764 }
]

const mockConversationsOverTime: TimeSeriesData[] = [
  { date: '2024-01-01', conversation_count: 89, completed_count: 82 },
  { date: '2024-01-02', conversation_count: 112, completed_count: 98 },
  { date: '2024-01-03', conversation_count: 97, completed_count: 89 },
  { date: '2024-01-04', conversation_count: 103, completed_count: 94 },
  { date: '2024-01-05', conversation_count: 128, completed_count: 115 },
  { date: '2024-01-06', conversation_count: 134, completed_count: 122 },
  { date: '2024-01-07', conversation_count: 156, completed_count: 142 },
  { date: '2024-01-08', conversation_count: 118, completed_count: 108 },
  { date: '2024-01-09', conversation_count: 142, completed_count: 127 },
  { date: '2024-01-10', conversation_count: 125, completed_count: 118 },
  { date: '2024-01-11', conversation_count: 109, completed_count: 101 },
  { date: '2024-01-12', conversation_count: 98, completed_count: 87 },
  { date: '2024-01-13', conversation_count: 145, completed_count: 134 },
  { date: '2024-01-14', conversation_count: 138, completed_count: 126 },
  { date: '2024-01-15', conversation_count: 153, completed_count: 140 }
]

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1000))
    const token = 'mock-jwt-token'
    Cookies.set('auth_token', token)
    return { token, user: { email: credentials.email, name: 'Admin' } }
  },
  
  logout: () => {
    Cookies.remove('auth_token')
    window.location.href = '/login'
  }
}

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDashboardMetrics
  },
  
  getTopProducts: async (): Promise<TopProduct[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockTopProducts
  },
  
  getTopObjections: async (): Promise<TopObjection[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockTopObjections
  },
  
  getContactReasons: async (): Promise<ContactReason[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockContactReasons
  },
  
  getSalesOverTime: async (period: string = '30d'): Promise<TimeSeriesData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockSalesOverTime
  },
  
  getConversationsOverTime: async (period: string = '30d'): Promise<TimeSeriesData[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockConversationsOverTime
  }
}

export const exportApi = {
  exportConversations: async (format: 'csv' | 'json' = 'csv') => {
    const response = await api.get(`/api/export/conversations?format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  },
  
  exportSales: async (format: 'csv' | 'json' = 'csv') => {
    const response = await api.get(`/api/export/sales?format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  },
  
  exportMetrics: async (format: 'csv' | 'json' = 'csv') => {
    const response = await api.get(`/api/export/metrics?format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default api 