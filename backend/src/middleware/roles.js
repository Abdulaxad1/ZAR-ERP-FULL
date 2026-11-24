exports.allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Bu amal uchun ruxsat yo‘q" });
  }
  next();
};

exports.permission = (permission) => (req, res, next) => {
  if (req.user?.role === "COMPANY_ADMIN" || req.user?.role === "SUPER_ADMIN") return next();
  if (!req.user?.permissions?.includes(permission)) {
    return res.status(403).json({ message: "Ruxsat yetarli emas" });
  }
  next();
};
