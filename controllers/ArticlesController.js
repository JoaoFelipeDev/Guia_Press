const { response } = require('express');
const express = require('express');
const router = express.Router();
const Category = require('./Category');
const Article = require('./Article');
const slugify = require('slugify');


router.get('/admin/articles/new',(req,res)=>{
    Category.findAll().then(categories =>{
        res.render('admin/articles/new',{categories: categories });
    });
    
});


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

router.get('/admin/articles/', (req, res) => {
  res.send('Area de artigos')
})

module.exports = router;

