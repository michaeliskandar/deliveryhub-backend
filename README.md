# DeliverHub Backend (JavaScript)

نسخة JavaScript عادية (بدون TypeScript) من باكند DeliverHub.

## الحالة الحالية

كل ملف فيه `// TODO` بس، يعني التقسيمة جاهزة ومحتاجة نملاها مع بعض ملف بملف.

## ملاحظات على التحويل من TypeScript

- شيلنا كل ملفات `*.types.ts` لأن الـ interfaces مش موجودة في JS.
- شيلنا `tsconfig.json` بالكامل.
- ضفنا `src/shared/constants/` كبديل لمحتوى الـ enums اللي كانت في ملفات الـ types (زي حالات الشحنة، الأدوار، حالات العرض).
- كل المنطق (logic) هيفضل زي ما هو، بس من غير type annotations.

## ترتيب الشغل المقترح (عشان مانتوهش)

1. `src/shared/constants/` — القيم الثابتة (roles, شحنة status, عرض status)
2. `src/shared/utils/` — الأدوات المساعدة (ApiError, ApiResponse, jwt, otp...)
3. `src/config/` — إعدادات الاتصال (database, redis, env...)
4. `src/database/models/` — الموديلز
5. `src/shared/middleware/` — الميدلوير
6. `src/modules/auth/` — أول موديول كامل (controller + service + routes + validation)
7. باقي الـ modules بالترتيب: users → drivers → offices → shipments → offers → tracking → escrow → wallet → disputes → support → reviews → notifications → admin
8. `src/jobs/`
9. `src/routes/index.js` — تجميع كل الراوتس
10. `src/app.js` و `src/server.js` — نقطة التشغيل

## تشغيل المشروع (لاحقًا بعد التعبئة)

```bash
npm install
npm run dev
```
