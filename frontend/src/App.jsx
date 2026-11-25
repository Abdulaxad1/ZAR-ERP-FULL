import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Package,
  ShoppingCart,
  Bell,
  LogOut,
  Globe2,
  Clock3,
  AlertTriangle,
  Crown,
  Gem,
  Wallet,
  RefreshCw,
  Hammer,
  Scale,
  Search,
  Pencil,
  Trash2,
  Plus,
  X,
  ShoppingBag,
  Receipt,
  Contact,
  Banknote,
  Settings,
  FileClock,
  ClipboardList,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const PURITY_OPTIONS = [375, 585, 750, 916, 999];

// Barcha interfeys tarjimalari shu lug'atda saqlanadi.
const I18N = {
  uz: {
    dashboard: "Dashboard",
    companies: "Kompaniyalar",
    plans: "Tariflar",
    myCabinet: "Mening kabinetim",
    products: "Mahsulotlar",
    sales: "Sotuvlar",
    employees: "Xodimlar",
    metal: "Metall ombori",
    workshop: "Ustaxona",
    notifications: "Bildirishnomalar",
    superAdmin: "SUPER ADMIN",
    employee: "XODIM",
    companyAdmin: "KOMPANIYA ADMINI",
    logout: "Chiqish",
    workspace: "Ish maydoni",
    platformEyebrow: "ZARGARLIK BIZNESINI BOSHQARISH PLATFORMASI",
    platformManagement: "Platforma va mijoz kompaniyalarini boshqarish",
    companyCabinet: "Kompaniya kabineti",
    systemActive: "Tizim faol",
    totalCompanies: "Jami kompaniyalar",
    activeSubscriptions: "Faol obunalar",
    expiredSubscriptions: "Muddati tugagan",
    users: "Foydalanuvchilar",
    platformControl: "Platforma nazorati",
    platformControlText:
      "Obuna muddati yaqinlashgan kompaniyalarni “Kompaniyalar” bo‘limidan ko‘ring, xabar yuboring yoki obunani uzaytiring.",
    manageCompanies: "Kompaniyalarni boshqarish",
    subscriptionStatus: "Obuna holati",
    plan: "Tarif",
    expiryDate: "Tugash sanasi",
    planPrice: "Tarif narxi",
    subscriptionAccount: "Obuna va hisobingiz",
    subscriptionText:
      "Obuna tugashidan 7, 3 va 1 kun oldin tizim sizga eslatma yuboradi. To‘lov va uzaytirish uchun platforma administratori bilan bog‘laning.",
    salesHistory: "Sotuvlar tarixi",
    companyEmployees: "Xodimlar",
    allCompanies: "Barcha kompaniyalar",
    warning: "Ogohlantirish",
    extend30: "+30 kun",
    block: "Bloklash",
    activate: "Faollashtirish",
    addPlan: "Tarif qo‘shish",
    planName: "Tarif nomi",
    days: "Kunlar soni",
    price: "Narx",
    preciousMetalBatches: "Qimmatbaho metall partiyalari",
    metalBatchDescription:
      "Har bir partiya bo‘yicha proba, gramm va tannarx nazorati.",
    batchCount: "ta partiya",
    totalBatches: "Jami partiyalar",
    availableMetal: "Mavjud metall",
    goldBatches: "Oltin partiyalari",
    silverBatches: "Kumush partiyalari",
    batchNumber: "Partiya raqami",
    metalType: "Metall turi",
    gold: "Oltin",
    silver: "Kumush",
    platinum: "Platina",
    purity: "Proba",
    grams: "Gramm",
    costPerGram: "1 gramm tannarxi",
    supplier: "Yetkazib beruvchi",
    addBatch: "Partiya qo‘shish",
    workshopOrders: "Ustaxona buyurtmalari",
    workshopDescription:
      "Buyurtma ochilganda metall qoldig‘i avtomatik band qilinadi.",
    orderCount: "ta buyurtma",
    ready: "Tayyor",
    cancel: "Bekor qilish",
    deliverToCustomer: "Mijozga topshirildi",
    itemName: "Buyum nomi",
    customerName: "Mijoz ismi",
    chooseMetalBatch: "Metall partiyasini tanlang",
    requiredGrams: "Kerakli gramm",
    createOrder: "Buyurtma ochish",
    productsWarehouse: "Mahsulotlar ombori",
    productName: "Mahsulot nomi",
    sku: "SKU kodi",
    addProduct: "Mahsulot qo‘shish",
    login: "Tizimga kirish",
    createCompany: "Kompaniya ochish",
    jewelryManagement: "Zargarlik biznesini boshqarish",
    companyName: "Kompaniya nomi",
    exampleCompany: "Masalan: Luxury Gold",
    yourName: "Ismingiz",
    fullName: "Ism familiya",
    phone: "Telefon",
    email: "Email",
    password: "Parol",
    passwordHint: "Kamida 8 ta belgi",
    waiting: "Kutilmoqda...",
    startTrial: "7 kunlik sinovni boshlash",
    signIn: "Kirish",
    haveAccount: "Akkauntingiz bormi? Kirish",
    noCompany: "Kompaniyangiz yo‘qmi? Ro‘yxatdan o‘tish",
    registrationSuccess:
      "Kompaniya yaratildi. Endi email va parol bilan kiring.",
    registrationError: "Ro‘yxatdan o‘tish xatosi",
    sessionExpired: "Sessiya tugadi. Qayta tizimga kiring.",
    permissionProductsRead: "Mahsulotlarni ko‘rish",
    permissionSalesRead: "Sotuvlar tarixini ko‘rish",
    permissionInventoryRead: "Metall omborini ko‘rish",
    permissionWorkshopRead: "Ustaxona buyurtmalarini ko‘rish",
    permissionCustomersRead: "Mijozlarni ko‘rish",
    apiError: "API xatoligi",
    columnName: "Nomi",
    columnEmail: "Email",
    columnStatus: "Holati",
    columnSubscriptionStatus: "Obuna holati",
    columnSubscriptionEnd: "Obuna tugashi",
    columnDuration: "Davomiyligi (kun)",
    columnPrice: "Narxi",
    columnMaxUsers: "Maks. foydalanuvchi",
    columnMaxBranches: "Maks. filial",
    columnActive: "Faol",
    columnInvoice: "Hisob-faktura",
    columnCustomer: "Mijoz",
    columnTotal: "Jami summa",
    columnPayment: "To‘lov turi",
    columnDate: "Sana",
    columnRole: "Lavozim",
    columnBatch: "Partiya raqami",
    columnMetal: "Metall",
    columnGrossGrams: "Umumiy gramm",
    columnAvailableGrams: "Qolgan gramm",
    columnSupplier: "Yetkazib beruvchi",
    columnOrder: "Buyurtma raqami",
    columnItem: "Buyum",
    columnPurity: "Proba",
    columnPlannedGrams: "Rejadagi gramm",
    columnDueDate: "Topshirish sanasi",
    columnStockPieces: "Dona qoldig‘i",
    columnSalePrice: "Sotuv narxi",
    noData: "Ma’lumot mavjud emas",
    yes: "Ha",
    no: "Yo‘q",
    statusActive: "Faol",
    statusSuspended: "Bloklangan",
    statusExpired: "Muddati tugagan",
    statusPending: "Kutilmoqda",
    statusInProgress: "Jarayonda",
    statusReady: "Tayyor",
    statusCancelled: "Bekor qilingan",
    statusDelivered: "Topshirilgan",
    statusTrial: "Sinov muddati",
    statusPaid: "To‘langan",
    statusUnpaid: "To‘lanmagan",
    paymentCash: "Naqd pul",
    paymentCard: "Karta",
    paymentTransfer: "Bank o‘tkazmasi",
    notificationTitle: "Bildirishnomalar",
    subscriptionReminderTitle: "ZAR ERP obuna eslatmasi",
    subscriptionReminderText:
      "Obunangiz muddati yaqinlashmoqda. Xizmat uzilmasligi uchun obunani uzaytiring.",
    actionFailed: "Amalni bajarib bo‘lmadi",
    columnGrossWeight: "Og‘irligi (g)",
    columnCreatedAt: "Yaratilgan sana",
    productManagement: "Mahsulotlar va zaxira boshqaruvi",
    search: "Qidirish",
    searchProducts: "Nomi, SKU yoki shtrix-kod bo‘yicha qidiring",
    filterMetal: "Metall bo‘yicha filter",
    allMetals: "Barcha metallar",
    category: "Kategoriya",
    stoneWeight: "Tosh og‘irligi (g)",
    costPrice: "Tannarx",
    barcode: "Shtrix-kod",
    edit: "Tahrirlash",
    delete: "O‘chirish",
    save: "Saqlash",
    cancelAction: "Bekor qilish",
    editProduct: "Mahsulotni tahrirlash",
    newProduct: "Yangi mahsulot",
    confirmDeleteProduct: "Ushbu mahsulotni o‘chirmoqchimisiz?",
    productAdded: "Mahsulot qo‘shildi",
    productUpdated: "Mahsulot yangilandi",
    totalProducts: "Jami mahsulotlar",
    totalPieces: "Jami dona qoldig‘i",
    lowStock: "Kam qoldiq",
    inventoryValue: "Ombor tannarxi",
    stock: "Qoldiq",
    salePoint: "Kassa va sotuv",
    createSale: "Sotuvni rasmiylashtirish",
    customerOptional: "Mijoz ismi (ixtiyoriy)",
    selectProduct: "Mahsulotni tanlang",
    quantity: "Miqdor (dona)",
    addToCart: "Savatga qo‘shish",
    cart: "Savat",
    subtotal: "Oraliq summa",
    discount: "Chegirma",
    totalPayable: "To‘lanadigan jami",
    paymentMethod: "To‘lov usuli",
    paymentDebt: "Nasiya",
    completeSale: "Sotuvni yakunlash",
    saleCount: "Sotuvlar soni",
    soldPieces: "Sotilgan dona",
    remove: "Olib tashlash",
    saleCompleted: "Sotuv muvaffaqiyatli saqlandi.",
    saleSaved: "Sotuv muvaffaqiyatli yakunlandi. Ombor qoldig‘i yangilandi.",
    emptyCart: "Savat bo‘sh. Avval mahsulot qo‘shing.",
    noProductsForSale: "Sotish uchun mahsulot topilmadi.",
    saleHistory: "Sotuvlar tarixi",
    searchSales: "Hisob-faktura yoki mijoz bo‘yicha qidiring",
    lowStockWarning: "Kam qoldiq",
    noPermission: "Bu amalni bajarish uchun sizda ruxsat yo‘q.",
    markRead: "O‘qilgan deb belgilash",
    unread: "O‘qilmagan",
    read: "O‘qilgan",
    noNotifications: "Hozircha bildirishnomalar yo‘q.",
    editPlan: "Tarifni tahrirlash",
    savePlan: "Tarifni saqlash",
    planCreated: "Tarif yaratildi",
    planUpdated: "Tarif yangilandi",
    maxUsers: "Maksimal foydalanuvchilar",
    maxBranches: "Maksimal filiallar",
    disable: "Faolsizlantirish",
    enable: "Faollashtirish",
    customers: "Mijozlar",
    expenses: "Xarajatlar",
    settings: "Sozlamalar",
    audit: "Amallar tarixi",
    customersSubtitle: "Mijozlar bazasini boshqarish",
    addCustomer: "Mijoz qo‘shish",
    editCustomer: "Mijozni tahrirlash",
    customerPhone: "Telefon raqami",
    customerEmail: "Email manzili",
    customerAddress: "Manzil",
    notes: "Izoh",
    expensesSubtitle: "Kompaniya xarajatlari hisobi",
    addExpense: "Xarajat qo‘shish",
    editExpense: "Xarajatni tahrirlash",
    expenseCategory: "Xarajat turi",
    description: "Tavsif",
    amount: "Summa",
    expenseDate: "Sana",
    saveSettings: "Sozlamalarni saqlash",
    companySettings: "Kompaniya sozlamalari",
    preferredLanguage: "Asosiy til",
    address: "Manzil",
    auditSubtitle: "Foydalanuvchi amallari jurnali",
    action: "Amal",
    entity: "Obyekt",
    entityId: "Obyekt ID",
    details: "Tafsilotlar",
    actor: "Foydalanuvchi ID",
    dashboardProducts: "Mahsulotlar",
    dashboardCustomers: "Mijozlar",
    dashboardSales: "Sotuvlar soni",
    dashboardExpenses: "Xarajatlar soni",
    revenue: "Jami tushum",
    expensesTotal: "Jami xarajat",
    netResult: "Sof natija",
    confirmArchiveCustomer: "Mijozni arxivlashni xohlaysizmi?",
    confirmDeleteExpense: "Xarajatni o‘chirishni xohlaysizmi?",
    employeePermissions: "Xodim ruxsatlari",
    addEmployee: "Xodim qo‘shish",
    editEmployee: "Xodimni tahrirlash",
    employeeName: "Xodim ismi",
    temporaryPassword: "Vaqtinchalik parol",
    deactivate: "Faolsizlantirish",
    permissionProductsCreate: "Mahsulot qo‘shish",
    permissionProductsUpdate: "Mahsulot tahrirlash",
    permissionProductsDelete: "Mahsulot o‘chirish",
    permissionSalesCreate: "Sotuv rasmiylashtirish",
    permissionInventoryCreate: "Metall partiyasi qo‘shish",
    permissionWorkshopCreate: "Ustaxona buyurtmasi ochish",
    permissionWorkshopUpdate: "Ustaxona holatini o‘zgartirish",
    permissionCustomersCreate: "Mijoz qo‘shish",
    permissionCustomersUpdate: "Mijoz tahrirlash",
    permissionCustomersDelete: "Mijoz arxivlash",
  },
  ru: {
    dashboard: "Панель управления",
    companies: "Компании",
    plans: "Тарифы",
    myCabinet: "Мой кабинет",
    products: "Товары",
    sales: "Продажи",
    employees: "Сотрудники",
    metal: "Склад металлов",
    workshop: "Мастерская",
    notifications: "Уведомления",
    superAdmin: "СУПЕР-АДМИН",
    employee: "СОТРУДНИК",
    companyAdmin: "АДМИНИСТРАТОР КОМПАНИИ",
    logout: "Выйти",
    workspace: "Рабочая область",
    platformEyebrow: "ПЛАТФОРМА УПРАВЛЕНИЯ ЮВЕЛИРНЫМ БИЗНЕСОМ",
    platformManagement: "Управление платформой и компаниями-клиентами",
    companyCabinet: "Кабинет компании",
    systemActive: "Система активна",
    totalCompanies: "Всего компаний",
    activeSubscriptions: "Активные подписки",
    expiredSubscriptions: "Срок истёк",
    users: "Пользователи",
    platformControl: "Управление платформой",
    platformControlText:
      "В разделе «Компании» можно проверить подписки с истекающим сроком, отправить уведомление или продлить подписку.",
    manageCompanies: "Управление компаниями",
    subscriptionStatus: "Статус подписки",
    plan: "Тариф",
    expiryDate: "Дата окончания",
    planPrice: "Стоимость тарифа",
    subscriptionAccount: "Подписка и аккаунт",
    subscriptionText:
      "Система отправит напоминание за 7, 3 и 1 день до окончания подписки. Для оплаты и продления свяжитесь с администратором платформы.",
    salesHistory: "История продаж",
    companyEmployees: "Сотрудники",
    allCompanies: "Все компании",
    warning: "Уведомить",
    extend30: "+30 дней",
    block: "Заблокировать",
    activate: "Активировать",
    addPlan: "Добавить тариф",
    planName: "Название тарифа",
    days: "Количество дней",
    price: "Цена",
    preciousMetalBatches: "Партии драгоценных металлов",
    metalBatchDescription:
      "Контроль пробы, веса и себестоимости каждой партии.",
    batchCount: "партий",
    totalBatches: "Всего партий",
    availableMetal: "Доступный металл",
    goldBatches: "Партии золота",
    silverBatches: "Партии серебра",
    batchNumber: "Номер партии",
    metalType: "Тип металла",
    gold: "Золото",
    silver: "Серебро",
    platinum: "Платина",
    purity: "Проба",
    grams: "Граммы",
    costPerGram: "Себестоимость за 1 грамм",
    supplier: "Поставщик",
    addBatch: "Добавить партию",
    workshopOrders: "Заказы мастерской",
    workshopDescription:
      "При создании заказа необходимое количество металла резервируется автоматически.",
    orderCount: "заказов",
    ready: "Готово",
    cancel: "Отменить",
    deliverToCustomer: "Передано клиенту",
    itemName: "Название изделия",
    customerName: "Имя клиента",
    chooseMetalBatch: "Выберите партию металла",
    requiredGrams: "Необходимый вес (г)",
    createOrder: "Создать заказ",
    productsWarehouse: "Склад товаров",
    productName: "Название товара",
    sku: "Артикул SKU",
    addProduct: "Добавить товар",
    login: "Вход в систему",
    createCompany: "Создать компанию",
    jewelryManagement: "Управление ювелирным бизнесом",
    companyName: "Название компании",
    exampleCompany: "Например: Luxury Gold",
    yourName: "Ваше имя",
    fullName: "Имя и фамилия",
    phone: "Телефон",
    email: "Email",
    password: "Пароль",
    passwordHint: "Не менее 8 символов",
    waiting: "Загрузка...",
    startTrial: "Начать 7-дневный пробный период",
    signIn: "Войти",
    haveAccount: "Уже есть аккаунт? Войти",
    noCompany: "Нет компании? Зарегистрироваться",
    registrationSuccess:
      "Компания создана. Теперь войдите, используя email и пароль.",
    registrationError: "Ошибка регистрации",
    sessionExpired: "Сессия истекла. Войдите в систему снова.",
    apiError: "Ошибка API",
    columnName: "Название",
    columnEmail: "Email",
    columnStatus: "Статус",
    columnSubscriptionStatus: "Статус подписки",
    columnSubscriptionEnd: "Окончание подписки",
    columnDuration: "Срок (дней)",
    columnPrice: "Цена",
    columnMaxUsers: "Макс. пользователей",
    columnMaxBranches: "Макс. филиалов",
    columnActive: "Активен",
    columnInvoice: "Счёт-фактура",
    columnCustomer: "Клиент",
    columnTotal: "Общая сумма",
    columnPayment: "Способ оплаты",
    columnDate: "Дата",
    columnRole: "Роль",
    columnBatch: "Номер партии",
    columnMetal: "Металл",
    columnGrossGrams: "Общий вес (г)",
    columnAvailableGrams: "Остаток (г)",
    columnSupplier: "Поставщик",
    columnOrder: "Номер заказа",
    columnItem: "Изделие",
    columnPurity: "Проба",
    columnPlannedGrams: "Плановый вес (г)",
    columnDueDate: "Срок выполнения",
    columnStockPieces: "Остаток (шт.)",
    columnSalePrice: "Цена продажи",
    noData: "Нет данных",
    yes: "Да",
    no: "Нет",
    statusActive: "Активен",
    statusSuspended: "Заблокирован",
    statusExpired: "Срок истёк",
    statusPending: "Ожидает",
    statusInProgress: "В процессе",
    statusReady: "Готово",
    statusCancelled: "Отменён",
    statusDelivered: "Передан",
    statusTrial: "Пробный период",
    statusPaid: "Оплачен",
    statusUnpaid: "Не оплачен",
    paymentCash: "Наличные",
    paymentCard: "Карта",
    paymentTransfer: "Банковский перевод",
    notificationTitle: "Уведомления",
    subscriptionReminderTitle: "Напоминание о подписке ZAR ERP",
    subscriptionReminderText:
      "Срок вашей подписки скоро закончится. Продлите подписку, чтобы избежать перерыва в обслуживании.",
    actionFailed: "Не удалось выполнить действие",
    columnGrossWeight: "Вес (г)",
    columnCreatedAt: "Дата создания",
    productManagement: "Управление товарами и запасами",
    search: "Поиск",
    searchProducts: "Поиск по названию, SKU или штрихкоду",
    filterMetal: "Фильтр по металлу",
    allMetals: "Все металлы",
    category: "Категория",
    stoneWeight: "Вес камня (г)",
    costPrice: "Себестоимость",
    barcode: "Штрихкод",
    edit: "Изменить",
    delete: "Удалить",
    save: "Сохранить",
    cancelAction: "Отмена",
    editProduct: "Редактирование товара",
    newProduct: "Новый товар",
    confirmDeleteProduct: "Вы действительно хотите удалить этот товар?",
    productAdded: "Товар добавлен",
    productUpdated: "Товар обновлён",
    totalProducts: "Всего товаров",
    totalPieces: "Остаток в штуках",
    lowStock: "Малый остаток",
    inventoryValue: "Себестоимость склада",
    stock: "Остаток",
    salePoint: "Касса и продажи",
    createSale: "Оформить продажу",
    customerOptional: "Имя клиента (необязательно)",
    selectProduct: "Выберите товар",
    quantity: "Количество (шт.)",
    addToCart: "В корзину",
    cart: "Корзина",
    subtotal: "Промежуточная сумма",
    discount: "Скидка",
    totalPayable: "Итого к оплате",
    paymentMethod: "Способ оплаты",
    paymentDebt: "В долг",
    completeSale: "Завершить продажу",
    saleCount: "Количество продаж",
    soldPieces: "Продано штук",
    remove: "Убрать",
    saleCompleted: "Продажа успешно сохранена.",
    saleSaved: "Продажа успешно завершена. Остатки на складе обновлены.",
    emptyCart: "Корзина пуста. Сначала добавьте товар.",
    noProductsForSale: "Нет товаров для продажи.",
    saleHistory: "История продаж",
    searchSales: "Поиск по номеру счёта или клиенту",
    lowStockWarning: "Малый остаток",
    noPermission: "У вас нет разрешения на выполнение этого действия.",
    markRead: "Отметить как прочитанное",
    unread: "Не прочитано",
    read: "Прочитано",
    noNotifications: "Пока нет уведомлений.",
    editPlan: "Изменить тариф",
    savePlan: "Сохранить тариф",
    planCreated: "Тариф создан",
    planUpdated: "Тариф обновлён",
    maxUsers: "Максимум пользователей",
    maxBranches: "Максимум филиалов",
    disable: "Отключить",
    enable: "Активировать",
    customers: "Клиенты",
    expenses: "Расходы",
    settings: "Настройки",
    audit: "Журнал действий",
    customersSubtitle: "Управление клиентской базой",
    addCustomer: "Добавить клиента",
    editCustomer: "Изменить клиента",
    customerPhone: "Телефон",
    customerEmail: "Email",
    customerAddress: "Адрес",
    notes: "Заметки",
    expensesSubtitle: "Учёт расходов компании",
    addExpense: "Добавить расход",
    editExpense: "Изменить расход",
    expenseCategory: "Категория расхода",
    description: "Описание",
    amount: "Сумма",
    expenseDate: "Дата",
    saveSettings: "Сохранить настройки",
    companySettings: "Настройки компании",
    preferredLanguage: "Основной язык",
    address: "Адрес",
    auditSubtitle: "Журнал действий пользователей",
    action: "Действие",
    entity: "Объект",
    entityId: "ID объекта",
    details: "Детали",
    actor: "ID пользователя",
    dashboardProducts: "Товары",
    dashboardCustomers: "Клиенты",
    dashboardSales: "Количество продаж",
    dashboardExpenses: "Количество расходов",
    revenue: "Общая выручка",
    expensesTotal: "Общие расходы",
    netResult: "Чистый результат",
    confirmArchiveCustomer: "Архивировать клиента?",
    confirmDeleteExpense: "Удалить расход?",
    employeePermissions: "Права сотрудника",
    addEmployee: "Добавить сотрудника",
    editEmployee: "Изменить сотрудника",
    employeeName: "Имя сотрудника",
    temporaryPassword: "Временный пароль",
    deactivate: "Отключить",
    permissionProductsCreate: "Добавлять товары",
    permissionProductsUpdate: "Изменять товары",
    permissionProductsDelete: "Удалять товары",
    permissionSalesCreate: "Оформлять продажи",
    permissionInventoryCreate: "Добавлять партии металла",
    permissionWorkshopCreate: "Создавать заказы мастерской",
    permissionWorkshopUpdate: "Менять статус заказа",
    permissionCustomersCreate: "Добавлять клиентов",
    permissionCustomersUpdate: "Изменять клиентов",
    permissionCustomersDelete: "Архивировать клиентов",
    permissionProductsRead: "Просмотр товаров",
    permissionSalesRead: "Просмотр истории продаж",
    permissionInventoryRead: "Просмотр склада металлов",
    permissionWorkshopRead: "Просмотр заказов мастерской",
    permissionCustomersRead: "Просмотр клиентов",
  },
};

