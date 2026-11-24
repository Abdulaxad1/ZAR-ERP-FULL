const router = require("express").Router();
const { Op } = require("sequelize");
const { sequelize, Tenant, User, Plan, Subscription, Notification } = require("../models");
const auth = require("../middleware/auth");
const { allow } = require("../middleware/roles");
const audit = require("../utils/audit");

router.use(auth, allow("SUPER_ADMIN"));

router.get("/overview", async (req, res, next) => {
  try {
    const [tenants, active, expired, users, suspended, plans] = await Promise.all([
      Tenant.count(),
      Subscription.count({ where: { status: "ACTIVE", endsAt: { [Op.gt]: new Date() } } }),
      Subscription.count({ where: { [Op.or]: [{ status: "EXPIRED" }, { endsAt: { [Op.lt]: new Date() } }] } }),
      User.count(),
      Tenant.count({ where: { status: "SUSPENDED" } }),
      Plan.count({ where: { isActive: true } }),
    ]);
    return res.json({ tenants, active, expired, users, suspended, plans });
  } catch (error) { return next(error); }
});

router.get("/tenants", async (req, res, next) => {
  try {
    const rows = await Tenant.findAll({
      include: [
        { model: Subscription, include: [Plan] },
        { model: User, attributes: ["id", "name", "email", "role", "isActive"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json(rows);
  } catch (error) { return next(error); }
});

router.patch("/tenants/:id/status", async (req, res, next) => {
  try {
    const status = req.body.status;
    if (!["ACTIVE", "SUSPENDED", "EXPIRED"].includes(status)) return res.status(400).json({ message: "Status noto‘g‘ri" });
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Kompaniya topilmadi" });
    const previousStatus = tenant.status;
    await tenant.update({ status });
    await audit(req, "STATUS", "Tenant", tenant.id, { from: previousStatus, to: status });
    return res.json(tenant);
  } catch (error) { return next(error); }
});

router.post("/tenants/:id/extend", async (req, res, next) => {
  let transaction;
  try {
    const { planId, days } = req.body;
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Kompaniya topilmadi" });
    const [plan, current] = await Promise.all([
      planId ? Plan.findByPk(planId) : Promise.resolve(null),
      Subscription.findOne({ where: { tenantId: tenant.id }, order: [["endsAt", "DESC"]] }),
    ]);
    if (planId && !plan) return res.status(404).json({ message: "Tarif topilmadi" });
    if (planId && !plan.isActive) return res.status(400).json({ message: "Faolsiz tarifga obuna ulab bo‘lmaydi" });
    if (!planId && !current?.planId) return res.status(400).json({ message: "Obunani uzaytirish uchun tarif tanlang" });
    const duration = Number(days ?? plan?.durationDays);
    if (!Number.isInteger(duration) || duration < 1 || duration > 3650) return res.status(400).json({ message: "Muddat noto‘g‘ri" });
    const startsAt = current && new Date(current.endsAt) > new Date() ? new Date(current.endsAt) : new Date();
    const endsAt = new Date(startsAt.getTime() + duration * 86400000);

    transaction = await sequelize.transaction();
    await Subscription.update(
      { status: "CANCELLED" },
      { where: { tenantId: tenant.id, status: "ACTIVE" }, transaction },
    );
    const subscription = await Subscription.create({
      tenantId: tenant.id,
      planId: plan?.id || current.planId,
      startsAt,
      endsAt,
      status: "ACTIVE",
      lastReminderKey: null,
    }, { transaction });
    await tenant.update({ status: "ACTIVE" }, { transaction });
    await Notification.create({
      tenantId: tenant.id,
      title: "Obuna uzaytirildi",
      message: `Obunangiz ${duration} kunga uzaytirildi. Yangi tugash sanasi: ${endsAt.toLocaleDateString("uz-UZ")}`,
      type: "SUBSCRIPTION",
    }, { transaction });
    await transaction.commit();
    await audit(req, "EXTEND_SUBSCRIPTION", "Subscription", subscription.id, { tenantId: tenant.id, duration, startsAt, endsAt, planId: subscription.planId });
    return res.json({ message: "Obuna uzaytirildi", startsAt, endsAt, subscriptionId: subscription.id });
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback().catch(() => {});
    return next(error);
  }
});

router.post("/tenants/:id/notify", async (req, res, next) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Kompaniya topilmadi" });
    const title = String(req.body.title || "").trim();
    const message = String(req.body.message || "").trim();
    if (!title || title.length > 180 || !message || message.length > 10000) return res.status(400).json({ message: "Sarlavha (1–180) va matn (1–10000 belgi) kiriting" });
    const notification = await Notification.create({ tenantId: tenant.id, title, message, type: "WARNING" });
    await audit(req, "NOTIFY", "Tenant", tenant.id, { notificationId: notification.id, title });
    return res.status(201).json(notification);
  } catch (error) { return next(error); }
});

router.get("/plans", async (req, res, next) => {
  try { return res.json(await Plan.findAll({ order: [["price", "ASC"]] })); }
  catch (error) { return next(error); }
});
router.post("/plans", async (req, res, next) => {
  try {
    const payload = {
      name: String(req.body.name || "").trim(),
      durationDays: Number(req.body.durationDays),
      price: Number(req.body.price),
      currency: req.body.currency || "UZS",
      maxUsers: Number(req.body.maxUsers),
      maxBranches: Number(req.body.maxBranches),
      isActive: req.body.isActive !== false,
    };
    payload.currency = String(payload.currency).trim().toUpperCase();
    if (!payload.name || payload.name.length > 80 || !Number.isInteger(payload.durationDays) || payload.durationDays < 1 || payload.durationDays > 3650 || !Number.isFinite(payload.price) || payload.price < 0 || payload.price > 999999999999.99 || !/^[A-Z]{3}$/.test(payload.currency) || !Number.isInteger(payload.maxUsers) || payload.maxUsers < 1 || payload.maxUsers > 100000 || !Number.isInteger(payload.maxBranches) || payload.maxBranches < 1 || payload.maxBranches > 100000) return res.status(400).json({ message: "Tarif qiymatlarini tekshiring" });
    const plan = await Plan.create(payload);
    await audit(req, "CREATE", "Plan", plan.id, payload);
    return res.status(201).json(plan);
  } catch (error) { return next(error); }
});
router.patch("/plans/:id", async (req, res, next) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ message: "Tarif topilmadi" });
    const payload = {};
    for (const field of ["name", "durationDays", "price", "currency", "maxUsers", "maxBranches", "isActive"]) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }
    if (payload.name !== undefined) {
      payload.name = String(payload.name).trim();
      if (!payload.name || payload.name.length > 80) return res.status(400).json({ message: "Tarif nomi 1–80 belgi bo‘lishi kerak" });
    }
    if (payload.durationDays !== undefined) {
      payload.durationDays = Number(payload.durationDays);
      if (!Number.isInteger(payload.durationDays) || payload.durationDays < 1 || payload.durationDays > 3650) return res.status(400).json({ message: "Tarif davomiyligi 1–3650 kun bo‘lishi kerak" });
    }
    if (payload.price !== undefined) {
      payload.price = Number(payload.price);
      if (!Number.isFinite(payload.price) || payload.price < 0) return res.status(400).json({ message: "Tarif narxi noto‘g‘ri" });
    }
    if (payload.currency !== undefined) {
      payload.currency = String(payload.currency).trim().toUpperCase();
      if (!/^[A-Z]{3}$/.test(payload.currency)) return res.status(400).json({ message: "Valyuta 3 harfli kod bo‘lishi kerak" });
    }
    for (const field of ["maxUsers", "maxBranches"]) {
      if (payload[field] !== undefined) {
        payload[field] = Number(payload[field]);
        if (!Number.isInteger(payload[field]) || payload[field] < 1 || payload[field] > 100000) return res.status(400).json({ message: `${field} qiymati noto‘g‘ri` });
      }
    }
    if (payload.isActive !== undefined && typeof payload.isActive !== "boolean") return res.status(400).json({ message: "isActive boolean bo‘lishi kerak" });
    await plan.update(payload);
    await audit(req, "UPDATE", "Plan", plan.id, payload);
    return res.json(plan);
  } catch (error) { return next(error); }
});

module.exports = router;
