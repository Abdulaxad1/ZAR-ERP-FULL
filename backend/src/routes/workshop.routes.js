const router = require("express").Router();
const { MetalBatch, WorkshopOrder, sequelize } = require("../models");
const auth = require("../middleware/auth");
const { permission } = require("../middleware/roles");
const audit = require("../utils/audit");

router.use(auth, (req, res, next) => {
  if (!['COMPANY_ADMIN', 'EMPLOYEE'].includes(req.user?.role) || !req.user?.tenantId) {
    return res.status(403).json({ message: 'Bu bo‘lim faqat kompaniya foydalanuvchilari uchun' });
  }
  return next();
});
const tenant = (req) => ({ tenantId: req.user.tenantId });
const canRead = (req, permissionName) =>
  req.user?.role === "COMPANY_ADMIN" ||
  req.user?.role === "SUPER_ADMIN" ||
  req.user?.permissions?.includes(permissionName);

router.get("/metal-batches", async (req, res, next) => {
  try {
    if (req.user.role === "EMPLOYEE" && !canRead(req, "inventory:read") && !canRead(req, "inventory:create") && !canRead(req, "workshop:create")) return res.status(403).json({ message: "Metall omborini ko‘rish uchun ruxsat kerak" });
    return res.json(await MetalBatch.findAll({ where: tenant(req), order: [["createdAt", "DESC"]] })); }
  catch (error) { return next(error); }
});

router.post("/metal-batches", permission("inventory:create"), async (req, res, next) => {
  try {
    const { batchNo, metal, purity, grossGrams, costPerGram = 0, supplier, notes } = req.body;
    const grams = Number(grossGrams);
    if (!String(batchNo || "").trim() || !["gold", "silver", "platinum"].includes(metal) || !Number.isInteger(Number(purity)) || Number(purity) < 1 || Number(purity) > 999 || !Number.isFinite(grams) || grams <= 0 || !Number.isFinite(Number(costPerGram)) || Number(costPerGram) < 0) {
      return res.status(400).json({ message: "Partiya, metall, proba, gramm va narx qiymatlarini tekshiring" });
    }
    const exists = await MetalBatch.findOne({ where: { ...tenant(req), batchNo: String(batchNo).trim() } });
    if (exists) return res.status(409).json({ message: "Bu partiya raqami mavjud" });
    const row = await MetalBatch.create({ batchNo: String(batchNo).trim(), metal, purity: Number(purity), grossGrams: grams, availableGrams: grams, costPerGram: Number(costPerGram), supplier, notes, ...tenant(req) });
    await audit(req, "CREATE", "MetalBatch", row.id, { batchNo: row.batchNo, grossGrams: grams });
    return res.status(201).json(row);
  } catch (error) { return next(error); }
});

router.get("/workshop/orders", async (req, res, next) => {
  try {
    if (req.user.role === "EMPLOYEE" && !canRead(req, "workshop:read") && !canRead(req, "workshop:create") && !canRead(req, "workshop:update")) return res.status(403).json({ message: "Ustaxona buyurtmalarini ko‘rish uchun ruxsat kerak" });
    return res.json(await WorkshopOrder.findAll({ where: tenant(req), include: [{ model: MetalBatch, attributes: ["batchNo", "metal", "purity"] }], order: [["createdAt", "DESC"]] })); }
  catch (error) { return next(error); }
});

router.post("/workshop/orders", permission("workshop:create"), async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { metalBatchId, productName, customerName, plannedGrams, dueDate, notes } = req.body;
    const grams = Number(plannedGrams);
    if (!metalBatchId || !String(productName || "").trim() || !Number.isFinite(grams) || grams <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Buyum nomi, metall partiyasi va gramm miqdorini kiriting" });
    }
    const batch = await MetalBatch.findOne({ where: { id: metalBatchId, ...tenant(req) }, transaction, lock: transaction.LOCK.UPDATE });
    if (!batch) { await transaction.rollback(); return res.status(404).json({ message: "Metall partiyasi topilmadi" }); }
    if (Number(batch.availableGrams) < grams) { await transaction.rollback(); return res.status(409).json({ message: `Qoldiq yetarli emas. Mavjud: ${batch.availableGrams} g` }); }
    await batch.update({ availableGrams: (Number(batch.availableGrams) - grams).toFixed(3) }, { transaction });
    const order = await WorkshopOrder.create({
      orderNo: `WRK-${Date.now()}`,
      productName: String(productName).trim(),
      customerName,
      metal: batch.metal,
      purity: batch.purity,
      plannedGrams: grams,
      dueDate: dueDate || null,
      notes,
      metalBatchId: batch.id,
      ...tenant(req),
    }, { transaction });
    await transaction.commit();
    await audit(req, "CREATE", "WorkshopOrder", order.id, { orderNo: order.orderNo, plannedGrams: grams });
    return res.status(201).json(await WorkshopOrder.findByPk(order.id, { include: [MetalBatch] }));
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback().catch(() => {});
    return next(error);
  }
});

router.patch("/workshop/orders/:id/status", permission("workshop:update"), async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { status } = req.body;
    if (!["READY", "DELIVERED", "CANCELLED"].includes(status)) { await transaction.rollback(); return res.status(400).json({ message: "Status noto‘g‘ri" }); }
    const order = await WorkshopOrder.findOne({ where: { id: req.params.id, ...tenant(req) }, transaction, lock: transaction.LOCK.UPDATE });
    if (!order) { await transaction.rollback(); return res.status(404).json({ message: "Buyurtma topilmadi" }); }
    const valid = (order.status === "IN_PROGRESS" && ["READY", "CANCELLED"].includes(status)) || (order.status === "READY" && status === "DELIVERED");
    if (!valid) { await transaction.rollback(); return res.status(409).json({ message: "Bu buyurtma holatini endi o‘zgartirib bo‘lmaydi" }); }
    if (status === "CANCELLED") {
      const batch = await MetalBatch.findOne({ where: { id: order.metalBatchId, ...tenant(req) }, transaction, lock: transaction.LOCK.UPDATE });
      if (batch) await batch.update({ availableGrams: (Number(batch.availableGrams) + Number(order.plannedGrams)).toFixed(3) }, { transaction });
    }
    await order.update({ status }, { transaction });
    await transaction.commit();
    await audit(req, "STATUS", "WorkshopOrder", order.id, { status });
    return res.json(order);
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback().catch(() => {});
    return next(error);
  }
});

module.exports = router;
