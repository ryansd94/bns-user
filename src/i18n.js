import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        resources: {
            vi: {
                translations: {
                    "Overview dashboard": "Overview dashboard",
                    "Dashboard": "Trang chủ",
                    "ADD_NEW": "Thêm mới",
                    "HIDE_SHOW_COLUMN": "Ẩn/hiện cột",
                    "EDIT": "Chỉnh sửa",
                    "DELETE": "Xóa",
                    "VIEW": "Hiển thị"
                }
            },
            en: {
                translations: {
                    "Overview dashboard": "Overview dashboard",
                    "ADD_NEW": "Add new",
                    "HIDE_SHOW_COLUMN": "Hide/show column",
                    "EDIT": "Edit",
                    "DELETE": "Delete",
                    "VIEW": "View"
                }
            },
            ar: {
                translations: {
                }
            }
        },
        fallbackLng: "vi",
        lng: 'vi', // default language

        // have a common namespace used around the full app
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    })

export default i18n