﻿import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

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
                }
            },
            en: {
                translations: {
                    "Overview dashboard": "Overview dashboard",
                    //"Dashboard": "Dashboard",
                    //"Danh mục": "Category",
                    //"Khu vực": "Area"
                }
            },
            ar: {
                translations: {
                    "Overview dashboard": "نظرة عامة على لوحة القيادة",
                    "7 Days": "7 أيام",
                    "1 Month": "شهر واحد",
                    "3 Month": "3 أشهر",
                    "24 Mar 2019 - 24 Mar 2019 ": "24 مارس 2019 - 24 مارس 2019",
                    "Action": "عمل",
                    "Another action": "عمل آخر",
                    "Something else here": "شيء آخر هنا",
                    "Separated link": "رابط منفصل",
                    "Users": "المستخدمين",
                    "Business": "اعمال",
                    "Performance": "أداء",
                    "Orders": "طلب",
                    "Completed": "منجز",
                    "Unique Visitors": "زائرين فريدين من نوعهم",
                    "Impressions": "الانطباعات",
                    "Increased since yesterday": "زيادة منذ أمس",
                    "Followers": "متابعون",
                    "Decreased since yesterday": "انخفضت منذ أمس",
                    "Recent Activity": "النشاط الأخير",
                    "Settings": "الإعدادات",
                    "Total Profit": "اجمالي الربح",
                    "Expenses": "نفقات",
                    "Devices sales": "مبيعات الأجهزة",
                    "( growth 62% )": "(نمو 62 ٪)",
                    "Timezone": "وحدة الوقت",
                    "Demand": "الطلب",
                    "Supply": "تتبرع",
                    "Account Retention": "الحفاظ على الحساب",
                    "Conversion": "التحويلات",
                    "Cancellation": "إلغاء",
                    "Page views analytics": "تحليلات مشاهدات الصفحة",
                    "This week": "هذا الاسبوع",
                    "Current week": "الأسبوع الحالي",
                    "Iva Barber": "إيفا باربر",
                    "added new task on trello": "أضف مهمة جديدة على trello",
                    "Dorothy Romero": "دوروثي روميرو",
                    "Ricardo Hawkins": "ريكاردو هوكينز",
                    "Noah Montgomery": "نوح مونتغمري",
                    "My Balance": "رصيدي",
                    "Deposit": "الوديعة:",
                    "Available": "متاح",
                    "Pending": "قيد الانتظار",
                    "Sales Prediction": "توقعات المبيعات",
                    "350-985 sales": "مبيعات 350-985",
                    "Timezone:": "المناطق الزمنية:",
                    "Eastern Delight Time": "وقت البهجة الشرقية",
                    "Stock History": "تاريخ الأسهم",
                    "sales": "مبيعات",
                    "Product Catalog": "بيان المنتج",
                    "Project List": "قائمة المشروع",
                    "Landing Page": "الصفحة المقصودة",

                    "Main": "الرئيسي",
                    "Dashboard": "لوحة القيادة",
                    "Widgets": "الحاجيات",
                    "UI Elements": "عناصر واجهة المستخدم",
                    "UI Features": "ميزات واجهة المستخدم",
                    "Basic UI Elements": "العناصر الأساسية",
                    "Accordions": "أكورديون",
                    "Buttons": "زر",
                    "Badges": "شارات",
                    "Breadcrumbs": "فتات الخبز",
                    "Forms": "نماذج",
                    "Data Representation": "شرح البيانات",
                    "Dropdowns": "قائِمة مُنْسَدِلة",
                    "Modals": "الحوار",
                    "Progress bar": "شريط التقدم",
                    "Pagination": "ترقيم الصفحات",
                    "Tabs": "علامات التبويب",
                    "Typography": "الاسلوب والظهور",
                    "Tooltips": "تلميح",
                    "Advanced UI": "واجهة المستخدم المتقدمة",
                    "Clipboard": "الحافظة",
                    "Context menu": "قائمة السياق",
                    "Sliders": "الانزلاق",
                    "Carousel": "دائري",
                    "Loaders": "رافعاتs",
                    "Form elements": "نماذج",
                    "Basic Elements": "عناصر النموذج",
                    "Advanced Elements": "العناصر المتقدمة",
                    "Validation": "التحقق من صحة",
                    "Wizard": "ساحر",
                    "Editors": "المحررين",
                    "Text Editors": "محرري النصوص",
                    "Code Editors": "محرري الكود",
                    "Charts": "الرسوم البيانية",
                    "Tables": "الطاولةs",
                    "Basic table": "الجداول الأساسية",
                    "Data table": "جداول البيانات",
                    "Popups": "يظهر فجأةs",
                    "Notifications": "إخطاراتs",
                    "Icons": "الرموز",
                    "Maps": "خرائط",
                    "Sample Pages": "صفحات عينة",
                    "User Pages": "صفحات المستخدم",
                    "Login": "تسجيل الدخول",
                    "Login 2": " تسجيل الدخول 2 ",
                    "Register": "سجل",
                    "Register 2": " سجل 2 ",
                    "Lockscreen": " قفل الشاشة ",
                    "Error pages": "صفحات خطأ",
                    "General Pages": "الصفحات العامة",
                    "Blank Page": " صفحة فارغة ",
                    "Profile": "الملف الشخصي ",
                    "FAQ": "تعليمات",
                    "FAQ 2": " أسئلة مكررة 2 ",
                    "News grid": " شبكة الأخبار ",
                    "Timeline": " الجدول الزمني ",
                    "Search Results": " نتائج البحث ",
                    "Chat": " دردشة",
                    "Tickets": " تذاكر ",
                    "Gallery": " صالة عرض",
                    "Todo list": "قوائم المهام",
                    "E-commerce": "التجارة الإلكترونية",
                    "Invoice": " فاتورة ",
                    "Pricing Table": " جدول التسعير ",
                    "Applications": "تطبيقات",
                    "E-mail": "البريد الإلكتروني",
                    "Kanban Board": "كانبان بورد",
                    "Calendar": "التقويم",
                    "Help": "مساعدة",
                    "Documentation": "توثيق",
                    "Henry Klein": "هنري كلاين",
                    "Take Tour": "خذ جولة",
                    "Log Out": "تسجيل خروج",


                    "Reports": "تقارير",
                    "PDF": "بي دي إف",
                    "doc": "وثيقة",
                    "Projects": "وثيقة",
                    "Search Products": "البحث عن المنتجات",
                    "View Project": "عرض المشاريع",
                    "Edit Project": "تحرير المشاريع",
                    "English": "الإنجليزية",
                    "Arabic": "عربى",
                    "User Options": "خيارات المستخدم",
                    "Actions": "عمل",
                    "Lock Account": "قفل الحساب",
                    "Messages": "رسائل",
                    "Mark send you a message": "مارك يرسل لك رسالة",
                    "Minutes ago": "منذ 1 دقيقة",
                    "Cregh send you a message": "إنشاء نرسل لك رسالة",
                    "Profile picture updated": "تحديث صورة ملفك الشخصي",
                    "Update dashboard": "تحديث لوحة القيادة",
                    "new messages": "4 رسائل جديدة",
                    "Event today": "حدث اليوم",
                    "Just a reminder that you have an event today": "مجرد تذكير بأن لديك حدث اليوم",
                    "Launch Admin": "تشغيل المسؤول",
                    "New admin wow!": "مشرف جديد واو!",
                    "See all notifications": "اطلع على جميع الإشعارات",
                    "Inbox": "صندوق الوارد",
                    "All rights reserved": "كل الحقوق محفوظة",
                    "Hand-crafted & made with": "مصنوعة يدويا من",
                    "Copyright": "حقوق الطبع والنشر"
                }
            }
        },
        fallbackLng: "vn",
        lng: 'vn', // default language

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;