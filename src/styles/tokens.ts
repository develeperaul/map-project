export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#4527A0',
      hover: '#7A30A8',
      '20%': 'rgba(69, 39, 160, 0.2)',
      '75%': 'rgba(69, 39, 160, 0.75)',
      '80%': 'rgba(69, 39, 160, 0.8)',
    },
    secondary: {
      DEFAULT: '#9C27B0',
      '75%': 'rgba(156, 39, 176, 0.75)',
      '85%': 'rgba(156, 39, 176, 0.85)',
    },
    base: {
      '00': '#F9F6FA',
      '01': '#EBE3EF',
      '02': '#FDE6F3',
    },
    text: {
      '00': '#1A1A1A',
      '01': '#6B6375',
      '02': '#A7A7A7',
      disabled: '#A7A7A7',
    },
    white: '#FFFFFF',
    border: '#E5E4E7',
    warning: '#FF9800',
    'warning-10%': 'rgba(255, 152, 0, 0.1)',
    orange: '#FF9800',
    'orange-75%': 'rgba(255, 152, 0, 0.75)',
    purple: '#9C27B0',
    'purple-75%': 'rgba(156, 39, 176, 0.75)',
    red: {
      DEFAULT: '#F44336',
      '10%': 'rgba(244, 67, 54, 0.1)',
    },
    blue: {
      DEFAULT: '#2196F3',
      '10%': 'rgba(33, 150, 243, 0.1)',
    },
  },
  
  typography: {
    'body-xl': { fontSize: '20px', lineHeight: '28px', fontWeight: '500' },
    'body-l': { fontSize: '18px', lineHeight: '26px', fontWeight: '500' },
    'body-m': { fontSize: '16px', lineHeight: '24px', fontWeight: '500' },
    'body-m-reg': { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
    'body-s': { fontSize: '14px', lineHeight: '20px', fontWeight: '500' },
    'body-s-reg': { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
    'body-xs': { fontSize: '12px', lineHeight: '16px', fontWeight: '500' },
    'body-xs-reg': { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
  },
  
  shadows: {
    'shadow-200': '0 2px 4px rgba(0, 0, 0, 0.1)',
    'shadow-300': '0 4px 8px rgba(0, 0, 0, 0.15)',
    'shadow-400': '0 8px 16px rgba(0, 0, 0, 0.2)',
    'elevation-2': '0 1px 2px rgba(0, 0, 0, 0.05)',
    'elevation-4': '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  
  borderRadius: {
    button: '8px',
    card: '16px',
    chip: '20px',
  },
  
  spacing: {
    'button-x': '16px',
    'button-y': '12px',
    'card-pad': '20px',
    'chip-pad-x': '12px',
    'chip-pad-y': '8px',
  },
} as const;

export type DesignTokens = typeof designTokens;