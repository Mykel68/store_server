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
      model_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      manufacturer: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(45),
        // allowNull: false,
      },
      product_class: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      sub_class: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      abbreviation: {
        type: DataTypes.STRING(45),
        allowNull: true,
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
      store_code: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "equipment",
      timestamps: false,
    }
  );

  Equipment.associate = (models) => {
    Equipment.belongsTo(models.RegisteredEquipment, {
      foreignKey: "model_name",
      as: "registeredEquipment",
    });
  };

  return Equipment;
};
