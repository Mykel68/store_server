module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    model_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    serial_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    department: {
      type: DataTypes.ENUM(
        "video",
        "audio",
        "teleprompting",
        "streaming",
        "graphics",
        "others"
      ),
      allowNull: false,
    },
  });

  return Product;
};
