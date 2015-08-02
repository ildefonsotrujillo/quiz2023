// Definicion del modelo de Tema

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tema',
            { id: {
            	type: DataTypes.STRING,
        		validate: {notEmpty: {msg:"-> Falta nombre del tema"}}
            	},
              descripcion: {
            	type: DataTypes.STRING,
        		validate: {notEmpty: {msg:"-> Falta la descripción del tema"}}
            	}
            });
}