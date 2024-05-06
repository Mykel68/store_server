module.exports = (sequelize, DataTypes) => {
  const RegisteredEquipment = sequelize.define(
    "registeredEquipment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      model_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      model_number: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },
      product_class: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      manufacturer_id: {
        type: DataTypes.INTEGER,
      },
      power_rating: {
        type: DataTypes.STRING(45),
      },
      weight: {
        type: DataTypes.FLOAT,
      },
      dimensions: {
        type: DataTypes.STRING(100),
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "registered_equipment",
      timestamps: false,
    }
  );

  RegisteredEquipment.associate = (models) => {
    RegisteredEquipment.hasMany(models.Equipment, {
      foreignKey: "model_name",
      as: "equipment",
    });
  };

  return RegisteredEquipment;
};
