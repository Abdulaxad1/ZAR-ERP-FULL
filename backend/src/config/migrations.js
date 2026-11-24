const { DataTypes } = require("sequelize");
const { sequelize, Tenant, AuditLog, User } = require("../models");

// Additive-only schema updates for databases created by earlier ZAR ERP builds.
// No rows or tables are dropped. New Customer and Expense tables are created by sequelize.sync().
async function addColumnIfMissing(model, columnName, definition) {
  const queryInterface = sequelize.getQueryInterface();
  const tableName = model.getTableName();
  const columns = await queryInterface.describeTable(tableName);
  if (!columns[columnName]) {
    await queryInterface.addColumn(tableName, columnName, definition);
    console.log(`[migration] ${tableName}.${columnName} added`);
  }
}

async function runSafeMigrations() {
  await addColumnIfMissing(Tenant, "address", {
    type: DataTypes.STRING(240),
    allowNull: true,
  });
  await addColumnIfMissing(AuditLog, "userId", {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: User.getTableName(), key: "id" },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
}

module.exports = { runSafeMigrations };
