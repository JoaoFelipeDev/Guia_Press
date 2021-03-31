const express = require('express')
const app = express()
const port = 3000
const CategoryController = require('../controllers/CategoryController');
const ArticleController = require('../controllers/ArticlesController');
const Articles = require("../controllers/Article");
const Category = require("../controllers/Category");


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use('/',CategoryController);
app.use('/',ArticleController);


app.listen(port, () => console.log(`Example app listening on port port!`)) 