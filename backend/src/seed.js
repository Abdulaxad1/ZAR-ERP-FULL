const bcrypt = require("bcryptjs");
const { User, Plan } = require("./models");

async function seed() {
  const email = String(process.env.SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (email && password && !(await User.findOne({ where: { email } }))) {
    await User.create({
      name: "Platform Owner",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "SUPER_ADMIN",
      isActive: true,
    });
    console.log("Initial SUPER_ADMIN created:", email);
  }

  if (!(await Plan.count())) {
    await Plan.bulkCreate([
      { name: "Trial", durationDays: 7, price: 0, currency: "UZS", maxUsers: 3, maxBranches: 1 },
      { name: "Starter", durationDays: 30, price: 299000, currency: "UZS", maxUsers: 3, maxBranches: 1 },
      { name: "Business", durationDays: 30, price: 599000, currency: "UZS", maxUsers: 10, maxBranches: 3 },
      { name: "Enterprise", durationDays: 365, price: 5990000, currency: "UZS", maxUsers: 50, maxBranches: 10 },
    ]);
  }
}

module.exports = { seed };
