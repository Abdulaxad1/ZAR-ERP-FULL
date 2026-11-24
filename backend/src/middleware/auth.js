const jwt = require("jsonwebtoken");
const { Tenant, Subscription, User } = require("../models");

module.exports = async function auth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ message: "Token talab qilinadi" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ message: "Token noto‘g‘ri yoki muddati tugagan" });

    // Always use current database role/permissions so deactivation or permission
    // changes take effect immediately, including for already-issued JWTs.
    const currentUser = await User.findByPk(decoded.id, {
      attributes: ["id", "role", "tenantId", "permissions", "isActive"],
    });
    if (!currentUser || !currentUser.isActive) {
      return res.status(401).json({ message: "Foydalanuvchi faol emas. Qayta tizimga kiring." });
    }

    req.user = {
      id: currentUser.id,
      role: currentUser.role,
      tenantId: currentUser.tenantId,
      permissions: currentUser.permissions || [],
    };

    if (req.user.role !== "SUPER_ADMIN") {
      if (!req.user.tenantId) return res.status(403).json({ message: "Kompaniya hisobiga bog‘lanmagan" });
      const [tenant, subscription] = await Promise.all([
        Tenant.findByPk(req.user.tenantId),
        Subscription.findOne({
          where: { tenantId: req.user.tenantId, status: "ACTIVE" },
          order: [["endsAt", "DESC"]],
        }),
      ]);
      if (!tenant || tenant.status !== "ACTIVE" || !subscription || new Date(subscription.endsAt) < new Date()) {
        return res.status(402).json({
          code: "SUBSCRIPTION_REQUIRED",
          message: "Obuna muddati tugagan yoki faol emas. Platforma administratoriga murojaat qiling.",
        });
      }
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token noto‘g‘ri yoki muddati tugagan" });
  }
};
