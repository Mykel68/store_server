const dbConfig = require("../config/dbConfig");
const Sequelize = require("sequelize");
const { DataTypes } = Sequelize;

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.equipments = require("./equipmentModel")(sequelize, DataTypes);
db.registeredEquipments = require("./registeredEquipmentModel")(
  sequelize,
  DataTypes
);

// Define the association
db.registeredEquipments.hasMany(db.equipments, {
  foreignKey: "registered_equipment_id",
  as: "equipment",
});
db.equipments.belongsTo(db.registeredEquipments, {
  foreignKey: "registered_equipment_id",
  as: "registeredEquipment",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});

module.exports = db;