const COLUMN_KEYS = {
  name: "columnName",
  email: "columnEmail",
  status: "columnStatus",
  subStatus: "columnSubscriptionStatus",
  subscriptionEnd: "columnSubscriptionEnd",
  durationDays: "columnDuration",
  price: "columnPrice",
  maxUsers: "columnMaxUsers",
  maxBranches: "columnMaxBranches",
  isActive: "columnActive",
  invoiceNo: "columnInvoice",
  customerName: "columnCustomer",
  total: "columnTotal",
  paymentMethod: "columnPayment",
  createdAt: "columnCreatedAt",
  role: "columnRole",
  batchNo: "columnBatch",
  metal: "columnMetal",
  purity: "columnPurity",
  grossGrams: "columnGrossGrams",
  availableGrams: "columnAvailableGrams",
  costPerGram: "costPerGram",
  supplier: "columnSupplier",
  orderNo: "columnOrder",
  productName: "columnItem",
  plannedGrams: "columnPlannedGrams",
  dueDate: "columnDueDate",
  stockPieces: "columnStockPieces",
  salePrice: "columnSalePrice",
  grossWeight: "columnGrossWeight",
  phone: "customerPhone",
  address: "customerAddress",
  category: "expenseCategory",
  description: "description",
  amount: "amount",
  incurredAt: "expenseDate",
  action: "action",
  entity: "entity",
  entityId: "entityId",
  details: "details",
  userId: "actor",
  permissions: "employeePermissions",
};

