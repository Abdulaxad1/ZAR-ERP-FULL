const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const Joi = require("joi");
const { sequelize, Tenant, User, Plan, Subscription } = require("../models");
const auth = require("../middleware/auth");
const { allow } = require("../middleware/roles");
const audit = require("../utils/audit");

const employeePermissions = [
  "products:read", "products:create", "products:update", "products:delete",
  "sales:read", "sales:create", "inventory:read", "inventory:create",
  "workshop:read", "workshop:create", "workshop:update",
  "customers:read", "customers:create", "customers:update", "customers:delete",
  "expenses:create", "expenses:update", "expenses:delete",
];

const registerSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(160).required(),
  name: Joi.string().trim().min(2).max(140).required(),
  email: Joi.string().email().max(160).required(),
  password: Joi.string().min(8).max(100).required(),
  phone: Joi.string().allow("").max(40),
});

router.post("/register", async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: true, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });
    const email = value.email.toLowerCase();
    if (await User.findOne({ where: { email } })) return res.status(409).json({ message: "Bu email ro‘yxatdan o‘tgan" });
    const plan = await Plan.findOne({ where: { isActive: true }, order: [["price", "ASC"]] });
    if (!plan) return res.status(503).json({ message: "Hozircha faol tarif mavjud emas" });

    const result = await sequelize.transaction(async (transaction) => {
      const baseSlug = slugify(value.companyName, { lower: true, strict: true }) || "company";
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
      const tenant = await Tenant.create({ name: value.companyName, slug, phone: value.phone, email }, { transaction });
      const user = await User.create({
        name: value.name,
        email,
        passwordHash: await bcrypt.hash(value.password, 12),
        role: "COMPANY_ADMIN",
        tenantId: tenant.id,
      }, { transaction });
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + Number(plan.durationDays) * 86400000);
      await Subscription.create({ tenantId: tenant.id, planId: plan.id, startsAt, endsAt }, { transaction });
      return { tenant, user };
    });

    return res.status(201).json({
      message: "Kompaniya yaratildi. 7 kunlik sinov tarifi faollashtirildi.",
      tenant: { id: result.tenant.id, name: result.tenant.name },
      user: { id: result.user.id, name: result.user.name },
    });
  } catch (error) { return next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ where: { email }, include: [Tenant] });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Email yoki parol noto‘g‘ri" });
    }

    let subscription = null;
    if (user.role !== "SUPER_ADMIN") {
      subscription = await Subscription.findOne({
        where: { tenantId: user.tenantId, status: "ACTIVE" },
        order: [["endsAt", "DESC"]],
        include: [Plan],
      });
      if (!subscription || new Date(subscription.endsAt) < new Date() || user.Tenant?.status !== "ACTIVE") {
        return res.status(402).json({
          code: "SUBSCRIPTION_REQUIRED",
          message: "Obuna muddati tugagan. Platforma administratoriga murojaat qiling.",
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, tenantId: user.tenantId, permissions: user.permissions || [] },
      process.env.JWT_SECRET,
      { expiresIn: "12h" },
    );
    if (!subscription && user.tenantId) {
      subscription = await Subscription.findOne({ where: { tenantId: user.tenantId }, order: [["endsAt", "DESC"]], include: [Plan] });
    }
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, tenant: user.Tenant?.name, locale: user.Tenant?.locale || "uz", permissions: user.permissions || [] },
      subscription: subscription ? { endsAt: subscription.endsAt, status: subscription.status, plan: subscription.Plan?.name } : null,
    });
  } catch (error) { return next(error); }
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { include: [Tenant], attributes: { exclude: ["passwordHash"] } });
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    return res.json(user);
  } catch (error) { return next(error); }
});

// Eski frontend versiyalari bilan moslik uchun qoldirilgan endpoint.
router.post("/employees", auth, allow("COMPANY_ADMIN"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const permissions = Array.isArray(req.body.permissions) ? [...new Set(req.body.permissions)] : [];
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim();
    if (normalizedName.length < 2 || normalizedName.length > 140 || !/^\S+@\S+\.\S+$/.test(normalizedEmail) || normalizedEmail.length > 160 || typeof password !== "string" || password.length < 8 || password.length > 100) return res.status(400).json({ message: "Ism (2–140), email va parol (8–100 belgi) kiriting" });
    if (permissions.some((item) => !employeePermissions.includes(item))) return res.status(400).json({ message: "Noto‘g‘ri ruxsat tanlandi" });
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) return res.status(409).json({ message: "Bu email band" });
    const [count, sub] = await Promise.all([
      User.count({ where: { tenantId: req.user.tenantId } }),
      Subscription.findOne({ where: { tenantId: req.user.tenantId, status: "ACTIVE" }, include: [Plan], order: [["endsAt", "DESC"]] }),
    ]);
    if (sub?.Plan && count >= sub.Plan.maxUsers) return res.status(403).json({ message: "Tarifdagi xodimlar limiti tugagan" });
    const user = await User.create({ name: normalizedName, email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), role: "EMPLOYEE", tenantId: req.user.tenantId, permissions });
    await audit(req, "CREATE", "User", user.id, { name: user.name, email: user.email, permissions });
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, permissions: user.permissions });
  } catch (error) { return next(error); }
});

module.exports = router;
