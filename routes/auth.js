var express = require('express');
var router = express.Router(),
passport = require("passport"),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee");
//Auth
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
})
router.get("/login",function(req,res){
res.render("login");
})

router.post("/login",passport.authenticate("local",
{ successRedirect:"/",failureRedirect:"/login"
}),function(req,res){
})

router.get("/signup",function(req,res){
    res.render("signup");
})

router.post("/signup",function(req,res){

   var newUser = new User({username:req.body.username,email:req.body.email,usertype:req.body.usertype});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.render("signup");
        }
        if(req.body.usertype === "Customer"){
            Customer.create(req.body.user,function(err,newlyCreated){
                if(err){
                 console.log(err);
                } else{
                   
                newlyCreated.userid = user._id;
                newlyCreated.username = req.body.username;
                newlyCreated.email = req.body.email;
                newlyCreated.save();
                user.userid= newlyCreated._id,
                user.save();
                console.log(newlyCreated);
                console.log(user);
                passport.authenticate("local")(req,res,function(){
                    console.log("hello")
                    res.redirect("cus/index");

                })
                }
            })
        } else{
            Employee.create(req.body.user,function(err,newlyCreated){
                if(err){
                 console.log(err);
                } else{
                    newlyCreated.userid = user._id;
                newlyCreated.username = req.body.username;
                newlyCreated.email = req.body.email;
                newlyCreated.save();
                user.userid= newlyCreated._id,
                user.save();
                console.log(newlyCreated);
                console.log(user);
                passport.authenticate("local")(req,res,function(){
                    console.log("hello")
                    res.redirect("emp/index");

                })
                }
            })
        }
       
         
    })

  
})

module.exports = router;