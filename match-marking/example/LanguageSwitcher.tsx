import React from 'react'
import { useLanguage } from '@/lib/languageContext'

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage()

    const handleLanguageChange = (newLanguage: 'en' | 'th') => {
        setLanguage(newLanguage)
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => handleLanguageChange('th')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${language === 'th'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                ไทย
            </button>
        </div>
    )
}

export default LanguageSwitcher 