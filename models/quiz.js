// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  var q=sequelize.define('Quiz',
            { pregunta: {
            	type: DataTypes.STRING,
        		validate: {notEmpty: {msg:"-> Falta pregunta"}}
            	},
              respuesta: {
            	type: DataTypes.STRING,
        		validate: {notEmpty: {msg:"-> Falta respuesta"}}
            	},
              tema: {
            	type: DataTypes.STRING,
        		validate: {notEmpty: {msg:"-> Falta el tema de la pregunta"}
            			}
            		}

            });
  return q;
}