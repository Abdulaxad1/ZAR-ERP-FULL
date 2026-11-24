# ZAR ERP — tekshiruv hisoboti

## Ushbu arxivda bajarilgan tekshiruvlar

- `backend/src` ichidagi barcha JavaScript fayllari `node --check` bilan tekshirildi.
- Frontend `App.jsx`, `main.jsx` va Vite config JSX/JavaScript parseridan o‘tkazildi.
- O‘zbekcha va ruscha tarjima lug‘atlaridagi kalitlar solishtirildi: 263/263 kalit mos, ishlatilayotgan 202 ta literal tarjima kaliti ikkala tilda ham mavjud.
- ZIP arxiv yaxlitligi tekshirildi.
- Haqiqiy `.env`, `node_modules` va `.git` arxivga qo‘shilmadi.

## Hali lokal muhitda bajarilishi shart

1. `backend` papkasida `npm install` va `npm run check`.
2. `frontend` papkasida `npm install` va `npm run check` (`vite build`).
3. PostgreSQL `zar_erp` bazasiga ulab serverni ishga tushirish.
4. Super Admin, kompaniya Admini va har xil ruxsatli xodim bilan login/API sinovlari.
5. Mahsulot, sotuv, ombor, ustaxona, mijoz, xarajat, tarif va obuna amallarini real DBda tekshirish.

Ushbu ish muhiti foydalanuvchining PostgreSQL bazasiga ulanmagan; shuning uchun integratsion va ishlab chiqarish sinovlari bajarildi deb hisoblanmaydi.
