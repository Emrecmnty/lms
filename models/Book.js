const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Available', 
      allowNull: false
    },
    // YENİ EKLENEN ALAN: Kitabın hangi rafta olduğunu tutar
    shelf: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'A-1' // Eğer raf belirtilmezse varsayılan olarak A-1 rafı atanır
    }
  }, {
    timestamps: true,
    paranoid: true 
  });

  return Book;
};