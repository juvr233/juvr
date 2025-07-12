import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          i18n.language === 'en' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('zh')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          i18n.language === 'zh' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        ZH
      </button>
    </div>
  );
};

export default LanguageSwitcher;
