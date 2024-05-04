module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define(
    "equipment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serial_number: {
        type: DataTypes.STRING(45),

        unique: true,
      },
      registered_equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      manufacturer: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      product_class: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      function_: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      store_item: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      purchase: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      vendor: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      tableName: "equipment",
      timestamps: false,
    }
  );

  Equipment.associate = (models) => {
    Equipment.belongsTo(models.RegisteredEquipment, {
      foreignKey: "registered_equipment_id",
      as: "registeredEquipment",
    });
  };

  return Equipment;
};
