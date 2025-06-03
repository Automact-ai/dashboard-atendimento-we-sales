# Guia de Resolução de Problemas de Hidratação

## ⚠️ Causas Comuns de Erros de Hidratação

### 1. **Formatação de Datas e Horas**
```typescript
// ❌ ERRADO - Causa diferenças entre servidor e cliente
{new Date().toLocaleDateString('pt-BR')}

// ✅ CORRETO - Use funções padronizadas
import { formatDateSafe, formatTimeSafe } from '@/lib/utils'
{formatDateSafe(date)}
```

### 2. **Valores Aleatórios**
```typescript
// ❌ ERRADO - Math.random gera valores diferentes
const width = `${Math.floor(Math.random() * 40) + 50}%`

// ✅ CORRETO - Use valores fixos ou estado do cliente
const width = "65%"
```

### 3. **Verificações de Window/Document**
```typescript
// ❌ ERRADO - Cria branches diferentes entre servidor e cliente
if (typeof window !== 'undefined') {
  return <ClientComponent />
}

// ✅ CORRETO - Use hooks específicos
import { useHydrationSafe } from '@/hooks/use-hydration-safe'
const isClient = useHydrationSafe()
```

### 4. **APIs de Intl que variam**
```typescript
// ❌ ERRADO - Pode variar entre ambientes
new Intl.DateTimeFormat('pt-BR').format(date)

// ✅ CORRETO - Use formatação manual consistente
const day = date.getDate().toString().padStart(2, '0')
const month = (date.getMonth() + 1).toString().padStart(2, '0')
const year = date.getFullYear()
return `${day}/${month}/${year}`
```

## 🛠️ Ferramentas Disponíveis

### 1. **Componentes Seguros**
```typescript
import { SafeHydration, ClientOnly } from '@/components/safe-hydration'

// Para conteúdo que pode causar problemas
<SafeHydration fallback={<div>Carregando...</div>}>
  <ComponenteProblematico />
</SafeHydration>

// Para valores dinâmicos do cliente
<ClientOnly fallback="--">
  {() => new Date().toLocaleString()}
</ClientOnly>
```

### 2. **Hooks Utilitários**
```typescript
import { useHydrationSafe, useSafeValue } from '@/hooks/use-hydration-safe'

const isClient = useHydrationSafe()
const value = useSafeValue('valor-servidor', 'valor-cliente')
```

### 3. **Funções de Formatação Seguras**
```typescript
import { 
  formatDateSafe, 
  formatTimeSafe, 
  formatCurrency,
  formatNumber 
} from '@/lib/utils'

// Todas essas funções são seguras para hidratação
```

## 🚨 Configuração Global

### Layout Principal
```typescript
// app/layout.tsx
<html suppressHydrationWarning={true}>
  <body suppressHydrationWarning={true}>
    <HydrationProvider>
      {children}
    </HydrationProvider>
  </body>
</html>
```

### Provider de Hidratação
O `HydrationProvider` garante que problemas de hidratação sejam tratados globalmente.

## ✅ Checklist Antes de Adicionar Código

1. [ ] O código usa valores que podem mudar entre servidor e cliente?
2. [ ] Há formatação de datas usando `toLocaleDateString`?
3. [ ] Existe uso de `Math.random()` ou `Date.now()`?
4. [ ] Há verificações de `typeof window`?
5. [ ] APIs do `Intl` são usadas diretamente?

Se qualquer resposta for "sim", use as ferramentas deste guia.

## 🔧 Como Debugar

1. **Identifique a Fonte**: Procure por valores que mudam entre renders
2. **Use Supressão Temporária**: Adicione `suppressHydrationWarning` para localizar
3. **Aplique Correção**: Use componentes/hooks seguros
4. **Teste**: Verifique se o erro sumiu

## 📋 Padrões Estabelecidos

- **Datas**: Sempre use `formatDateSafe()` ou `formatTimeSafe()`
- **Valores Dinâmicos**: Use `ClientOnly` ou `SafeHydration`
- **Estados**: Initialize com valores consistentes
- **Formatação**: Prefira APIs básicas do JavaScript over Intl
- **Componentes**: Marque client components adequadamente

Seguindo esses padrões, você evitará 99% dos problemas de hidratação no projeto. 