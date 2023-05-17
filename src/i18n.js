import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import viLang from 'assets/lang/vi.json'
import enLang from 'assets/lang/en.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        resources: {
            vi: {
                translations: viLang
            },
            en: {
                translations: enLang
            },
            ar: {
                translations: {
                }
            }
        },
        fallbackLng: "en",
        lng: 'en', // default language

        // have a common namespace used around the full app
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    })

export default i18n