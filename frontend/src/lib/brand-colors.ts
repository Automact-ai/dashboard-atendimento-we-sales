/**
 * Cores da marca - Dashboard de Atendimento
 * 
 * Essas cores representam a identidade visual da marca e devem ser
 * usadas consistentemente em todo o sistema.
 */

// Cores principais da marca
export const BRAND_COLORS = {
  // Cores primárias
  DARK_NAVY: '#091724',     // Azul escuro profundo - para backgrounds escuros
  NAVY: '#091f2f',          // Azul escuro secundário - para cards e elementos
  LIGHT: '#f9fbfc',         // Branco acinzentado - para backgrounds claros
  PRIMARY: '#5e7bf9',       // Azul primário - cor principal da marca
  CYAN: '#a1feff',          // Azul claro/cyan - para acentos e highlights
} as const;

// Paleta expandida com variações tonais
export const BRAND_PALETTE = {
  50: '#f0f8ff',   // Tom mais claro
  100: '#e0f0ff',  
  200: '#c7e2ff',  
  300: '#a1d0ff',  
  400: '#74b3ff',  
  500: '#5e7bf9',  // Cor primária
  600: '#4c63d2',  
  700: '#3d4fa6',  
  800: '#2c3a78',  
  900: '#091f2f',  // Azul escuro secundário
  950: '#091724',  // Azul mais escuro
} as const;

// Classes Tailwind correspondentes
export const BRAND_CLASSES = {
  // Backgrounds
  BG_PRIMARY: 'bg-brand-primary',
  BG_DARK_NAVY: 'bg-brand-dark-navy',
  BG_NAVY: 'bg-brand-navy',
  BG_LIGHT: 'bg-brand-light',
  BG_CYAN: 'bg-brand-cyan',
  
  // Textos
  TEXT_PRIMARY: 'text-brand-primary',
  TEXT_DARK_NAVY: 'text-brand-dark-navy',
  TEXT_NAVY: 'text-brand-navy',
  TEXT_LIGHT: 'text-brand-light',
  TEXT_CYAN: 'text-brand-cyan',
  
  // Bordas
  BORDER_PRIMARY: 'border-brand-primary',
  BORDER_DARK_NAVY: 'border-brand-dark-navy',
  BORDER_NAVY: 'border-brand-navy',
  BORDER_LIGHT: 'border-brand-light',
  BORDER_CYAN: 'border-brand-cyan',
  
  // Hover states
  HOVER_PRIMARY: 'hover:bg-brand-primary',
  HOVER_DARK_NAVY: 'hover:bg-brand-dark-navy',
  HOVER_NAVY: 'hover:bg-brand-navy',
  HOVER_LIGHT: 'hover:bg-brand-light',
  HOVER_CYAN: 'hover:bg-brand-cyan',
} as const;

// Combinações de cores pré-definidas para componentes comuns
export const BRAND_COMBINATIONS = {
  // Botão primário
  BUTTON_PRIMARY: `${BRAND_CLASSES.BG_PRIMARY} ${BRAND_CLASSES.TEXT_LIGHT} ${BRAND_CLASSES.HOVER_PRIMARY}/90`,
  
  // Botão secundário
  BUTTON_SECONDARY: `${BRAND_CLASSES.BG_NAVY} ${BRAND_CLASSES.TEXT_LIGHT} ${BRAND_CLASSES.HOVER_NAVY}/90`,
  
  // Card principal
  CARD_PRIMARY: `${BRAND_CLASSES.BG_LIGHT} ${BRAND_CLASSES.BORDER_NAVY}/20`,
  
  // Card escuro
  CARD_DARK: `${BRAND_CLASSES.BG_NAVY} ${BRAND_CLASSES.TEXT_LIGHT}`,
  
  // Link com destaque
  LINK_ACCENT: `${BRAND_CLASSES.TEXT_CYAN} hover:${BRAND_CLASSES.TEXT_PRIMARY}`,
  
  // Status de sucesso
  STATUS_SUCCESS: `${BRAND_CLASSES.BG_CYAN}/20 ${BRAND_CLASSES.TEXT_NAVY} ${BRAND_CLASSES.BORDER_CYAN}`,
  
  // Header/Navbar
  NAVBAR: `${BRAND_CLASSES.BG_DARK_NAVY} ${BRAND_CLASSES.TEXT_LIGHT}`,
  
  // Sidebar
  SIDEBAR: `${BRAND_CLASSES.BG_LIGHT} ${BRAND_CLASSES.BORDER_NAVY}/10`,
} as const;

// Função helper para obter cor da paleta
export function getBrandColor(shade: keyof typeof BRAND_PALETTE): string {
  return BRAND_PALETTE[shade];
}

// Função helper para verificar se uma cor é da marca
export function isBrandColor(color: string): boolean {
  return Object.values(BRAND_COLORS).includes(color as any);
} 