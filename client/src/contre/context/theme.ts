import React from 'react';

export type Theme = 'light';
export type CardDisplay = 'unicode' | 'svg';

export const theme: Record<Theme, {
  cardDisplay: CardDisplay;
}> = {
  light: {
    cardDisplay: 'svg',
  },
};

export const ThemeContext = React.createContext(theme.light);