function tr(lang, key) {
  return I18N[lang]?.[key] || I18N.uz[key] || key;
}

function money(value, lang = "uz") {
  const locale = lang === "ru" ? "ru-RU" : "uz-UZ";
  const suffix = lang === "ru" ? "сум" : "so‘m";
  return `${new Intl.NumberFormat(locale).format(Number(value || 0))} ${suffix}`;
}

function displayValue(value, lang) {
  const statusMap = {
    ACTIVE: "statusActive",
    SUSPENDED: "statusSuspended",
    EXPIRED: "statusExpired",
    PENDING: "statusPending",
    IN_PROGRESS: "statusInProgress",
    READY: "statusReady",
    CANCELLED: "statusCancelled",
    DELIVERED: "statusDelivered",
    TRIAL: "statusTrial",
    PAID: "statusPaid",
    UNPAID: "statusUnpaid",
    gold: "gold",
    silver: "silver",
    platinum: "platinum",
    SUPER_ADMIN: "superAdmin",
    COMPANY_ADMIN: "companyAdmin",
    EMPLOYEE: "employee",
    CASH: "paymentCash",
    cash: "paymentCash",
    CARD: "paymentCard",
    card: "paymentCard",
    TRANSFER: "paymentTransfer",
    transfer: "paymentTransfer",
    BANK_TRANSFER: "paymentTransfer",
    debt: "paymentDebt",
  };
  if (typeof value === "boolean")
    return value ? tr(lang, "yes") : tr(lang, "no");
  if (statusMap[value]) return tr(lang, statusMap[value]);
  return String(value ?? "—");
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("zar_token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zar_user") || "null");
    } catch {
      return null;
    }
  });
  const [lang, setLang] = useState(
    () => localStorage.getItem("zar_lang") || "uz",
  );
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const t = (key) => tr(lang, key);

  useEffect(() => {
    localStorage.setItem("zar_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  async function api(path, opts = {}) {
    const headers = {
      ...(opts.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token && path !== "/auth/login"
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(opts.headers || {}),
    };
    const response = await fetch(`${API}${path}`, { ...opts, headers });
    const result = await response.json().catch(() => ({}));

    if (response.status === 401 && path !== "/auth/login") {
      localStorage.removeItem("zar_token");
      localStorage.removeItem("zar_user");
      setToken("");
      setUser(null);
      setData(null);
      throw new Error(result.message || t("sessionExpired"));
    }
    if (!response.ok) {
      throw new Error(
        result.message ||
          result.error ||
          `${t("apiError")} (${response.status})`,
      );
    }
    return result;
  }

  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const f = new FormData(e.currentTarget);
    try {
      const r = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: f.get("email"),
          password: f.get("password"),
        }),
      });
      localStorage.setItem("zar_token", r.token);
      localStorage.setItem("zar_user", JSON.stringify(r.user));
      setToken(r.token);
      setUser(r.user);
      if (r.user?.locale === "uz" || r.user?.locale === "ru")
        setLang(r.user.locale);
    } catch (x) {
      setError(x.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("zar_token");
    localStorage.removeItem("zar_user");
    setToken("");
    setUser(null);
    setData(null);
  }

  useEffect(() => {
    if (!token || !user) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role, page]);

  async function load() {
    try {
      if (user.role === "SUPER_ADMIN") {
        if (page === "dashboard") setData(await api("/super-admin/overview"));
        else if (page === "companies")
          setData(await api("/super-admin/tenants"));
        else if (page === "plans") setData(await api("/super-admin/plans"));
      } else {
        if (page === "dashboard") {
          const [overview, subscription] = await Promise.all([
            api("/overview"),
            api("/subscription"),
          ]);
          setData({ overview, subscription });
        } else if (page === "products") setData(await api("/products"));
        else if (page === "sales") {
          const canReadSales =
            user.role === "COMPANY_ADMIN" ||
            user.permissions?.includes("sales:read");
          setData(canReadSales ? await api("/sales") : []);
        } else if (page === "employees" && user.role === "COMPANY_ADMIN")
          setData(await api("/employees"));
        else if (page === "customers") setData(await api("/customers"));
        else if (page === "expenses" && user.role === "COMPANY_ADMIN")
          setData(await api("/expenses"));
        else if (page === "settings" && user.role === "COMPANY_ADMIN")
          setData(await api("/settings/company"));
        else if (page === "audit" && user.role === "COMPANY_ADMIN")
          setData(await api("/audit-logs"));
        else if (page === "notifications") setData(await api("/notifications"));
        else if (page === "metal") setData(await api("/metal-batches"));
        else if (page === "workshop") setData(await api("/workshop/orders"));
      }
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  if (!token || !user) {
    return (
      <div className="login-wrap">
        <form
          className="login-card"
          onSubmit={async (e) => {
            if (!registerMode) return login(e);
            e.preventDefault();
            setError("");
            setLoading(true);
            const f = new FormData(e.currentTarget);
            try {
              const response = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  companyName: f.get("companyName"),
                  name: f.get("name"),
                  email: f.get("email"),
                  password: f.get("password"),
                  phone: f.get("phone"),
                }),
              });
              const result = await response.json().catch(() => ({}));
              if (!response.ok)
                throw new Error(result.message || t("registrationError"));
              setRegisterMode(false);
              setError(t("registrationSuccess"));
            } catch (x) {
              setError(x.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="logo">
            <Gem /> ZAR<span>ERP</span>
          </div>
          <div className="login-language">
            <button
              type="button"
              onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            >
              <Globe2 size={16} /> {lang.toUpperCase()}
            </button>
          </div>
          <p>{t("jewelryManagement")}</p>
          <h1>{registerMode ? t("createCompany") : t("login")}</h1>
          {registerMode && (
            <>
              <label>
                {t("companyName")}
                <input
                  name="companyName"
                  placeholder={t("exampleCompany")}
                  required
                />
              </label>
              <label>
                {t("yourName")}
                <input name="name" placeholder={t("fullName")} required />
              </label>
              <label>
                {t("phone")}
                <input name="phone" placeholder="+998 90 000 00 00" />
              </label>
            </>
          )}
          <label>
            {t("email")}
            <input
              name="email"
              type="email"
              placeholder="admin@company.uz"
              required
            />
          </label>
          <label>
            {t("password")}
            <input
              name="password"
              type="password"
              placeholder={t("passwordHint")}
              minLength="8"
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="gold-btn" disabled={loading}>
            {loading
              ? t("waiting")
              : registerMode
                ? t("startTrial")
                : t("signIn")}
          </button>
          <button
            type="button"
            className="switch-auth"
            onClick={() => {
              setRegisterMode(!registerMode);
              setError("");
            }}
          >
            {registerMode ? t("haveAccount") : t("noCompany")}
          </button>
        </form>
      </div>
    );
  }

  const superAdmin = user.role === "SUPER_ADMIN";
  const employee = user.role === "EMPLOYEE";
  const menus = superAdmin
    ? [
        ["dashboard", t("dashboard"), LayoutDashboard],
        ["companies", t("companies"), Building2],
        ["plans", t("plans"), Wallet],
      ]
    : employee
      ? [
          ["dashboard", t("myCabinet"), LayoutDashboard],
          ...(user.permissions?.includes("products:read") ||
          user.permissions?.includes("sales:create")
            ? [["products", t("products"), Package]]
            : []),
          ...(user.permissions?.includes("sales:read") ||
          user.permissions?.includes("sales:create")
            ? [["sales", t("sales"), ShoppingCart]]
            : []),
          ...([
            "customers:read",
            "customers:create",
            "customers:update",
            "customers:delete",
          ].some((p) => user.permissions?.includes(p))
            ? [["customers", t("customers"), Contact]]
            : []),
          ...(user.permissions?.includes("inventory:read") ||
          user.permissions?.includes("inventory:create")
            ? [["metal", t("metal"), Scale]]
            : []),
          ...(["workshop:read", "workshop:create", "workshop:update"].some(
            (p) => user.permissions?.includes(p),
          )
            ? [["workshop", t("workshop"), Hammer]]
            : []),
          ["notifications", t("notifications"), Bell],
        ]
      : [
          ["dashboard", t("dashboard"), LayoutDashboard],
          ["products", t("products"), Package],
          ["sales", t("sales"), ShoppingCart],
          ["customers", t("customers"), Contact],
          ["employees", t("employees"), Users],
          ["expenses", t("expenses"), Banknote],
          ["metal", t("metal"), Scale],
          ["workshop", t("workshop"), Hammer],
          ["notifications", t("notifications"), Bell],
          ["audit", t("audit"), FileClock],
          ["settings", t("settings"), Settings],
        ];

  return (
    <div className="shell">
      <aside className="side">
        <div className="logo">
          <Gem /> ZAR<span>ERP</span>
        </div>
        <div className="role-chip">
          {superAdmin ? <Crown size={15} /> : <Building2 size={15} />}{" "}
          {superAdmin
            ? t("superAdmin")
            : employee
              ? t("employee")
              : t("companyAdmin")}
        </div>
        <nav>
          {menus.map(([id, label, Icon]) => (
            <button
              className={page === id ? "selected" : ""}
              onClick={() => setPage(id)}
              key={id}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="userbox">
            <div className="avatar">{user.name?.slice(0, 1) || "A"}</div>
            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </div>
          </div>
          <button className="logout" onClick={logout}>
            <LogOut size={16} /> {t("logout")}
          </button>
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <small>{t("workspace")} /</small>
            <b>{menus.find((x) => x[0] === page)?.[1]}</b>
          </div>
          <div className="head-right">
            <button
              onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
              title={lang === "uz" ? "Русский язык" : "O‘zbek tili"}
            >
              <Globe2 size={16} /> {lang.toUpperCase()}
            </button>
            <button
              onClick={load}
              title={lang === "uz" ? "Yangilash" : "Обновить"}
            >
              <RefreshCw size={16} />
            </button>
            <span className="avatar">{user.name?.slice(0, 1) || "A"}</span>
          </div>
        </header>

        <section className="body">
          <div className="heading">
            <div>
              <span className="eyebrow">{t("platformEyebrow")}</span>
              <h1>{menus.find((x) => x[0] === page)?.[1]}</h1>
              <p>
                {superAdmin
                  ? t("platformManagement")
                  : user.tenant || t("companyCabinet")}
              </p>
            </div>
            <span className="live">● {t("systemActive")}</span>
          </div>
          {error && <div className="error banner">{error}</div>}

          {superAdmin && page === "dashboard" && (
            <>
              <div className="stats">
                <Stat
                  title={t("totalCompanies")}
                  value={data?.tenants ?? "—"}
                  icon={Building2}
                />
                <Stat
                  title={t("activeSubscriptions")}
                  value={data?.active ?? "—"}
                  icon={ShieldCheck}
                />
                <Stat
                  title={t("expiredSubscriptions")}
                  value={data?.expired ?? "—"}
                  icon={AlertTriangle}
                />
                <Stat
                  title={t("users")}
                  value={data?.users ?? "—"}
                  icon={Users}
                />
              </div>
              <div className="panel">
                <h3>{t("platformControl")}</h3>
                <p>{t("platformControlText")}</p>
                <button
                  className="gold-btn"
                  onClick={() => setPage("companies")}
                >
                  {t("manageCompanies")}
                </button>
              </div>
            </>
          )}
          {superAdmin && page === "companies" && (
            <Companies
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
            />
          )}
          {superAdmin && page === "plans" && (
            <Plans
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
            />
          )}

          {!superAdmin && page === "dashboard" && (
            <>
              <div className="stats">
                <Stat
                  title={t("dashboardProducts")}
                  value={data?.overview?.products ?? "—"}
                  icon={Package}
                />
                <Stat
                  title={t("dashboardCustomers")}
                  value={data?.overview?.customers ?? "—"}
                  icon={Contact}
                />
                <Stat
                  title={t("dashboardSales")}
                  value={data?.overview?.sales ?? "—"}
                  icon={ShoppingCart}
                />
                <Stat
                  title={t("lowStock")}
                  value={data?.overview?.lowStock ?? "—"}
                  icon={AlertTriangle}
                />
              </div>
              {!employee && (
                <div className="stats">
                  <Stat
                    title={t("revenue")}
                    value={money(data?.overview?.salesTotal, lang)}
                    icon={Wallet}
                  />
                  <Stat
                    title={t("expensesTotal")}
                    value={money(data?.overview?.expensesTotal, lang)}
                    icon={Banknote}
                  />
                  <Stat
                    title={t("netResult")}
                    value={money(data?.overview?.net, lang)}
                    icon={Receipt}
                  />
                  <Stat
                    title={t("subscriptionStatus")}
                    value={displayValue(data?.subscription?.status, lang)}
                    icon={ShieldCheck}
                  />
                </div>
              )}
              <div className="panel">
                <h3>{t("subscriptionAccount")}</h3>
                <p>{t("subscriptionText")}</p>
                <div className="erp-subscription-line">
                  <span>
                    {t("plan")}: <b>{data?.subscription?.Plan?.name || "—"}</b>
                  </span>
                  <span>
                    {t("expiryDate")}:{" "}
                    <b>
                      {data?.subscription?.endsAt
                        ? new Date(data.subscription.endsAt).toLocaleDateString(
                            lang === "ru" ? "ru-RU" : "uz-UZ",
                          )
                        : "—"}
                    </b>
                  </span>
                </div>
              </div>
            </>
          )}
          {!superAdmin && page === "products" && (
            <Products
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
              user={user}
            />
          )}
          {!superAdmin && page === "sales" && (
            <Sales
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
              user={user}
            />
          )}
          {!superAdmin && page === "employees" && (
            <Employees
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
            />
          )}
          {!superAdmin && page === "customers" && (
            <Customers
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
              user={user}
            />
          )}
          {!superAdmin && page === "expenses" && (
            <Expenses
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
            />
          )}
          {!superAdmin && page === "settings" && (
            <CompanySettings
              company={data || {}}
              api={api}
              reload={load}
              lang={lang}
              setLang={setLang}
            />
          )}
          {!superAdmin && page === "audit" && (
            <AuditLogs rows={Array.isArray(data) ? data : []} lang={lang} />
          )}
          {!superAdmin && (page === "metal" || page === "workshop") && (
            <Workshop
              page={page}
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
              user={user}
            />
          )}
          {!superAdmin && page === "notifications" && (
            <Notifications
              rows={Array.isArray(data) ? data : []}
              api={api}
              reload={load}
              lang={lang}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ title, value, icon: Icon }) {
  return (
    <div className="stat">
      <div>
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
      <span>
        <Icon size={19} />
      </span>
    </div>
  );
}

function Rows({ rows, cols, lang = "uz" }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>{tr(lang, COLUMN_KEYS[c] || c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}>
              {cols.map((c) => {
                let value = r[c];
                if (
                  c === "total" ||
                  c === "price" ||
                  c === "salePrice" ||
                  c === "costPerGram"
                )
                  value = money(value, lang);
                else if (
                  c === "createdAt" ||
                  c === "dueDate" ||
                  c === "subscriptionEnd"
                )
                  value =
                    value && value !== "—"
                      ? new Date(value).toLocaleDateString(
                          lang === "ru" ? "ru-RU" : "uz-UZ",
                        )
                      : "—";
                else value = displayValue(value, lang);
                return <td key={c}>{value}</td>;
              })}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={cols.length}>{tr(lang, "noData")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Companies({ rows, api, reload, lang }) {
  const t = (key) => tr(lang, key);
  const [busy, setBusy] = useState("");
  async function action(id, kind) {
    setBusy(id + kind);
    try {
      if (kind === "extend")
        await api(`/super-admin/tenants/${id}/extend`, {
          method: "POST",
          body: JSON.stringify({ days: 30 }),
        });
      if (kind === "notify")
        await api(`/super-admin/tenants/${id}/notify`, {
          method: "POST",
          body: JSON.stringify({
            title: t("subscriptionReminderTitle"),
            message: t("subscriptionReminderText"),
          }),
        });
      if (kind === "block")
        await api(`/super-admin/tenants/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "SUSPENDED" }),
        });
      if (kind === "activate")
        await api(`/super-admin/tenants/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ACTIVE" }),
        });
      await reload();
    } catch (e) {
      alert(e.message || t("actionFailed"));
    } finally {
      setBusy("");
    }
  }
  return (
    <div className="panel">
      <h3>{t("allCompanies")}</h3>
      <Rows
        rows={rows.map((company) => {
          const latest = [...(company.Subscriptions || [])].sort(
            (a, b) => new Date(b.endsAt) - new Date(a.endsAt),
          )[0];
          return {
            ...company,
            subscriptionEnd: latest?.endsAt || "—",
            subStatus: latest?.status || company.status,
          };
        })}
        cols={["name", "email", "status", "subStatus", "subscriptionEnd"]}
        lang={lang}
      />
      {rows.map((company) => (
        <div className="company-actions" key={company.id}>
          <b>{company.name}</b>
          <div>
            <button
              onClick={() => action(company.id, "notify")}
              disabled={!!busy}
            >
              {t("warning")}
            </button>
            <button
              onClick={() => action(company.id, "extend")}
              disabled={!!busy}
            >
              {t("extend30")}
            </button>
            {company.status === "ACTIVE" ? (
              <button
                className="danger"
                onClick={() => action(company.id, "block")}
                disabled={!!busy}
              >
                {t("block")}
              </button>
            ) : (
              <button
                onClick={() => action(company.id, "activate")}
                disabled={!!busy}
              >
                {t("activate")}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Plans({ rows, api, reload, lang }) {
  const t = (key) => tr(lang, key);
  const blank = () => ({
    name: "",
    durationDays: 30,
    price: 299000,
    maxUsers: 5,
    maxBranches: 1,
    isActive: true,
  });
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function beginEdit(plan) {
    setEditing(plan);
    setForm({
      name: plan.name || "",
      durationDays: plan.durationDays ?? 30,
      price: plan.price ?? 0,
      maxUsers: plan.maxUsers ?? 5,
      maxBranches: plan.maxBranches ?? 1,
      isActive: Boolean(plan.isActive),
    });
    setError("");
  }

  function reset() {
    setEditing(null);
    setForm(blank());
    setError("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      currency: "UZS",
      maxUsers: Number(form.maxUsers),
      maxBranches: Number(form.maxBranches),
      isActive: Boolean(form.isActive),
    };
    if (
      !payload.name ||
      !Number.isInteger(payload.durationDays) ||
      payload.durationDays < 1 ||
      payload.price < 0 ||
      !Number.isInteger(payload.maxUsers) ||
      payload.maxUsers < 1 ||
      !Number.isInteger(payload.maxBranches) ||
      payload.maxBranches < 1
    ) {
      setError(t("actionFailed"));
      setSaving(false);
      return;
    }
    try {
      if (editing) {
        await api(`/super-admin/plans/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/super-admin/plans", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      reset();
      await reload();
    } catch (e) {
      setError(e.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(plan) {
    try {
      await api(`/super-admin/plans/${plan.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      await reload();
    } catch (e) {
      setError(e.message || t("actionFailed"));
    }
  }

  return (
    <div className="erp-page-stack">
      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{t("plans")}</h3>
            <p>
              {rows.length} · {t("plans")}
            </p>
          </div>
        </div>
        {error && <div className="error banner">{error}</div>}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "columnName",
                  "columnDuration",
                  "columnPrice",
                  "columnMaxUsers",
                  "columnMaxBranches",
                  "columnActive",
                ].map((key) => (
                  <th key={key}>{t(key)}</th>
                ))}
                <th>{t("edit")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <b>{plan.name}</b>
                  </td>
                  <td>{plan.durationDays}</td>
                  <td>{money(plan.price, lang)}</td>
                  <td>{plan.maxUsers}</td>
                  <td>{plan.maxBranches}</td>
                  <td>{displayValue(Boolean(plan.isActive), lang)}</td>
                  <td>
                    <div className="erp-row-actions">
                      <button
                        type="button"
                        onClick={() => beginEdit(plan)}
                        title={t("edit")}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(plan)}
                        title={plan.isActive ? t("disable") : t("enable")}
                      >
                        {plan.isActive ? t("disable") : t("enable")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="7">{t("noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{editing ? t("editPlan") : t("addPlan")}</h3>
          </div>
        </div>
        <form className="erp-form-grid" onSubmit={save}>
          <label>
            {t("planName")}
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              maxLength="80"
            />
          </label>
          <label>
            {t("days")}
            <input
              name="durationDays"
              type="number"
              min="1"
              step="1"
              value={form.durationDays}
              onChange={updateField}
              required
            />
          </label>
          <label>
            {t("price")}
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={updateField}
              required
            />
          </label>
          <label>
            {t("maxUsers")}
            <input
              name="maxUsers"
              type="number"
              min="1"
              step="1"
              value={form.maxUsers}
              onChange={updateField}
              required
            />
          </label>
          <label>
            {t("maxBranches")}
            <input
              name="maxBranches"
              type="number"
              min="1"
              step="1"
              value={form.maxBranches}
              onChange={updateField}
              required
            />
          </label>
          <label className="erp-checkbox-label">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={updateField}
            />{" "}
            {t("columnActive")}
          </label>
          <div className="erp-form-actions">
            <button className="gold-btn" disabled={saving}>
              {saving ? t("waiting") : editing ? t("savePlan") : t("addPlan")}
            </button>
            {editing && (
              <button
                type="button"
                className="erp-quiet-button"
                onClick={reset}
              >
                {t("cancelAction")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Notifications({ rows, api, reload, lang }) {
  const t = (key) => tr(lang, key);
  const [busyId, setBusyId] = useState("");
  const unreadCount = rows.filter((item) => !item.isRead).length;

  async function markRead(notification) {
    if (notification.isRead) return;
    setBusyId(notification.id);
    try {
      await api(`/notifications/${notification.id}/read`, { method: "PATCH" });
      await reload();
    } catch (error) {
      alert(error.message || t("actionFailed"));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="panel">
      <div className="erp-section-heading">
        <div>
          <h3>{t("notificationTitle")}</h3>
          <p>
            {unreadCount} · {t("unread")}
          </p>
        </div>
        <span className="live">{rows.length}</span>
      </div>
      {!rows.length && <p>{t("noNotifications")}</p>}
      {rows.map((notification) => (
        <article
          className={`erp-notification ${notification.isRead ? "is-read" : "is-unread"}`}
          key={notification.id}
        >
          <div className="erp-notification-content">
            <div className="erp-notification-title">
              <b>{notification.title}</b>
              <span>{notification.isRead ? t("read") : t("unread")}</span>
            </div>
            <p>{notification.message}</p>
            <small>
              {new Date(notification.createdAt).toLocaleString(
                lang === "ru" ? "ru-RU" : "uz-UZ",
              )}
            </small>
          </div>
          {!notification.isRead && (
            <button
              type="button"
              className="erp-quiet-button"
              onClick={() => markRead(notification)}
              disabled={busyId === notification.id}
            >
              {busyId === notification.id ? t("waiting") : t("markRead")}
            </button>
          )}
        </article>
      ))}
    </div>
  );
}

function Workshop({ page, rows, api, reload, lang, user }) {
  const t = (key) => tr(lang, key);
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const canAddBatch =
    isAdmin || user?.permissions?.includes("inventory:create");
  const canAddOrder = isAdmin || user?.permissions?.includes("workshop:create");
  const canUpdateOrder =
    isAdmin || user?.permissions?.includes("workshop:update");
  const [batches, setBatches] = useState([]);
  const [batchNo, setBatchNo] = useState("");
  const [metal, setMetal] = useState("gold");
  const [purity, setPurity] = useState(585);
  const [grams, setGrams] = useState(10);
  const [cost, setCost] = useState(0);
  const [supplier, setSupplier] = useState("");
  const [productName, setProductName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [plannedGrams, setPlannedGrams] = useState(1);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    api("/metal-batches")
      .then((result) => setBatches(Array.isArray(result) ? result : []))
      .catch((e) => alert(e.message));
  }, [page]);

  async function addBatch(e) {
    e.preventDefault();
    try {
      await api("/metal-batches", {
        method: "POST",
        body: JSON.stringify({
          batchNo,
          metal,
          purity: Number(purity),
          grossGrams: Number(grams),
          costPerGram: Number(cost),
          supplier,
        }),
      });
      setBatchNo("");
      await reload();
      const result = await api("/metal-batches");
      setBatches(Array.isArray(result) ? result : []);
    } catch (e) {
      alert(e.message);
    }
  }

  async function addOrder(e) {
    e.preventDefault();
    try {
      await api("/workshop/orders", {
        method: "POST",
        body: JSON.stringify({
          metalBatchId: batchId,
          productName,
          customerName,
          plannedGrams: Number(plannedGrams),
          dueDate,
        }),
      });
      setProductName("");
      setCustomerName("");
      await reload();
      const result = await api("/metal-batches");
      setBatches(Array.isArray(result) ? result : []);
    } catch (e) {
      alert(e.message);
    }
  }

  async function changeStatus(id, next) {
    try {
      await api(`/workshop/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      await reload();
    } catch (e) {
      alert(e.message);
    }
  }

  if (page === "metal") {
    return (
      <div className="panel">
        <div className="panel-title">
          <div>
            <h3>{t("preciousMetalBatches")}</h3>
            <p>{t("metalBatchDescription")}</p>
          </div>
          <span className="live">
            {rows.length} {t("batchCount")}
          </span>
        </div>
        <div className="stats">
          <Stat title={t("totalBatches")} value={rows.length} icon={Package} />
          <Stat
            title={t("availableMetal")}
            value={
              rows
                .reduce(
                  (sum, item) => sum + Number(item.availableGrams || 0),
                  0,
                )
                .toFixed(3) + " g"
            }
            icon={Scale}
          />
          <Stat
            title={t("goldBatches")}
            value={rows.filter((item) => item.metal === "gold").length}
            icon={Gem}
          />
          <Stat
            title={t("silverBatches")}
            value={rows.filter((item) => item.metal === "silver").length}
            icon={Package}
          />
        </div>
        <Rows
          rows={rows}
          cols={[
            "batchNo",
            "metal",
            "purity",
            "grossGrams",
            "availableGrams",
            "costPerGram",
            "supplier",
          ]}
          lang={lang}
        />
        {canAddBatch && (
          <form className="inline-form" onSubmit={addBatch}>
            <input
              placeholder={t("batchNumber")}
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
              required
            />
            <select value={metal} onChange={(e) => setMetal(e.target.value)}>
              <option value="gold">{t("gold")}</option>
              <option value="silver">{t("silver")}</option>
              <option value="platinum">{t("platinum")}</option>
            </select>
            <select
              aria-label={t("purity")}
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              required
            >
              {PURITY_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.001"
              placeholder={t("grams")}
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder={t("costPerGram")}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <input
              placeholder={t("supplier")}
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
            <button className="gold-btn">{t("addBatch")}</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-title">
        <div>
          <h3>{t("workshopOrders")}</h3>
          <p>{t("workshopDescription")}</p>
        </div>
        <span className="live">
          {rows.length} {t("orderCount")}
        </span>
      </div>
      <Rows
        rows={rows}
        cols={[
          "orderNo",
          "productName",
          "customerName",
          "metal",
          "purity",
          "plannedGrams",
          "status",
          "dueDate",
        ]}
        lang={lang}
      />
      {rows.map((order) => (
        <div className="company-actions" key={order.id}>
          <div>
            <b>
              {order.orderNo} · {order.productName}
            </b>
            <small className="muted">
              {" "}
              {order.plannedGrams} g · {displayValue(order.status, lang)}
            </small>
          </div>
          <div>
            {canUpdateOrder && order.status === "IN_PROGRESS" && (
              <>
                <button onClick={() => changeStatus(order.id, "READY")}>
                  {t("ready")}
                </button>
                <button
                  className="danger"
                  onClick={() => changeStatus(order.id, "CANCELLED")}
                >
                  {t("cancel")}
                </button>
              </>
            )}
            {canUpdateOrder && order.status === "READY" && (
              <button onClick={() => changeStatus(order.id, "DELIVERED")}>
                {t("deliverToCustomer")}
              </button>
            )}
          </div>
        </div>
      ))}
      {canAddOrder && (
        <form className="inline-form" onSubmit={addOrder}>
          <input
            placeholder={t("itemName")}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <input
            placeholder={t("customerName")}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          >
            <option value="">{t("chooseMetalBatch")}</option>
            {batches.map((batch) => (
              <option value={batch.id} key={batch.id}>
                {batch.batchNo} · {displayValue(batch.metal, lang)}{" "}
                {batch.purity} · {batch.availableGrams} g
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.001"
            min="0.001"
            placeholder={t("requiredGrams")}
            value={plannedGrams}
            onChange={(e) => setPlannedGrams(e.target.value)}
            required
          />
          <input
            type="date"
            aria-label={t("columnDueDate")}
            title={t("columnDueDate")}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button className="gold-btn">{t("createOrder")}</button>
        </form>
      )}
    </div>
  );
}

function Products({ rows, api, reload, lang, user }) {
  const t = (key) => tr(lang, key);
  const emptyForm = () => ({
    name: "",
    sku: "",
    category: "Jewelry",
    metal: "gold",
    purity: 585,
    grossWeight: 0,
    stoneWeight: 0,
    stockPieces: 0,
    costPrice: 0,
    salePrice: 0,
    barcode: "",
  });
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [metalFilter, setMetalFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const canCreate =
    isCompanyAdmin || user?.permissions?.includes("products:create");
  const canUpdate =
    isCompanyAdmin || user?.permissions?.includes("products:update");
  const canDelete =
    isCompanyAdmin || user?.permissions?.includes("products:delete");

  const totalPieces = rows.reduce(
    (sum, product) => sum + Number(product.stockPieces || 0),
    0,
  );
  const lowStockCount = rows.filter(
    (product) => Number(product.stockPieces || 0) <= 2,
  ).length;
  const inventoryCost = rows.reduce(
    (sum, product) =>
      sum + Number(product.stockPieces || 0) * Number(product.costPrice || 0),
    0,
  );
  const filtered = rows.filter((product) => {
    const text =
      `${product.name || ""} ${product.sku || ""} ${product.barcode || ""}`.toLowerCase();
    return (
      text.includes(query.toLowerCase()) &&
      (metalFilter === "all" || product.metal === metalFilter)
    );
  });

  function changeField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function startEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "Jewelry",
      metal: product.metal || "gold",
      purity: product.purity ?? 585,
      grossWeight: product.grossWeight ?? 0,
      stoneWeight: product.stoneWeight ?? 0,
      stockPieces: product.stockPieces ?? 0,
      costPrice: product.costPrice ?? 0,
      salePrice: product.salePrice ?? 0,
      barcode: product.barcode || "",
    });
    setLocalError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm());
    setLocalError("");
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setLocalError("");
    setLocalSuccess("");
    const payload = {
      ...form,
      purity: Number(form.purity),
      grossWeight: Number(form.grossWeight),
      stoneWeight: Number(form.stoneWeight),
      stockPieces: Number(form.stockPieces),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
    };
    try {
      const wasEditing = Boolean(editing);
      if (editing) {
        await api(`/products/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      setLocalSuccess(t(wasEditing ? "productUpdated" : "productAdded"));
      await reload();
    } catch (error) {
      setLocalError(error.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    if (
      !window.confirm(
        `${t("confirmDeleteProduct")}\n${product.name} (${product.sku})`,
      )
    )
      return;
    setLocalError("");
    try {
      await api(`/products/${product.id}`, { method: "DELETE" });
      if (editing?.id === product.id) resetForm();
      await reload();
    } catch (error) {
      setLocalError(error.message || t("actionFailed"));
    }
  }

  return (
    <div className="erp-page-stack">
      <div className="stats">
        <Stat title={t("totalProducts")} value={rows.length} icon={Package} />
        <Stat title={t("totalPieces")} value={totalPieces} icon={BoxesIcon} />
        <Stat
          title={t("lowStock")}
          value={lowStockCount}
          icon={AlertTriangle}
        />
        <Stat
          title={t("inventoryValue")}
          value={money(inventoryCost, lang)}
          icon={Wallet}
        />
      </div>

      {(canCreate || (editing && canUpdate)) && (
        <div className="panel">
          <div className="erp-section-heading">
            <div>
              <h3>{editing ? t("editProduct") : t("newProduct")}</h3>
              <p>{t("productManagement")}</p>
            </div>
            {editing && (
              <button
                type="button"
                className="erp-quiet-button"
                onClick={resetForm}
              >
                <X size={15} /> {t("cancelAction")}
              </button>
            )}
          </div>

          {localError && <div className="error banner">{localError}</div>}
          {localSuccess && <div className="success banner">{localSuccess}</div>}

          <form className="erp-form-grid" onSubmit={saveProduct}>
            <label>
              {t("productName")}
              <input
                name="name"
                value={form.name}
                onChange={changeField}
                required
                maxLength="160"
              />
            </label>
            <label>
              {t("sku")}
              <input
                name="sku"
                value={form.sku}
                onChange={changeField}
                required
                maxLength="60"
              />
            </label>
            <label>
              {t("category")}
              <input
                name="category"
                value={form.category}
                onChange={changeField}
                required
                maxLength="60"
              />
            </label>
            <label>
              {t("metal")}
              <select name="metal" value={form.metal} onChange={changeField}>
                <option value="gold">{t("gold")}</option>
                <option value="silver">{t("silver")}</option>
                <option value="platinum">{t("platinum")}</option>
              </select>
            </label>
            <label>
              {t("purity")}
              <select
                name="purity"
                value={form.purity}
                onChange={changeField}
                required
              >
                {PURITY_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("columnGrossWeight")}
              <input
                name="grossWeight"
                type="number"
                min="0"
                step="0.001"
                value={form.grossWeight}
                onChange={changeField}
              />
            </label>
            <label>
              {t("stoneWeight")}
              <input
                name="stoneWeight"
                type="number"
                min="0"
                step="0.001"
                value={form.stoneWeight}
                onChange={changeField}
              />
            </label>
            <label>
              {t("columnStockPieces")}
              <input
                name="stockPieces"
                type="number"
                min="0"
                step="1"
                value={form.stockPieces}
                onChange={changeField}
              />
            </label>
            <label>
              {t("costPrice")}
              <input
                name="costPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.costPrice}
                onChange={changeField}
              />
            </label>
            <label>
              {t("price")}
              <input
                name="salePrice"
                type="number"
                min="0"
                step="0.01"
                value={form.salePrice}
                onChange={changeField}
              />
            </label>
            <label>
              {t("barcode")}
              <input
                name="barcode"
                value={form.barcode}
                onChange={changeField}
                maxLength="100"
              />
            </label>
            <div className="erp-form-actions">
              <button className="gold-btn" disabled={saving}>
                <Plus size={15} /> {saving ? t("waiting") : t("save")}
              </button>
              {editing && (
                <button
                  type="button"
                  className="erp-quiet-button"
                  onClick={resetForm}
                >
                  {t("cancelAction")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{t("productsWarehouse")}</h3>
            <p>
              {filtered.length} / {rows.length}
            </p>
          </div>
          <div className="erp-filter-bar">
            <div className="erp-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchProducts")}
              />
            </div>
            <select
              value={metalFilter}
              onChange={(e) => setMetalFilter(e.target.value)}
              aria-label={t("filterMetal")}
            >
              <option value="all">{t("allMetals")}</option>
              <option value="gold">{t("gold")}</option>
              <option value="silver">{t("silver")}</option>
              <option value="platinum">{t("platinum")}</option>
            </select>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("productName")}</th>
                <th>{t("sku")}</th>
                <th>{t("metal")}</th>
                <th>{t("purity")}</th>
                <th>{t("columnGrossWeight")}</th>
                <th>{t("columnStockPieces")}</th>
                <th>{t("costPrice")}</th>
                <th>{t("price")}</th>
                <th>{t("edit")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <b>{product.name}</b>
                    {product.barcode && (
                      <small className="muted">{product.barcode}</small>
                    )}
                  </td>
                  <td>{product.sku}</td>
                  <td>{displayValue(product.metal, lang)}</td>
                  <td>{product.purity}</td>
                  <td>{Number(product.grossWeight || 0).toFixed(3)} g</td>
                  <td>
                    <span
                      className={
                        Number(product.stockPieces || 0) <= 2
                          ? "stock-warning"
                          : "stock-ok"
                      }
                    >
                      {product.stockPieces ?? 0}
                    </span>
                  </td>
                  <td>{money(product.costPrice, lang)}</td>
                  <td>{money(product.salePrice, lang)}</td>
                  <td>
                    <div className="erp-row-actions">
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          title={t("edit")}
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="danger"
                          onClick={() => deleteProduct(product)}
                          title={t("delete")}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      {!canUpdate && !canDelete && <span>—</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="9">{t("noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Sales({ rows, api, reload, lang, user }) {
  const t = (key) => tr(lang, key);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const canCreateSale =
    user?.role === "COMPANY_ADMIN" ||
    user?.permissions?.includes("sales:create");
  const canReadSales =
    user?.role === "COMPANY_ADMIN" || user?.permissions?.includes("sales:read");

  async function loadProducts() {
    try {
      const result = await api("/products");
      setProducts(Array.isArray(result) ? result : []);
    } catch (error) {
      setLocalError(error.message || t("actionFailed"));
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const selectedProduct = products.find((product) => product.id === productId);
  const cartPieces = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const safeDiscount = Math.max(0, Math.min(Number(discount || 0), subtotal));
  const total = Math.max(0, subtotal - safeDiscount);
  const filteredSales = rows.filter((sale) =>
    `${sale.invoiceNo || ""} ${sale.customerName || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  function addToCart() {
    setLocalError("");
    if (!selectedProduct) return setLocalError(t("selectProduct"));
    const qty = Number(quantity);
    const price = Number(unitPrice);
    if (
      !Number.isInteger(qty) ||
      qty < 1 ||
      !Number.isFinite(price) ||
      price < 0
    )
      return setLocalError(t("actionFailed"));
    const alreadyInCart =
      cart.find((item) => item.productId === productId)?.quantity || 0;
    if (alreadyInCart + qty > Number(selectedProduct.stockPieces || 0)) {
      return setLocalError(
        `${t("stock")}: ${selectedProduct.stockPieces || 0}`,
      );
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing)
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + qty, unitPrice: price }
            : item,
        );
      return [
        ...current,
        {
          productId,
          name: selectedProduct.name,
          sku: selectedProduct.sku,
          quantity: qty,
          unitPrice: price,
          stockPieces: Number(selectedProduct.stockPieces || 0),
        },
      ];
    });
    setQuantity(1);
  }

  function updateCartQuantity(id, nextValue) {
    const next = Number(nextValue);
    const product = products.find((item) => item.id === id);
    if (!Number.isInteger(next) || next < 1) return;
    if (product && next > Number(product.stockPieces || 0)) {
      setLocalError(`${t("stock")}: ${product.stockPieces || 0}`);
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.productId === id ? { ...item, quantity: next } : item,
      ),
    );
    setLocalError("");
  }

  async function checkout(event) {
    event.preventDefault();
    setLocalError("");
    setLocalSuccess("");
    if (!cart.length) return setLocalError(t("emptyCart"));
    if (Number(discount) > subtotal) return setLocalError(t("actionFailed"));
    setSaving(true);
    try {
      await api("/sales", {
        method: "POST",
        body: JSON.stringify({
          customerName: customerName.trim() || null,
          discount: safeDiscount,
          paymentMethod,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });
      setCart([]);
      setCustomerName("");
      setDiscount(0);
      setPaymentMethod("cash");
      setProductId("");
      setUnitPrice(0);
      setLocalSuccess(t("saleSaved"));
      await Promise.all([reload(), loadProducts()]);
    } catch (error) {
      setLocalError(error.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="erp-page-stack">
      <div className="stats">
        {canReadSales && (
          <>
            <Stat title={t("saleCount")} value={rows.length} icon={Receipt} />
            <Stat
              title={t("soldPieces")}
              value={rows.reduce(
                (sum, sale) =>
                  sum +
                  (sale.items || []).reduce(
                    (n, item) => n + Number(item.quantity || 0),
                    0,
                  ),
                0,
              )}
              icon={ShoppingBag}
            />
          </>
        )}
        <Stat title={t("cart")} value={cartPieces} icon={ShoppingCart} />
        <Stat
          title={t("totalPayable")}
          value={money(total, lang)}
          icon={Wallet}
        />
      </div>

      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{t("createSale")}</h3>
            <p>{t("salePoint")}</p>
          </div>
          <span className="live">
            {products.length} {t("products").toLowerCase()}
          </span>
        </div>
        {localError && <div className="error banner">{localError}</div>}
        {localSuccess && <div className="success banner">{localSuccess}</div>}
        {!products.length && <p>{t("noProductsForSale")}</p>}
        {!canCreateSale && (
          <div className="error banner">{t("noPermission")}</div>
        )}

        {canCreateSale && (
          <div className="erp-sale-grid">
            <div className="erp-sale-product-form">
              <label>
                {t("selectProduct")}
                <select
                  value={productId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setProductId(id);
                    const product = products.find((item) => item.id === id);
                    setUnitPrice(Number(product?.salePrice || 0));
                  }}
                >
                  <option value="">— {t("selectProduct")} —</option>
                  {products
                    .filter((product) => Number(product.stockPieces || 0) > 0)
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {product.sku} · {t("stock")}:{" "}
                        {product.stockPieces}
                      </option>
                    ))}
                </select>
              </label>
              {selectedProduct && (
                <div className="erp-product-hint">
                  <b>{selectedProduct.name}</b>
                  <span>
                    {t("stock")}: {selectedProduct.stockPieces} ·{" "}
                    {money(selectedProduct.salePrice, lang)}
                  </span>
                </div>
              )}
              <label>
                {t("quantity")}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </label>
              <label>
                {t("price")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="gold-btn"
                onClick={addToCart}
                disabled={!products.length}
              >
                <Plus size={15} /> {t("addToCart")}
              </button>
            </div>

            <form className="erp-checkout" onSubmit={checkout}>
              <h4>
                {t("cart")} ({cartPieces})
              </h4>
              <div className="erp-cart-list">
                {cart.map((item) => (
                  <div className="erp-cart-item" key={item.productId}>
                    <div>
                      <b>{item.name}</b>
                      <small>
                        {item.sku} · {money(item.unitPrice, lang)}
                      </small>
                    </div>
                    <input
                      aria-label={t("quantity")}
                      type="number"
                      min="1"
                      max={item.stockPieces}
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQuantity(item.productId, e.target.value)
                      }
                    />
                    <b>{money(item.quantity * item.unitPrice, lang)}</b>
                    <button
                      type="button"
                      className="erp-icon-button"
                      onClick={() =>
                        setCart((current) =>
                          current.filter(
                            (row) => row.productId !== item.productId,
                          ),
                        )
                      }
                      title={t("remove")}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                {!cart.length && (
                  <p className="erp-empty-cart">{t("emptyCart")}</p>
                )}
              </div>
              <label>
                {t("customerOptional")}
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
              <div className="erp-checkout-row">
                <label>
                  {t("discount")}
                  <input
                    type="number"
                    min="0"
                    max={subtotal}
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </label>
                <label>
                  {t("paymentMethod")}
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">{t("paymentCash")}</option>
                    <option value="card">{t("paymentCard")}</option>
                    <option value="transfer">{t("paymentTransfer")}</option>
                    <option value="debt">{t("paymentDebt")}</option>
                  </select>
                </label>
              </div>
              <div className="erp-total-line">
                <span>{t("subtotal")}</span>
                <b>{money(subtotal, lang)}</b>
              </div>
              <div className="erp-total-line">
                <span>{t("discount")}</span>
                <b>− {money(safeDiscount, lang)}</b>
              </div>
              <div className="erp-total-final">
                <span>{t("totalPayable")}</span>
                <strong>{money(total, lang)}</strong>
              </div>
              <button
                className="gold-btn erp-checkout-button"
                disabled={saving || !cart.length}
              >
                {saving ? t("waiting") : t("completeSale")}
              </button>
            </form>
          </div>
        )}
      </div>

      {canReadSales && (
        <div className="panel">
          <div className="erp-section-heading">
            <div>
              <h3>{t("saleHistory")}</h3>
              <p>
                {rows.length} {t("saleCount").toLowerCase()}
              </p>
            </div>
            <div className="erp-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchSales")}
              />
            </div>
          </div>
          <Rows
            rows={filteredSales}
            cols={[
              "invoiceNo",
              "customerName",
              "total",
              "paymentMethod",
              "createdAt",
            ]}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
}

const EMPLOYEE_PERMISSION_OPTIONS = [
  ["products:read", "permissionProductsRead"],
  ["products:create", "permissionProductsCreate"],
  ["products:update", "permissionProductsUpdate"],
  ["products:delete", "permissionProductsDelete"],
  ["sales:read", "permissionSalesRead"],
  ["sales:create", "permissionSalesCreate"],
  ["inventory:read", "permissionInventoryRead"],
  ["inventory:create", "permissionInventoryCreate"],
  ["workshop:read", "permissionWorkshopRead"],
  ["workshop:create", "permissionWorkshopCreate"],
  ["workshop:update", "permissionWorkshopUpdate"],
  ["customers:read", "permissionCustomersRead"],
  ["customers:create", "permissionCustomersCreate"],
  ["customers:update", "permissionCustomersUpdate"],
  ["customers:delete", "permissionCustomersDelete"],
];

function Employees({ rows, api, reload, lang }) {
  const t = (key) => tr(lang, key);
  const initial = () => ({
    name: "",
    email: "",
    password: "",
    permissions: [],
  });
  const [form, setForm] = useState(initial());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const filtered = rows.filter((r) =>
    `${r.name || ""} ${r.email || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function reset() {
    setEditing(null);
    setForm(initial());
    setLocalError("");
  }
  function beginEdit(row) {
    setEditing(row);
    setForm({
      name: row.name || "",
      email: row.email || "",
      password: "",
      permissions: row.permissions || [],
    });
    setLocalError("");
    setLocalSuccess("");
  }
  function togglePermission(permission) {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((p) => p !== permission)
        : [...current.permissions, permission],
    }));
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setLocalError("");
    setLocalSuccess("");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        permissions: form.permissions,
      };
      if (!editing) payload.password = form.password;
      await api(editing ? `/employees/${editing.id}` : "/employees", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      setLocalSuccess(editing ? t("editEmployee") : t("addEmployee"));
      reset();
      await reload();
    } catch (e2) {
      setLocalError(e2.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }
  async function deactivate(row) {
    if (!window.confirm(`${t("deactivate")}: ${row.name}?`)) return;
    try {
      await api(`/employees/${row.id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      setLocalError(e.message || t("actionFailed"));
    }
  }
  return (
    <div className="erp-page-stack">
      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{t("companyEmployees")}</h3>
            <p>
              {rows.length} · {t("users")}
            </p>
          </div>
          <div className="erp-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
            />
          </div>
        </div>
        {localError && <div className="error banner">{localError}</div>}
        {localSuccess && <div className="success banner">{localSuccess}</div>}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("columnName")}</th>
                <th>{t("columnEmail")}</th>
                <th>{t("employeePermissions")}</th>
                <th>{t("columnActive")}</th>
                <th>{t("edit")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{(row.permissions || []).length}</td>
                  <td>{displayValue(row.isActive, lang)}</td>
                  <td>
                    <div className="erp-row-actions">
                      <button
                        type="button"
                        onClick={() => beginEdit(row)}
                        title={t("edit")}
                      >
                        <Pencil size={15} />
                      </button>
                      {row.isActive && (
                        <button
                          type="button"
                          className="danger"
                          onClick={() => deactivate(row)}
                          title={t("deactivate")}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="5">{t("noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <h3>{editing ? t("editEmployee") : t("addEmployee")}</h3>
        <form onSubmit={save} className="erp-form-stack">
          <div className="erp-form-grid">
            <label>
              {t("employeeName")}
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength="2"
              />
            </label>
            <label>
              {t("email")}
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            {!editing && (
              <label>
                {t("temporaryPassword")}
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength="8"
                />
              </label>
            )}
          </div>
          <h4>{t("employeePermissions")}</h4>
          <div className="erp-permission-grid">
            {EMPLOYEE_PERMISSION_OPTIONS.map(([key, label]) => (
              <label className="erp-checkbox-label" key={key}>
                <input
                  type="checkbox"
                  checked={form.permissions.includes(key)}
                  onChange={() => togglePermission(key)}
                />
                {t(label)}
              </label>
            ))}
          </div>
          <div className="erp-form-actions">
            <button className="gold-btn" disabled={saving}>
              {saving ? t("waiting") : editing ? t("save") : t("addEmployee")}
            </button>
            {editing && (
              <button
                type="button"
                className="erp-quiet-button"
                onClick={reset}
              >
                {t("cancelAction")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Customers({ rows, api, reload, lang, user }) {
  const t = (key) => tr(lang, key);
  const blank = () => ({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [form, setForm] = useState(blank());
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const canCreate =
    user?.role === "COMPANY_ADMIN" ||
    user?.permissions?.includes("customers:create");
  const canUpdate =
    user?.role === "COMPANY_ADMIN" ||
    user?.permissions?.includes("customers:update");
  const canDelete =
    user?.role === "COMPANY_ADMIN" ||
    user?.permissions?.includes("customers:delete");
  const filtered = rows.filter((r) =>
    `${r.name || ""} ${r.phone || ""} ${r.email || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  function reset() {
    setEditing(null);
    setForm(blank());
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api(editing ? `/customers/${editing.id}` : "/customers", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(form),
      });
      setSuccess(editing ? t("editCustomer") : t("addCustomer"));
      reset();
      await reload();
    } catch (e2) {
      setError(e2.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }
  async function archive(row) {
    if (!window.confirm(t("confirmArchiveCustomer"))) return;
    try {
      await api(`/customers/${row.id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      setError(e.message || t("actionFailed"));
    }
  }
  return (
    <div className="erp-page-stack">
      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{t("customers")}</h3>
            <p>
              {t("customersSubtitle")} · {rows.length}
            </p>
          </div>
          <div className="erp-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
            />
          </div>
        </div>
        {error && <div className="error banner">{error}</div>}
        {success && <div className="success banner">{success}</div>}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("columnName")}</th>
                <th>{t("customerPhone")}</th>
                <th>{t("customerEmail")}</th>
                <th>{t("customerAddress")}</th>
                <th>{t("edit")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.phone || "—"}</td>
                  <td>{row.email || "—"}</td>
                  <td>{row.address || "—"}</td>
                  <td>
                    <div className="erp-row-actions">
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(row);
                            setForm({
                              name: row.name || "",
                              phone: row.phone || "",
                              email: row.email || "",
                              address: row.address || "",
                              notes: row.notes || "",
                            });
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="danger"
                          onClick={() => archive(row)}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="5">{t("noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {(canCreate || (editing && canUpdate)) && (
        <div className="panel">
          <h3>{editing ? t("editCustomer") : t("addCustomer")}</h3>
          <form onSubmit={save} className="erp-form-stack">
            <div className="erp-form-grid">
              <label>
                {t("columnName")}
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  minLength="2"
                />
              </label>
              <label>
                {t("customerPhone")}
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                {t("customerEmail")}
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                {t("customerAddress")}
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </label>
              <label>
                {t("notes")}
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
            </div>
            <div className="erp-form-actions">
              <button className="gold-btn" disabled={saving}>
                {saving ? t("waiting") : t("save")}
              </button>
              {editing && (
                <button
                  type="button"
                  className="erp-quiet-button"
                  onClick={reset}
                >
                  {t("cancelAction")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Expenses({ rows, api, reload, lang }) {
  const t = (key) => tr(lang, key);
  const blank = () => ({
    category: "",
    description: "",
    amount: "",
    paymentMethod: "cash",
    incurredAt: new Date().toISOString().slice(0, 10),
  });
  const [form, setForm] = useState(blank());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  function reset() {
    setEditing(null);
    setForm(blank());
  }
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api(editing ? `/expenses/${editing.id}` : "/expenses", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      setSuccess(t("save"));
      reset();
      await reload();
    } catch (e2) {
      setError(e2.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }
  async function remove(row) {
    if (!window.confirm(t("confirmDeleteExpense"))) return;
    try {
      await api(`/expenses/${row.id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      setError(e.message || t("actionFailed"));
    }
  }
  return (
    <div className="erp-page-stack">
      <div className="stats">
        <Stat
          title={t("dashboardExpenses")}
          value={rows.length}
          icon={Banknote}
        />
        <Stat
          title={t("expensesTotal")}
          value={money(total, lang)}
          icon={Wallet}
        />
      </div>
      <div className="panel">
        <div className="erp-section-heading">
          <div>
            <h3>{t("expenses")}</h3>
            <p>{t("expensesSubtitle")}</p>
          </div>
        </div>
        {error && <div className="error banner">{error}</div>}
        {success && <div className="success banner">{success}</div>}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("expenseCategory")}</th>
                <th>{t("description")}</th>
                <th>{t("amount")}</th>
                <th>{t("paymentMethod")}</th>
                <th>{t("expenseDate")}</th>
                <th>{t("edit")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.category}</td>
                  <td>{row.description || "—"}</td>
                  <td>{money(row.amount, lang)}</td>
                  <td>{displayValue(row.paymentMethod, lang)}</td>
                  <td>{row.incurredAt || "—"}</td>
                  <td>
                    <div className="erp-row-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(row);
                          setForm({
                            category: row.category || "",
                            description: row.description || "",
                            amount: row.amount || "",
                            paymentMethod: row.paymentMethod || "cash",
                            incurredAt: row.incurredAt || "",
                          });
                        }}
                        title={t("edit")}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => remove(row)}
                        title={t("delete")}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="6">{t("noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <h3>{editing ? t("editExpense") : t("addExpense")}</h3>
        <form className="erp-form-grid" onSubmit={save}>
          <label>
            {t("expenseCategory")}
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </label>
          <label>
            {t("description")}
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label>
            {t("amount")}
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </label>
          <label>
            {t("paymentMethod")}
            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            >
              <option value="cash">{t("paymentCash")}</option>
              <option value="card">{t("paymentCard")}</option>
              <option value="transfer">{t("paymentTransfer")}</option>
            </select>
          </label>
          <label>
            {t("expenseDate")}
            <input
              type="date"
              value={form.incurredAt}
              onChange={(e) => setForm({ ...form, incurredAt: e.target.value })}
              required
            />
          </label>
          <div className="erp-form-actions">
            <button className="gold-btn" disabled={saving}>
              {saving ? t("waiting") : t("save")}
            </button>
            {editing && (
              <button
                type="button"
                className="erp-quiet-button"
                onClick={reset}
              >
                {t("cancelAction")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function CompanySettings({ company, api, reload, lang, setLang }) {
  const t = (key) => tr(lang, key);
  const [form, setForm] = useState({
    name: company.name || "",
    phone: company.phone || "",
    email: company.email || "",
    address: company.address || "",
    locale: company.locale || lang,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(
    () =>
      setForm({
        name: company.name || "",
        phone: company.phone || "",
        email: company.email || "",
        address: company.address || "",
        locale: company.locale || lang,
      }),
    [company?.id, company?.updatedAt],
  );
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api("/settings/company", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setLang(form.locale);
      setSuccess(t("saveSettings"));
      await reload();
    } catch (e2) {
      setError(e2.message || t("actionFailed"));
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="panel">
      <h3>{t("companySettings")}</h3>
      <p>{company.slug || ""}</p>
      {error && <div className="error banner">{error}</div>}
      {success && <div className="success banner">{success}</div>}
      <form className="erp-form-grid" onSubmit={save}>
        <label>
          {t("companyName")}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength="2"
          />
        </label>
        <label>
          {t("phone")}
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          {t("email")}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          {t("address")}
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>
        <label>
          {t("preferredLanguage")}
          <select
            value={form.locale}
            onChange={(e) => setForm({ ...form, locale: e.target.value })}
          >
            <option value="uz">O‘zbekcha</option>
            <option value="ru">Русский</option>
          </select>
        </label>
        <div className="erp-form-actions">
          <button className="gold-btn" disabled={saving}>
            {saving ? t("waiting") : t("saveSettings")}
          </button>
        </div>
      </form>
    </div>
  );
}

function AuditLogs({ rows, lang }) {
  const t = (key) => tr(lang, key);
  return (
    <div className="panel">
      <div className="erp-section-heading">
        <div>
          <h3>{t("audit")}</h3>
          <p>{t("auditSubtitle")}</p>
        </div>
        <span className="live">{rows.length}</span>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{t("columnCreatedAt")}</th>
              <th>{t("action")}</th>
              <th>{t("entity")}</th>
              <th>{t("entityId")}</th>
              <th>{t("actor")}</th>
              <th>{t("details")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString(
                        lang === "ru" ? "ru-RU" : "uz-UZ",
                      )
                    : "—"}
                </td>
                <td>{row.action}</td>
                <td>{row.entity || "—"}</td>
                <td>{row.entityId || "—"}</td>
                <td>{row.userId || "—"}</td>
                <td>
                  <code className="audit-json">
                    {JSON.stringify(row.details || {})}
                  </code>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="6">{t("noData")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BoxesIcon(props) {
  return <Package {...props} />;
}
