const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {
  sequelize, Product, Sale, SaleItem, Notification, Subscription, Plan, User,
  Customer, Expense, AuditLog, Tenant,
} = require("../models");
const auth = require("../middleware/auth");
const { allow, permission } = require("../middleware/roles");
const audit = require("../utils/audit");

router.use(auth, (req, res, next) => {
  if (!['COMPANY_ADMIN', 'EMPLOYEE'].includes(req.user?.role) || !req.user?.tenantId) {
    return res.status(403).json({ message: 'Bu bo‘lim faqat kompaniya foydalanuvchilari uchun' });
  }
  return next();
});
const tenantWhere = (req) => ({ tenantId: req.user.tenantId });
const canRead = (req, permissionName) => req.user?.role === "COMPANY_ADMIN" || req.user?.permissions?.includes(permissionName);
const allowedPermissions = [
  "products:read", "products:create", "products:update", "products:delete",
  "sales:read", "sales:create", "inventory:read", "inventory:create", "workshop:read", "workshop:create", "workshop:update",
  "customers:read", "customers:create", "customers:update", "customers:delete",
  "expenses:create", "expenses:update", "expenses:delete",
];
const pick = (source, fields) => Object.fromEntries(fields.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));

function validateProduct(body) {
  const errors = [];
  if (!String(body.name || "").trim()) errors.push("Mahsulot nomi kerak");
  if (!String(body.sku || "").trim()) errors.push("SKU kodi kerak");
  if (!String(body.category || "").trim()) errors.push("Kategoriya kerak");
  if (!["gold", "silver", "platinum"].includes(body.metal || "gold")) errors.push("Metall turi noto‘g‘ri");
  const purity = Number(body.purity ?? 585);
  if (!Number.isInteger(purity) || purity < 1 || purity > 999) errors.push("Proba 1 dan 999 gacha bo‘lishi kerak");
  for (const field of ["grossWeight", "stoneWeight", "costPrice", "salePrice"]) {
    if (body[field] !== undefined && (!Number.isFinite(Number(body[field])) || Number(body[field]) < 0)) errors.push(`${field} qiymati noto‘g‘ri`);
  }
  if (body.stockPieces !== undefined && (!Number.isInteger(Number(body.stockPieces)) || Number(body.stockPieces) < 0)) errors.push("Dona qoldig‘i manfiy bo‘lmasligi kerak");
  if (body.grossWeight !== undefined && body.stoneWeight !== undefined && Number(body.stoneWeight) > Number(body.grossWeight)) errors.push("Tosh vazni umumiy vazndan katta bo‘lishi mumkin emas");
  if (body.name !== undefined && String(body.name).trim().length > 160) errors.push("Mahsulot nomi 160 belgidan oshmasligi kerak");
  if (body.sku !== undefined && String(body.sku).trim().length > 60) errors.push("SKU kodi 60 belgidan oshmasligi kerak");
  return errors;
}

// Company dashboard KPIs.
router.get("/overview", async (req, res, next) => {
  try {
    const where = tenantWhere(req);
    if (req.user.role !== "COMPANY_ADMIN") {
      const permissions = new Set(req.user.permissions || []);
      const [products, customers, lowStock] = await Promise.all([
        permissions.has("products:read") || permissions.has("sales:create") ? Product.count({ where }) : 0,
        permissions.has("customers:read") ? Customer.count({ where: { ...where, isActive: true } }) : 0,
        permissions.has("inventory:read") ? Product.count({ where: { ...where, stockPieces: { [Op.lte]: 2 } } }) : 0,
      ]);
      return res.json({ products, customers, lowStock });
    }
    const [products, customers, sales, expenses, lowStock, salesTotal, expensesTotal] = await Promise.all([
      Product.count({ where }), Customer.count({ where: { ...where, isActive: true } }),
      Sale.count({ where }), Expense.count({ where }), Product.count({ where: { ...where, stockPieces: { [Op.lte]: 2 } } }),
      Sale.sum("total", { where }), Expense.sum("amount", { where }),
    ]);
    return res.json({ products, customers, sales, expenses, lowStock, salesTotal: Number(salesTotal || 0), expensesTotal: Number(expensesTotal || 0), net: Number(salesTotal || 0) - Number(expensesTotal || 0) });
  } catch (error) { return next(error); }
});

