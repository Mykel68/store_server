module.exports = (sequelize, DataTypes) => {
  const Manufacturer = sequelize.define("Manufacturer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
        country_code: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });

  return Manufacturer;
};
