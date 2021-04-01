const express = require('express')
const app = express()
const port = 3000
const session = require('express-session') // yarn add express session
const CategoryController = require('../controllers/CategoryController');
const ArticleController = require('../controllers/ArticlesController');
const Articles = require("../controllers/Article");
const Category = require("../controllers/Category");
const Article = require('../controllers/Article');
const UserController = require('../controllers/UserControll');


app.set('view engine', 'ejs');
app.use(express.static('public'));

// session

app.use(session({
    secret: "secret",
    cookie: {maxAge: 30000}
}))


app.use('/',CategoryController);
app.use('/',ArticleController);
app.use('/',UserController);








app.get('/', (req, res) => {
    Article.findAll({
       order:[
           ['id', 'DESC']
       ],
       limit: 3
    }).then(articles=>{

        Category.findAll().then(categories =>{
            res.render('index',{articles:articles, categories:categories});
        })



       
    });
});


app.get('/:slug', (req, res) => {

    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articles=>{
        if(articles != undefined){
            Category.findAll().then(categories =>{
                res.render('article',{articles:articles, categories:categories});
            })
        }else{
            res.redirect('/');
        }
    }).catch(err=>{
        res.redirect('/');
    })
  
});

app.get('/category/:slug',(req,res)=>{

    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category=>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('index',{articles:category.articles, categories:categories});
            })
        }else{
            res.redirect('/');
        }
    }).catch(err=>{
        res.redirect('/');
    })
    


});

app.listen(port, () => console.log(`Example app listening on port port!`)) 