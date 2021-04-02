const express = require('express')
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

router.use (express.urlencoded ({ extended: true })); // substui o body-parser
router.use (express.json());

// get
router.get('/admin/users',(req,res)=>{

    User.findAll().then(users=>{
        res.render('admin/users/list',{users:users});
    })
});

router.get('/admin/users/create',(req,res)=>{
    res.render('admin/users/create');
    });

router.get('/login',(req,res)=>{
    res.render('admin/users/login');
});

router.get('/logout',(req,res)=>{
    req.session.user = undefined;
    res.redirect('/')
});






//post

router.post('/admin/users/signup',(req,res)=>{
    
    var email = req.body.email;
    var password = req.body.password;

    //vericar se ja tem esse email cadastrado no db

    User.findOne({
        where:{
            email: email
        }
    }).then(user=>{
       
        if(user == undefined){
            

            // crypting password -- yarn add bcryptjs
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password,salt);

            User.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect('/');
            })



        }else{
            
            res.redirect('admin/users/create')

        }
    })



    

});

router.post('/authenticate',(req,res)=>{

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{ email: email}}).then(user=>{

      if(user != undefined){
            //validar senha
        var correct = bcrypt.compareSync(password,user.password);

        if(correct){
            req.session.user = {
                id: user.id,
                email: user.email

            }

            res.redirect('/admin/articles');
           

        }else{
            res.redirect('/login');
        }

      }else{
          res.redirect('/login');
      }
    })


})


module.exports = router;





