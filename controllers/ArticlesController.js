
const express = require('express');
const router = express.Router();
const Category = require('./Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middleweres/adminAuth');


// Get
router.get('/admin/articles/new',adminAuth,(req,res)=>{
    Category.findAll().then(categories =>{
        res.render('admin/articles/new',{categories: categories });
    });
    
});

router.get('/admin/articles/',adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles =>{
        res.render('admin/articles/index',{articles:articles});
    })
  });

router.get('/admin/articles/edit/:id',adminAuth,(req, res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/articles');
    }

    Article.findByPk(id).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render('admin/articles/edit',{article:article, categories:categories});
            });
        }
    })

});

router.get('/articles/page/:num',adminAuth,(req,res)=>{

    var page = req.params.num;
    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) *3;
    }
    // findAndCountAll retorna todos os artigos e a quantidade deles
    Article.findAndCountAll({
        limit: 3,
        offset: offset,
        order:[
            ['id', 'DESC']
        ]
    }).then(articles =>{

        var next;

        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories=>{
            res.render('admin/articles/page',{result:result, categories:categories})
        })

    })
});







  // POst

router.post('/articles/save', function (req, res) {
    
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.caregory;


    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles/');
    })



});

router.post('/articles/delete',(req,res)=>{

    var id = req.body.id; 

    if(id != undefined){


        

            Article.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect('/admin/articles');

            })
            
        
        
    }else{
        res.redirect('/admin/articles');
    }
    

});

router.post('/articles/update',(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;

    Article.update({title:title, slug: slugify(title), body:body, categoryId:categoryId },{
        where:{
            id: id
        }
    }).then(()=>{
        res.redirect('/admin/articles');
    })
});





module.exports = router;

