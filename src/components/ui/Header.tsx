import React from "react";
import { TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggler } from './ThemeToggler';
import { LanguageSwitcher } from './LanguageSwitcher';


interface HeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
    lastUpdated?: Date | null;
  }
  
  export const Header: React.FC<HeaderProps> = ({ 
    onRefresh, 
    isRefreshing = false,
    lastUpdated 
  }) => {
    const { t } = useTranslation();
  
    return (
      <header className="
        sticky top-0 z-50 
        bg-white/80 dark:bg-gray-900/80 
        border-b border-gray-200 dark:border-gray-700
        px-6 py-4
        backdrop-blur-sm
      ">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('app.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>
          </div>
  
          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                <span>
                  {t('header.lastUpdated', { time: lastUpdated.toLocaleTimeString() })}
                </span>
              </div>
            )}
  
            {/* Refresh button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`
                  px-3 py-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium rounded-lg transition-colors duration-200
                  ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                aria-label={t('header.refresh')}
                title={isRefreshing ? t('header.refreshing') : t('header.refresh')}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
  
            {/* Language switcher */}
            <LanguageSwitcher compact />
  
            {/* Theme toggle */}
            <ThemeToggler />
          </div>
        </div>
      </header>
    );
  };