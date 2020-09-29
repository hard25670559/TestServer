import bodyParser from 'body-parser';
import express from 'express';
import * as articleController from './apis/articles';
import * as authController from './apis/users';
import * as authUtils from './utils/auth';
import * as ves from './apis/ves';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.get('/zm/api/monitors.json', ves.monitors);
router.post('/account/login', authController.login);
router.post('/users/login', authController.login);
router.get('/articles', articleController.getArticles);
router.get('/articles/title-exist/:title', articleController.articleTitleExist);

router.get('/article/:id', articleController.getArticle);
router.post(
  '/articles',
  authUtils.verifyTokenMiddleware,
  articleController.createArticle
);

router.delete(
  '/article/:id',
  authUtils.verifyTokenMiddleware,
  articleController.deleteArticle
);

router.put(
  '/article/:id',
  authUtils.verifyTokenMiddleware,
  articleController.updateArticle
);

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api', router);
app.listen(port);
console.log(`Dev server listening ${port}`);