// Company profile / preferred interface language.
router.get("/settings/company", async (req, res, next) => {
  try {
    const company = await Tenant.findByPk(req.user.tenantId, { attributes: ["id", "name", "slug", "phone", "email", "address", "locale", "status"] });
    if (!company) return res.status(404).json({ message: "Kompaniya topilmadi" });
    return res.json(company);
  } catch (error) { return next(error); }
});
router.patch("/settings/company", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const company = await Tenant.findByPk(req.user.tenantId);
    if (!company) return res.status(404).json({ message: "Kompaniya topilmadi" });
    const payload = pick(req.body, ["name", "phone", "email", "address", "locale"]);
    if (payload.name !== undefined && String(payload.name).trim().length < 2) return res.status(400).json({ message: "Kompaniya nomi juda qisqa" });
    if (payload.locale !== undefined && !["uz", "ru"].includes(payload.locale)) return res.status(400).json({ message: "Til noto‘g‘ri" });
    await company.update(payload);
    await audit(req, "UPDATE", "Tenant", company.id, payload);
    return res.json(company);
  } catch (error) { return next(error); }
});

// Products CRUD.
router.get("/products", async (req, res, next) => {
  try {
    if (req.user.role === "EMPLOYEE" && !canRead(req, "products:read") && !canRead(req, "sales:create")) return res.status(403).json({ message: "Mahsulotlar ro‘yxatini ko‘rish uchun ruxsat kerak" });
    return res.json(await Product.findAll({ where: tenantWhere(req), order: [["createdAt", "DESC"]] })); }
  catch (error) { return next(error); }
});
router.post("/products", permission("products:create"), async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    const sku = String(req.body.sku).trim();
    if (await Product.findOne({ where: { ...tenantWhere(req), sku } })) return res.status(409).json({ message: "Bu SKU kodi allaqachon mavjud" });
    const payload = pick(req.body, ["name", "sku", "category", "metal", "purity", "grossWeight", "stoneWeight", "stockPieces", "costPrice", "salePrice", "barcode"]);
    const product = await Product.create({ ...payload, name: String(payload.name).trim(), sku, tenantId: req.user.tenantId });
    await audit(req, "CREATE", "Product", product.id, { sku, name: product.name });
    return res.status(201).json(product);
  } catch (error) { return next(error); }
});
router.patch("/products/:id", permission("products:update"), async (req, res, next) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    const payload = pick(req.body, ["name", "sku", "category", "metal", "purity", "grossWeight", "stoneWeight", "stockPieces", "costPrice", "salePrice", "barcode"]);
    const errors = validateProduct({ ...product.toJSON(), ...payload });
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    if (payload.sku) {
      payload.sku = String(payload.sku).trim();
      const duplicate = await Product.findOne({ where: { ...tenantWhere(req), sku: payload.sku, id: { [Op.ne]: product.id } } });
      if (duplicate) return res.status(409).json({ message: "Bu SKU kodi boshqa mahsulotda ishlatilgan" });
    }
    await product.update(payload);
    await audit(req, "UPDATE", "Product", product.id, payload);
    return res.json(product);
  } catch (error) { return next(error); }
});
router.delete("/products/:id", permission("products:delete"), async (req, res, next) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    await product.destroy();
    await audit(req, "DELETE", "Product", req.params.id, { name: product.name, sku: product.sku });
    return res.json({ message: "Mahsulot o‘chirildi" });
  } catch (error) { return next(error); }
});

