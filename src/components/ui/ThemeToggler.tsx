import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggler: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center p-2 rounded-lg transition-all duration-200
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
      aria-label={t('theme.switchTo', { mode: theme === 'light' ? 'dark' : 'light' })}
      title={t('theme.switchTo', { mode: theme === 'light' ? 'dark' : 'light' })}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {theme === 'light' ? t('theme.dark') : t('theme.light')} {t('common.mode')}
        </span>
      )}
    </button>
  );
};

// Compact version for headers
export const CompactThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
      aria-label={t('theme.switchTo', { mode: theme === 'light' ? 'dark' : 'light' })}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
};
