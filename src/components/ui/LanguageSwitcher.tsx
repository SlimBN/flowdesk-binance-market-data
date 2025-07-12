import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className, 
  compact = false 
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-language-switcher]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (compact) {
    return (
      <div className={`relative ${className || ''}`} data-language-switcher>
        <button
          onClick={toggleDropdown}
          className="
            p-2 text-gray-600 dark:text-gray-400 
            hover:text-gray-900 dark:hover:text-gray-100 
            hover:bg-gray-100 dark:hover:bg-gray-700 
            rounded-md transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          aria-label={t('language.switchTo', { language: currentLanguage?.name })}
        >
          <Globe className="w-4 h-4" />
        </button>

        <div 
          className={`
            absolute right-0 top-full mt-2 z-50
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-lg 
            min-w-[140px] 
            py-1
            transition-all duration-200 ease-in-out
            ${isOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-2'
            }
          `}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="
                w-full text-left px-3 py-2 text-sm 
                text-gray-700 dark:text-gray-200 
                hover:bg-gray-100 dark:hover:bg-gray-700 
                flex items-center justify-between
                transition-colors
              "
            >
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {currentLanguage?.code === language.code && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`} data-language-switcher>
      <button
        onClick={toggleDropdown}
        className="
          px-3 py-2 text-gray-600 dark:text-gray-400 
          hover:text-gray-900 dark:hover:text-gray-100 
          hover:bg-gray-100 dark:hover:bg-gray-700 
          rounded-md transition-colors
          flex items-center space-x-2
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        aria-label={t('language.switchTo', { language: currentLanguage?.name })}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
      </button>

      <div 
        className={`
          absolute right-0 top-full mt-2 z-50
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg shadow-lg 
          min-w-[140px] 
          py-1
          transition-all duration-200 ease-in-out
          ${isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
          }
        `}
      >
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="
              w-full text-left px-3 py-2 text-sm 
              text-gray-700 dark:text-gray-200 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              flex items-center justify-between
              transition-colors
            "
          >
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {currentLanguage?.code === language.code && (
              <Check className="w-4 h-4 text-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};