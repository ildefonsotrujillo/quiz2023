var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	models.Quiz.find({
		        		where: {id: Number(quizId)},
		        		order: 'Comments.updatedAt DESC',
    	        		include:[{
    	        			model: models.Comment,
    	        		    }]
    	         	})
	   .then(function(quiz){
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
  var s="";
  console.log(req.query.search);

  if(req.query.search){
  	s=req.query.search;
  	busqueda=req.query.search;
  	busqueda.replace(" ","%");
  	busqueda="%"+busqueda+"%";
  }else{
    busqueda="%"
  }
  console.log(busqueda);
  models.Quiz.findAll({where: ["pregunta like ?", busqueda], 
    	                 order: 'tema',
    	                 include:[{model: models.Tema,
    	                           as: 'Tema'}
    	                         ]
    	                 }).then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, search: texto+s, errors:[]});
    }).catch(function(error){next(error);});	
};

//console.log("Llega aqui quiz1")
// GET /quizes/:id
exports.show = function(req, res) {
      res.render('quizes/show', { quiz: req.quiz, errors:[]});
};

//console.log("Llega aqui quiz2")
// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado='Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado='Correcto';
    } 
    res.render('quizes/answer', 
                 { quiz: req.quiz, respuesta: resultado , errors:[]});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz=models.Quiz.build(
		{pregunta: "", respuesta: "", tema:"otro"}
	);
	
	models.Tema.findAll().then(function(temas) {
      res.render('quizes/new', {quiz: quiz, temas: temas, errors:[]});
    }).catch(function(error){next(error);});	
    
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz
  .validate()
  .then(
  	function(err){
  		if(err){
  			res.render('quizes/new',{quiz: quiz, errors: err.errors})
  		}else{
  			quiz
  			.save({fields: ["pregunta", "respuesta", "tema"]})
  			.then(function(){res.redirect('/quizes');})
  			// res.redirect: Redirección HTTP a lista de preguntas
  		}
  	}
  );   
};

// GET /quizes/:id
exports.edit = function(req, res) {
	var quiz=req.quiz;

    models.Tema.findAll().then(function(temas) {
      res.render('quizes/edit', {quiz: quiz, temas: temas, errors:[]});
    }).catch(function(error){next(error);});

      //res.render('quizes/edit', { quiz: quiz, errors:[]});
};


// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;


  req.quiz
  .validate()
  .then(
  	function(err){
  		if(err){
  			console.log("Update-Errores");
  			models.Tema.findAll().then(function(temas) {
    		  		res.render('quizes/edit', {quiz: quiz, temas: temas, errors:[]});
    			}).catch(function(error){next(error);});
  			//res.render('quizes/edit',{quiz: req.quiz, errors: err.errors})
  		}else{
  			console.log("Update-save");
  			req.quiz
  			.save({fields: ["pregunta", "respuesta", "tema"]})
  			.then(function(){res.redirect('/quizes');})
  			// res.redirect: Redirección HTTP a lista de preguntas
  		}
  	}
  );   
};


// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy()
	.then(function(){
		res.redirect('/quizes');
	 }
	).catch(function(error){next(error)});
};