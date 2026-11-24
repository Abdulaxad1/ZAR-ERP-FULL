# ZAR ERP — yangilangan loyiha

React + Vite frontend, Express + PostgreSQL backend. Loyiha bir nechta kompaniya uchun tenant asosida ishlaydi.

## Modullar

- Super Admin: kompaniyalar, obunalar, tariflar, bloklash/faollashtirish va xabarnomalar.
- Kompaniya: dashboard, mahsulotlar CRUD, sotuv/kassa, xodimlar va ruxsatlar, mijozlar CRUD, xarajatlar, metall partiyalari, ustaxona buyurtmalari, bildirishnomalar, audit jurnali va kompaniya sozlamalari.
- Til: o‘zbekcha va ruscha, tanlov brauzerda saqlanadi; kompaniya sozlamasida standart til ham saqlanadi.
- Xavfsizlik: JWT, bcrypt, rate limit, CORS allowlist, Helmet, tenant-scoped so‘rovlar, xodim permissionlari va transactional stock updates.

## O‘rnatish

Talablar: Node.js 20+ va PostgreSQL. PostgreSQL'da `zar_erp` nomli database yarating.

### Backend

1. `backend/.env.example` faylidan `.env` nusxa yarating.
2. `DATABASE_URL`, 32+ belgili `JWT_SECRET`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` qiymatlarini o‘zingizning muhitga moslang.
3. Terminal: `cd backend`
4. `npm install`
5. `npm run dev`

### Frontend

1. `frontend/.env.example` faylidan `.env` nusxa yarating.
2. `VITE_API_URL=http://localhost:4000/api` qiymatini tekshiring.
3. Boshqa terminal: `cd frontend`
4. `npm install`
5. `npm run dev`
6. Brauzerda `http://localhost:5173` oching.

Health tekshiruvi: `http://localhost:4000/api/health`.

## Muhim

- Haqiqiy `.env` fayllari arxivga kiritilmagan. Maxfiy parollarni ZIP yoki GitHub'ga qo‘ymang.
- Backend ishga tushganda mavjud database uchun faqat qo‘shimcha ustunlarni tekshiruvchi migratsiya ishlaydi; ma’lumotlarni o‘chirmaydi. Yangi Customer/Expense jadvallari Sequelize orqali yaratiladi.
- Bu MVP/ishchi asosdir, ishlab chiqarishga chiqarishdan oldin zaxira nusxa, HTTPS, DB migrations, testlar, to‘lov integratsiyalari, fiskal talablar va mustaqil xavfsizlik tekshiruvi zarur.
- `sequelize.sync()` hozir development bootstrap uchun ishlatiladi; production muhitida versiyalangan migratsiya tizimiga o‘tish kerak.

## Tekshirish

Backend JS fayllari `node --check` bilan tekshiriladi. To‘liq build va DB integratsion sinovi ushbu muhitda bajarilmagan bo‘lishi mumkin; lokal muhitda `npm run build` va testlarni bajaring.
