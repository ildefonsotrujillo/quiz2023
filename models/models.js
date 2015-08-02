var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);
// Importar definicion de la tabla Tema
var quiz_path = path.join(__dirname,'tema');
var Tema = sequelize.import(quiz_path);
// Importar definicion de la tabla Comment
var quiz_path = path.join(__dirname,'comment');
var Comment = sequelize.import(quiz_path);

Quiz.belongsTo(Tema, {as: 'Tema', foreignKey: 'tema', targetKey: 'id'});
Tema.hasMany(Quiz, {as: 'preguntas', foreignKey: 'id', targetKey: 'tema'});
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Tema = Tema; // exportar tabla Tema
exports.Comment = Comment; // exportar tabla Tema

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
    Tema.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Tema.bulkCreate( 
        [ {id: 'otro',   descripcion: 'Otro'},
          {id: 'humanidades', descripcion: 'Humanidades'},
          {id: 'ocio',   descripcion: 'Ocio'},
          {id: 'ciencia',   descripcion: 'Ciencia'},
          {id: 'tecnologia',   descripcion: 'Tecnología'}
        ]
      ).then(function(){console.log('Tabla Temas inicializada')});
    };
  });
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.bulkCreate( 
        [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', tema: 'humanidades'},
          {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'humanidades'}
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  });
  

});