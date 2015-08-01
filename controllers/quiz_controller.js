var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz=quiz;
				next();
			} else{ next(new Error('No existe quizId=' + quizId));}

		}
	).catch(function(error){next(error);});
};


// GET /quizes
exports.index = function(req, res) {
  var busqueda="";
  var texto="Resultado búsqueda: ";
  console.log(req.query.search);
  if(req.query.search){
  	busqueda=req.query.search;
  	busqueda.replace(" ","%");
  	busqueda="%"+busqueda+"%";
  	console.log(busqueda)
    models.Quiz.findAll({where: ["pregunta like ?", busqueda]}).then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, search: texto+req.query.search});
    }).catch(function(error){next(error);});	
  }else{
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, search: ""});
    }).catch(function(error){next(error);});	
  }

  
};

//console.log("Llega aqui quiz1")
// GET /quizes/:id
exports.show = function(req, res) {
      res.render('quizes/show', { quiz: req.quiz});
};

//console.log("Llega aqui quiz2")
// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado='Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado='Correcto';
    } 
    res.render('quizes/answer', 
                 { quiz: req.quiz, respuesta: resultado });
};