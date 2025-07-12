import React from 'react';
import { ThemeProvider } from '../../contexts/ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';

export const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  </ThemeProvider>
); 