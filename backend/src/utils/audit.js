const { AuditLog } = require("../models");

module.exports = async function writeAudit(req, action, entity, entityId, details = {}) {
  try {
    await AuditLog.create({
      tenantId: req.user?.tenantId || null,
      userId: req.user?.id || null,
      action,
      entity,
      entityId: String(entityId || ""),
      details,
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};