// Sales and stock decrement are one database transaction.
router.post("/sales", permission("sales:create"), async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { items = [], customerName, discount = 0, paymentMethod } = req.body;
    if (!Array.isArray(items) || !items.length) { await transaction.rollback(); return res.status(400).json({ message: "Savat bo‘sh" }); }
    if (!["cash", "card", "transfer", "debt"].includes(paymentMethod)) { await transaction.rollback(); return res.status(400).json({ message: "To‘lov turi noto‘g‘ri" }); }
    // Client yuborgan narxga ishonmaymiz: sotuv narxi faqat DBdagi mahsulotdan olinadi.
    const normalItems = items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));
    if (normalItems.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      await transaction.rollback(); return res.status(400).json({ message: "Savatdagi mahsulot ma’lumotlari noto‘g‘ri" });
    }
    const productIds = [...new Set(normalItems.map((item) => item.productId))];
    if (productIds.length !== normalItems.length) { await transaction.rollback(); return res.status(400).json({ message: "Bir mahsulotni savatga bitta qatorda kiriting" }); }
    const products = await Product.findAll({ where: { id: productIds, ...tenantWhere(req) }, transaction, lock: transaction.LOCK.UPDATE });
    if (products.length !== productIds.length) { await transaction.rollback(); return res.status(404).json({ message: "Savatdagi mahsulot topilmadi" }); }
    for (const item of normalItems) {
      const product = products.find((row) => row.id === item.productId);
      item.unitPrice = Number(product.salePrice);
      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        await transaction.rollback();
        return res.status(400).json({ message: `Mahsulot narxi noto‘g‘ri: ${product.name}` });
      }
    }
    // DECIMAL(14,2) values are calculated in integer tiyin to avoid float drift.
    const subtotalCents = normalItems.reduce((sum, item) => sum + item.quantity * Math.round(item.unitPrice * 100), 0);
    const discountNumber = Number(discount);
    if (!Number.isFinite(discountNumber) || discountNumber < 0) { await transaction.rollback(); return res.status(400).json({ message: "Chegirma noto‘g‘ri" }); }
    const discountCents = Math.round(discountNumber * 100);
    if (discountCents > subtotalCents) { await transaction.rollback(); return res.status(400).json({ message: "Chegirma noto‘g‘ri" }); }
    const subtotal = (subtotalCents / 100).toFixed(2);
    const discountAmount = (discountCents / 100).toFixed(2);
    const totalAmount = ((subtotalCents - discountCents) / 100).toFixed(2);
    for (const item of normalItems) {
      const product = products.find((row) => row.id === item.productId);
      if (Number(product.stockPieces) < item.quantity) throw Object.assign(new Error(`Omborda ${product.name} yetarli emas. Qoldiq: ${product.stockPieces}`), { status: 409 });
    }
    const sale = await Sale.create({
      tenantId: req.user.tenantId,
      invoiceNo: `ZAR-${Date.now()}`,
      customerName: customerName ? String(customerName).trim().slice(0, 160) : null,
      subtotal,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod,
    }, { transaction });
    for (const item of normalItems) {
      const product = products.find((row) => row.id === item.productId);
      await product.decrement("stockPieces", { by: item.quantity, transaction });
      await SaleItem.create({
        saleId: sale.id,
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: (item.quantity * Math.round(item.unitPrice * 100) / 100).toFixed(2),
      }, { transaction });
    }
    await transaction.commit();
    await audit(req, "CREATE", "Sale", sale.id, { invoiceNo: sale.invoiceNo, total: sale.total });
    const result = await Sale.findByPk(sale.id, { include: [{ model: SaleItem, as: "items" }] });
    return res.status(201).json(result);
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback().catch(() => {});
    return next(error);
  }
});
router.get("/sales", async (req, res, next) => {
  try {
    if (req.user.role === "EMPLOYEE" && !canRead(req, "sales:read")) return res.status(403).json({ message: "Sotuvlar tarixini ko‘rish uchun ruxsat kerak" });
    return res.json(await Sale.findAll({ where: tenantWhere(req), include: [{ model: SaleItem, as: "items" }], order: [["createdAt", "DESC"]], limit: 500 })); }
  catch (error) { return next(error); }
});

