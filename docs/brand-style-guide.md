# Guia de Estilos - Cores da Marca

## Paleta de Cores

### Cores Principais

| Cor | Hex | Uso Principal |
|-----|-----|---------------|
| **Azul Escuro Profundo** | `#091724` | Backgrounds escuros, texto principal no tema claro |
| **Azul Escuro Secundário** | `#091f2f` | Cards, elementos secundários no tema escuro |
| **Branco Acinzentado** | `#f9fbfc` | Backgrounds claros, texto no tema escuro |
| **Azul Primário** | `#5e7bf9` | Botões primários, links, elementos de destaque |
| **Azul Claro/Cyan** | `#a1feff` | Acentos, highlights, status de sucesso |

### Paleta Expandida

```css
--brand-50: #f0f8ff   /* Tom mais claro */
--brand-100: #e0f0ff  
--brand-200: #c7e2ff  
--brand-300: #a1d0ff  
--brand-400: #74b3ff  
--brand-500: #5e7bf9  /* Cor primária */
--brand-600: #4c63d2  
--brand-700: #3d4fa6  
--brand-800: #2c3a78  
--brand-900: #091f2f  /* Azul escuro secundário */
--brand-950: #091724  /* Azul mais escuro */
```

## Como Usar

### 1. Variáveis CSS (Recomendado)

Use as variáveis CSS definidas no `globals.css`:

```css
/* Tema claro */
background-color: var(--background);
color: var(--foreground);
border-color: var(--border);

/* Elementos específicos */
.button-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

### 2. Classes Tailwind Personalizadas

```jsx
// Botão primário
<button className="bg-brand-primary text-brand-light hover:bg-brand-primary/90">
  Clique aqui
</button>

// Card com cores da marca
<div className="bg-brand-light border border-brand-navy/20 text-brand-dark-navy">
  Conteúdo do card
</div>
```

### 3. Constantes TypeScript

```jsx
import { BRAND_COLORS, BRAND_COMBINATIONS } from '@/lib/brand-colors';

// Usando constantes
<div style={{ backgroundColor: BRAND_COLORS.PRIMARY }}>
  Elemento com cor da marca
</div>

// Usando combinações pré-definidas
<button className={BRAND_COMBINATIONS.BUTTON_PRIMARY}>
  Botão primário
</button>
```

## Aplicação por Componente

### Buttons

```jsx
// Primário
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Ação Principal
</Button>

// Secundário
<Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
  Ação Secundária
</Button>

// Accent
<Button className="bg-accent text-accent-foreground hover:bg-accent/90">
  Destaque
</Button>
```

### Cards

```jsx
// Card padrão
<Card className="bg-card text-card-foreground border-border">
  <CardContent>Conteúdo</CardContent>
</Card>

// Card com destaque
<Card className="bg-accent/10 text-accent-foreground border-accent">
  <CardContent>Conteúdo destacado</CardContent>
</Card>
```

### Navigation

```jsx
// Sidebar
<div className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
  <nav>...</nav>
</div>

// Navbar
<header className="bg-brand-dark-navy text-brand-light">
  <nav>...</nav>
</header>
```

### Status e Feedback

```jsx
// Sucesso
<div className="bg-accent/20 text-accent-foreground border border-accent rounded-md p-3">
  Operação realizada com sucesso!
</div>

// Informação
<div className="bg-primary/20 text-primary-foreground border border-primary rounded-md p-3">
  Informação importante
</div>
```

## Contraste e Acessibilidade

### Combinações Aprovadas

✅ **Bom contraste:**
- Texto `#091724` em background `#f9fbfc`
- Texto `#f9fbfc` em background `#091724`
- Texto `#f9fbfc` em background `#5e7bf9`
- Texto `#091724` em background `#a1feff`

❌ **Evitar:**
- Texto `#5e7bf9` em background `#a1feff` (baixo contraste)
- Texto `#091f2f` em background `#091724` (muito similar)

### Verificação de Contraste

Sempre verifique que as combinações de cores atendem às diretrizes WCAG:
- **AA**: Contraste mínimo de 4.5:1 para texto normal
- **AAA**: Contraste mínimo de 7:1 para texto normal

## Temas Escuro e Claro

### Tema Claro
- **Background principal:** `#f9fbfc`
- **Texto principal:** `#091724`
- **Cards:** `#ffffff` com borda sutil
- **Elementos de destaque:** `#5e7bf9`

### Tema Escuro
- **Background principal:** `#091724`
- **Texto principal:** `#f9fbfc`
- **Cards:** `#091f2f`
- **Elementos de destaque:** `#5e7bf9` ou `#a1feff`

## Implementação em Gráficos

Para componentes de gráficos (Recharts), use as variáveis chart:

```jsx
const chartConfig = {
  primary: {
    color: 'var(--chart-1)', // #5e7bf9
  },
  secondary: {
    color: 'var(--chart-2)', // #a1feff
  },
  tertiary: {
    color: 'var(--chart-3)', // #091f2f
  },
};
```

## Boas Práticas

1. **Consistência**: Use sempre as variáveis CSS em vez de valores hardcoded
2. **Hierarquia**: Reserve o azul primário para ações principais
3. **Legibilidade**: Sempre teste o contraste entre texto e fundo
4. **Feedback**: Use as cores de status para comunicar estados
5. **Branding**: Mantenha a identidade visual consistente em todo o sistema

## Exemplo Completo

```jsx
import { BRAND_COMBINATIONS } from '@/lib/brand-colors';

function DashboardCard({ title, value, trend }) {
  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        <div className={`text-sm ${trend > 0 ? 'text-accent-foreground' : 'text-destructive'}`}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </div>
      </CardContent>
    </Card>
  );
}
``` 