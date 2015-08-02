var express = require('express');
var router = express.Router();

//console.log("Llega aqui 1");
var quizController= require('../controllers/quiz_controller');
var commentController= require('../controllers/comment_controller');
var sessionController= require('../controllers/session_controller');


/* GET home page. */
//console.log("Llega aqui 7");
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comando con quizId
router.param('quizId', quizController.load); //autoload :quizId

//Definición de reutas de sesion
router.get('/login',    sessionController.new);
router.post('/login',   sessionController.create);
router.get('/logout',   sessionController.destroy);

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// Requieren autorización
router.get('/quizes/new' 				   ,sessionController.loginRequired,quizController.new);
router.post('/quizes/create' 			   ,sessionController.loginRequired,quizController.create);
router.get('/quizes/:quizId(\\d+)/edit'    ,sessionController.loginRequired,quizController.edit);
router.put('/quizes/:quizId(\\d+)'         ,sessionController.loginRequired,quizController.update);
router.delete('/quizes/:quizId(\\d+)'      ,sessionController.loginRequired,quizController.destroy);

// Definición de rutas de los comentarios de /quizes
router.get('/quizes/:quizId(\\d+)/comments/new', 	  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', 		  commentController.create);


/* GET Autores. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz', errors:[] });
});

module.exports = router;
