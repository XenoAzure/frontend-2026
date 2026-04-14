import React, { createContext, useState, useContext, useEffect } from 'react';
import { en } from '../locales/en';
import { es } from '../locales/es';

const LanguageContext = createContext();

const locales = { en, es };

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (path) => {
        const keys = path.split('.');
        let result = locales[language];

        for (const key of keys) {
            if (result[key]) {
                result = result[key];
            } else {
                return path; // Return key if translation not found
            }
        }
        return result;
    };

    const toggleLanguage = (lang) => {
        if (locales[lang]) {
            setLanguage(lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