// Employees: company admins can create, edit permissions and deactivate.
router.get("/employees", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try { return res.json(await User.findAll({ where: tenantWhere(req), attributes: { exclude: ["passwordHash"] }, order: [["createdAt", "DESC"]] })); }
  catch (error) { return next(error); }
});
router.post("/employees", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const permissions = Array.isArray(req.body.permissions) ? [...new Set(req.body.permissions)] : [];
    if (name.length < 2 || name.length > 140 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 160 || password.length < 8 || password.length > 100) return res.status(400).json({ message: "Ism (2–140), email va parol (8–100 belgi) qiymatlarini tekshiring" });
    if (permissions.some((item) => !allowedPermissions.includes(item))) return res.status(400).json({ message: "Noto‘g‘ri ruxsat tanlandi" });
    if (await User.findOne({ where: { email } })) return res.status(409).json({ message: "Bu email band" });
    const [count, subscription] = await Promise.all([
      User.count({ where: tenantWhere(req) }),
      Subscription.findOne({ where: { ...tenantWhere(req), status: "ACTIVE" }, include: [Plan], order: [["endsAt", "DESC"]] }),
    ]);
    if (subscription?.Plan && count >= Number(subscription.Plan.maxUsers)) return res.status(403).json({ message: "Tarifdagi foydalanuvchilar limiti tugagan" });
    const employee = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: "EMPLOYEE", tenantId: req.user.tenantId, permissions });
    await audit(req, "CREATE", "User", employee.id, { name, email, permissions });
    const safe = employee.toJSON(); delete safe.passwordHash;
    return res.status(201).json(safe);
  } catch (error) { return next(error); }
});
router.patch("/employees/:id", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const employee = await User.findOne({ where: { id: req.params.id, ...tenantWhere(req), role: "EMPLOYEE" } });
    if (!employee) return res.status(404).json({ message: "Xodim topilmadi" });
    const payload = pick(req.body, ["name", "email", "permissions", "isActive"]);
    if (payload.name !== undefined) {
      payload.name = String(payload.name).trim();
      if (payload.name.length < 2 || payload.name.length > 140) return res.status(400).json({ message: "Ism 2–140 belgi bo‘lishi kerak" });
    }
    if (payload.isActive !== undefined && typeof payload.isActive !== "boolean") return res.status(400).json({ message: "isActive boolean bo‘lishi kerak" });
    if (payload.email !== undefined) {
      payload.email = String(payload.email).trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(payload.email)) return res.status(400).json({ message: "Email noto‘g‘ri" });
      const duplicate = await User.findOne({ where: { email: payload.email, id: { [Op.ne]: employee.id } } });
      if (duplicate) return res.status(409).json({ message: "Bu email band" });
    }
    if (payload.permissions !== undefined && (!Array.isArray(payload.permissions) || payload.permissions.some((item) => !allowedPermissions.includes(item)))) return res.status(400).json({ message: "Ruxsatlar ro‘yxati noto‘g‘ri" });
    if (payload.name !== undefined) payload.name = String(payload.name).trim();
    await employee.update(payload);
    await audit(req, "UPDATE", "User", employee.id, payload);
    const safe = employee.toJSON(); delete safe.passwordHash;
    return res.json(safe);
  } catch (error) { return next(error); }
});
router.delete("/employees/:id", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const employee = await User.findOne({ where: { id: req.params.id, ...tenantWhere(req), role: "EMPLOYEE" } });
    if (!employee) return res.status(404).json({ message: "Xodim topilmadi" });
    await employee.update({ isActive: false });
    await audit(req, "DEACTIVATE", "User", employee.id, { email: employee.email });
    return res.json({ message: "Xodim faolsizlantirildi" });
  } catch (error) { return next(error); }
});

// Customers CRUD.
router.get("/customers", async (req, res, next) => {
  try {
    if (req.user.role === "EMPLOYEE" && !["customers:read", "customers:create", "customers:update", "customers:delete"].some((permissionName) => canRead(req, permissionName))) return res.status(403).json({ message: "Mijozlarni ko‘rish uchun ruxsat kerak" });
    return res.json(await Customer.findAll({ where: { ...tenantWhere(req), isActive: true }, order: [["createdAt", "DESC"]] })); }
  catch (error) { return next(error); }
});
router.post("/customers", permission("customers:create"), async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    if (name.length < 2) return res.status(400).json({ message: "Mijoz ismini kiriting" });
    const customer = await Customer.create({ ...pick(req.body, ["phone", "address", "notes"]), email: String(req.body.email || "").trim() || null, name, tenantId: req.user.tenantId });
    await audit(req, "CREATE", "Customer", customer.id, { name });
    return res.status(201).json(customer);
  } catch (error) { return next(error); }
});
router.patch("/customers/:id", permission("customers:update"), async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!customer) return res.status(404).json({ message: "Mijoz topilmadi" });
    const payload = pick(req.body, ["name", "phone", "address", "notes"]);
    if (req.body.email !== undefined) payload.email = String(req.body.email || "").trim() || null;
    if (payload.name !== undefined && String(payload.name).trim().length < 2) return res.status(400).json({ message: "Mijoz ismi noto‘g‘ri" });
    await customer.update(payload);
    await audit(req, "UPDATE", "Customer", customer.id, payload);
    return res.json(customer);
  } catch (error) { return next(error); }
});
router.delete("/customers/:id", permission("customers:delete"), async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!customer) return res.status(404).json({ message: "Mijoz topilmadi" });
    await customer.update({ isActive: false });
    await audit(req, "ARCHIVE", "Customer", customer.id, { name: customer.name });
    return res.json({ message: "Mijoz arxivlandi" });
  } catch (error) { return next(error); }
});

