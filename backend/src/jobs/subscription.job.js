const cron = require("node-cron");
const { Subscription, Tenant, Notification, User } = require("../models");
const { sendMail } = require("../services/mailer");

function startSubscriptionJob() {
  cron.schedule("0 8 * * *", async () => {
    try {
      const now = new Date();
      const active = await Subscription.findAll({ where: { status: "ACTIVE" }, include: [Tenant], order: [["endsAt", "DESC"]] });
      const latestByTenant = new Map();
      for (const subscription of active) {
        const tenantId = subscription.tenantId;
        if (!latestByTenant.has(tenantId)) latestByTenant.set(tenantId, subscription);
        else await subscription.update({ status: "CANCELLED" });
      }
      for (const subscription of latestByTenant.values()) {
        const remaining = new Date(subscription.endsAt).getTime() - now.getTime();
        const days = Math.ceil(remaining / 86400000);
        const tenant = subscription.Tenant;
        if (!tenant) continue;
        if ([7, 3, 1].includes(days) && subscription.lastReminderKey !== String(days)) {
          const message = `${tenant.name}: ZAR ERP obunangiz tugashiga ${days} kun qoldi. Xizmat uzilmasligi uchun obunani uzaytiring.`;
          await Notification.create({ tenantId: tenant.id, title: `Obuna tugashiga ${days} kun qoldi`, message, type: "SUBSCRIPTION", channel: "IN_APP" });
          const owner = await User.findOne({ where: { tenantId: tenant.id, role: "COMPANY_ADMIN", isActive: true } });
          if (owner?.email) await sendMail(owner.email, "ZAR ERP — obuna eslatmasi", message);
          subscription.lastReminderKey = String(days);
          await subscription.save();
        }
        if (remaining <= 0) {
          subscription.status = "EXPIRED";
          await subscription.save();
          await Tenant.update({ status: "EXPIRED" }, { where: { id: tenant.id } });
          await Notification.create({ tenantId: tenant.id, title: "Obuna muddati tugadi", message: "Kompaniya hisobingiz vaqtincha bloklandi. Obunani yangilash uchun platforma administratoriga murojaat qiling.", type: "SUBSCRIPTION" });
        }
      }
    } catch (error) {
      console.error("Subscription job failed:", error);
    }
  });
}

module.exports = { startSubscriptionJob };
