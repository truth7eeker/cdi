const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cloneDeep = require('lodash.clonedeep');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

let points = 0;

const calcPoints = ({userAnswerID, correctID}) => {

   if (JSON.parse(userAnswerID) === correctID) {
      points = points + 1;
   }

   return points;
};

// send questions without answers
server.get('/questions', (req, res) => {
   try {
      const questions = router.db.get('questions').value();
      const copy = cloneDeep(questions);

      copy.map((ques) => ques.answers.map((answer) => delete answer.isCorrect));

      res.status(200).json(copy);

      points = 0
   } catch (error) {
      console.log(error);
   }
});

server.post('/answer', (req, res) => {
   try {
      const questions = router.db.get('questions').value();
      const { questionID, userAnswerID } = req.body;
      const currQues = questions.find((ques) => ques.id === JSON.parse(questionID));
      const correctID = currQues.answers.find((answer) => answer.isCorrect).id

      const result = calcPoints({ userAnswerID, correctID });

      res.status(200).json({correctID, result});

   } catch (error) {
      console.log(error);
   }
});


// Use default router
server.use(router);
server.listen(3000, () => {
   console.log('JSON Server is running');
});
