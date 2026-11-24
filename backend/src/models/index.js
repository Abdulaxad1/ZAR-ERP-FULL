const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const uuid = { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true };

const Tenant = sequelize.define("Tenant", {
  id: { ...uuid },
  name: { type: DataTypes.STRING(160), allowNull: false },
  slug: { type: DataTypes.STRING(180), allowNull: false, unique: true },
  phone: DataTypes.STRING(40),
  email: DataTypes.STRING(160),
  address: DataTypes.STRING(240),
  status: { type: DataTypes.ENUM("ACTIVE", "SUSPENDED", "EXPIRED"), defaultValue: "ACTIVE" },
  locale: { type: DataTypes.ENUM("uz", "ru"), defaultValue: "uz" },
});

const User = sequelize.define("User", {
  id: { ...uuid },
  name: { type: DataTypes.STRING(140), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"), allowNull: false },
  permissions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const Plan = sequelize.define("Plan", {
  id: { ...uuid },
  name: { type: DataTypes.STRING(80), allowNull: false },
  durationDays: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: "UZS" },
  maxUsers: { type: DataTypes.INTEGER, defaultValue: 5 },
  maxBranches: { type: DataTypes.INTEGER, defaultValue: 1 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const Subscription = sequelize.define("Subscription", {
  id: { ...uuid },
  startsAt: { type: DataTypes.DATE, allowNull: false },
  endsAt: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM("ACTIVE", "EXPIRED", "CANCELLED"), defaultValue: "ACTIVE" },
  lastReminderKey: { type: DataTypes.STRING(20), allowNull: true },
});

const Notification = sequelize.define("Notification", {
  id: { ...uuid },
  title: { type: DataTypes.STRING(180), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM("INFO", "WARNING", "SUBSCRIPTION", "SYSTEM"), defaultValue: "INFO" },
  channel: { type: DataTypes.ENUM("IN_APP", "EMAIL"), defaultValue: "IN_APP" },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  metadata: { type: DataTypes.JSONB, defaultValue: {} },
});

const Product = sequelize.define("Product", {
  id: { ...uuid },
  name: { type: DataTypes.STRING(160), allowNull: false },
  sku: { type: DataTypes.STRING(60), allowNull: false },
  category: { type: DataTypes.STRING(60), allowNull: false },
  metal: { type: DataTypes.ENUM("gold", "silver", "platinum"), defaultValue: "gold" },
  purity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 585 },
  grossWeight: { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
  stoneWeight: { type: DataTypes.DECIMAL(12, 3), defaultValue: 0 },
  stockPieces: { type: DataTypes.INTEGER, defaultValue: 0 },
  costPrice: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  salePrice: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  barcode: DataTypes.STRING(100),
});

const Sale = sequelize.define("Sale", {
  id: { ...uuid },
  invoiceNo: { type: DataTypes.STRING(40), allowNull: false },
  customerName: DataTypes.STRING(160),
  subtotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  discount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  paymentMethod: { type: DataTypes.ENUM("cash", "card", "transfer", "debt"), allowNull: false },
});

const SaleItem = sequelize.define("SaleItem", {
  id: { ...uuid },
  productId: { type: DataTypes.UUID, allowNull: false },
  productName: { type: DataTypes.STRING(160), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  lineTotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
});

const MetalBatch = sequelize.define("MetalBatch", {
  id: { ...uuid },
  batchNo: { type: DataTypes.STRING(60), allowNull: false },
  metal: { type: DataTypes.ENUM("gold", "silver", "platinum"), allowNull: false, defaultValue: "gold" },
  purity: { type: DataTypes.INTEGER, allowNull: false },
  grossGrams: { type: DataTypes.DECIMAL(14, 3), allowNull: false },
  availableGrams: { type: DataTypes.DECIMAL(14, 3), allowNull: false },
  costPerGram: { type: DataTypes.DECIMAL(14, 2), allowNull: false, defaultValue: 0 },
  supplier: DataTypes.STRING(160),
  notes: DataTypes.TEXT,
});

const WorkshopOrder = sequelize.define("WorkshopOrder", {
  id: { ...uuid },
  orderNo: { type: DataTypes.STRING(50), allowNull: false },
  productName: { type: DataTypes.STRING(160), allowNull: false },
  customerName: DataTypes.STRING(160),
  metal: { type: DataTypes.ENUM("gold", "silver", "platinum"), allowNull: false },
  purity: { type: DataTypes.INTEGER, allowNull: false },
  plannedGrams: { type: DataTypes.DECIMAL(14, 3), allowNull: false },
  status: { type: DataTypes.ENUM("IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"), defaultValue: "IN_PROGRESS" },
  dueDate: DataTypes.DATEONLY,
  notes: DataTypes.TEXT,
});

const Customer = sequelize.define("Customer", {
  id: { ...uuid },
  name: { type: DataTypes.STRING(160), allowNull: false },
  phone: DataTypes.STRING(40),
  email: { type: DataTypes.STRING(160), validate: { isEmail: true } },
  address: DataTypes.STRING(240),
  notes: DataTypes.TEXT,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const Expense = sequelize.define("Expense", {
  id: { ...uuid },
  category: { type: DataTypes.STRING(100), allowNull: false },
  description: DataTypes.STRING(240),
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  paymentMethod: { type: DataTypes.ENUM("cash", "card", "transfer"), defaultValue: "cash" },
  incurredAt: { type: DataTypes.DATEONLY, allowNull: false },
});

const AuditLog = sequelize.define("AuditLog", {
  id: { ...uuid },
  action: { type: DataTypes.STRING(100), allowNull: false },
  entity: DataTypes.STRING(100),
  entityId: DataTypes.STRING(100),
  details: { type: DataTypes.JSONB, defaultValue: {} },
  userId: DataTypes.UUID,
});

Tenant.hasMany(User, { foreignKey: { name: "tenantId", allowNull: true } });
User.belongsTo(Tenant, { foreignKey: "tenantId" });
Tenant.hasMany(Subscription, { foreignKey: "tenantId" });
Subscription.belongsTo(Tenant, { foreignKey: "tenantId" });
Plan.hasMany(Subscription, { foreignKey: "planId" });
Subscription.belongsTo(Plan, { foreignKey: "planId" });
Tenant.hasMany(Notification, { foreignKey: "tenantId" });
Notification.belongsTo(Tenant, { foreignKey: "tenantId" });
Tenant.hasMany(Product, { foreignKey: "tenantId" });
Product.belongsTo(Tenant, { foreignKey: "tenantId" });
Tenant.hasMany(Sale, { foreignKey: "tenantId" });
Sale.belongsTo(Tenant, { foreignKey: "tenantId" });
Sale.hasMany(SaleItem, { as: "items", foreignKey: "saleId", onDelete: "CASCADE" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });
Tenant.hasMany(MetalBatch, { foreignKey: "tenantId" });
MetalBatch.belongsTo(Tenant, { foreignKey: "tenantId" });
Tenant.hasMany(WorkshopOrder, { foreignKey: "tenantId" });
WorkshopOrder.belongsTo(Tenant, { foreignKey: "tenantId" });
MetalBatch.hasMany(WorkshopOrder, { foreignKey: "metalBatchId" });
WorkshopOrder.belongsTo(MetalBatch, { foreignKey: "metalBatchId" });
Tenant.hasMany(Customer, { foreignKey: "tenantId" });
Customer.belongsTo(Tenant, { foreignKey: "tenantId" });
Tenant.hasMany(Expense, { foreignKey: "tenantId" });
Expense.belongsTo(Tenant, { foreignKey: "tenantId" });
Tenant.hasMany(AuditLog, { foreignKey: "tenantId" });
AuditLog.belongsTo(Tenant, { foreignKey: "tenantId" });
User.hasMany(AuditLog, { foreignKey: "userId" });
AuditLog.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  Tenant,
  User,
  Plan,
  Subscription,
  Notification,
  Product,
  Sale,
  SaleItem,
  MetalBatch,
  WorkshopOrder,
  Customer,
  Expense,
  AuditLog,
};