// Expenses / operating costs.
router.get("/expenses", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try { return res.json(await Expense.findAll({ where: tenantWhere(req), order: [["incurredAt", "DESC"], ["createdAt", "DESC"]], limit: 500 })); }
  catch (error) { return next(error); }
});
router.post("/expenses", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const category = String(req.body.category || "").trim();
    const amount = Number(req.body.amount);
    const paymentMethod = req.body.paymentMethod || "cash";
    if (!category || !Number.isFinite(amount) || amount <= 0 || !["cash", "card", "transfer"].includes(paymentMethod)) return res.status(400).json({ message: "Xarajat turi, musbat summa va to‘lov usulini kiriting" });
    const expense = await Expense.create({ category, description: req.body.description || null, amount, paymentMethod, incurredAt: req.body.incurredAt || new Date().toISOString().slice(0, 10), tenantId: req.user.tenantId });
    await audit(req, "CREATE", "Expense", expense.id, { category, amount });
    return res.status(201).json(expense);
  } catch (error) { return next(error); }
});
router.patch("/expenses/:id", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!expense) return res.status(404).json({ message: "Xarajat topilmadi" });
    const payload = pick(req.body, ["category", "description", "amount", "paymentMethod", "incurredAt"]);
    if (payload.amount !== undefined && (!Number.isFinite(Number(payload.amount)) || Number(payload.amount) <= 0)) return res.status(400).json({ message: "Summa noto‘g‘ri" });
    await expense.update(payload);
    await audit(req, "UPDATE", "Expense", expense.id, payload);
    return res.json(expense);
  } catch (error) { return next(error); }
});
router.delete("/expenses/:id", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!expense) return res.status(404).json({ message: "Xarajat topilmadi" });
    await expense.destroy();
    await audit(req, "DELETE", "Expense", expense.id, { amount: expense.amount });
    return res.json({ message: "Xarajat o‘chirildi" });
  } catch (error) { return next(error); }
});

router.get("/notifications", async (req, res, next) => {
  try { return res.json(await Notification.findAll({ where: tenantWhere(req), order: [["createdAt", "DESC"]], limit: 100 })); }
  catch (error) { return next(error); }
});
router.patch("/notifications/:id/read", async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, ...tenantWhere(req) } });
    if (!notification) return res.status(404).json({ message: "Bildirishnoma topilmadi" });
    await notification.update({ isRead: true });
    return res.json(notification);
  } catch (error) { return next(error); }
});
router.patch("/notifications/read-all", async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { ...tenantWhere(req), isRead: false } });
    return res.json({ message: "Barcha bildirishnomalar o‘qilgan deb belgilandi" });
  } catch (error) { return next(error); }
});
router.get("/subscription", async (req, res, next) => {
  try { return res.json(await Subscription.findOne({ where: tenantWhere(req), include: [Plan], order: [["endsAt", "DESC"]] })); }
  catch (error) { return next(error); }
});
router.get("/audit-logs", allow("COMPANY_ADMIN"), async (req, res, next) => {
  try { return res.json(await AuditLog.findAll({ where: tenantWhere(req), order: [["createdAt", "DESC"]], limit: 250 })); }
  catch (error) { return next(error); }
});

module.exports = router;
