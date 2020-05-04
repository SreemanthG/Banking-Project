var express= require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
User = require("./models/user"),
Account = require("./models/account"),
seed = require("./seed")
seed();
var app = express();
mongoose.connect("mongodb://localhost/premierebank");
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.use(bodyParser.urlencoded({extended:true}));



app.get("/",function(req,res){
    res.render("home");
});

app.get("/index",function(req,res){
    User.find({},function(err,foundUser){
        if(err){
            console.log(err)
        } else{
            res.render("index",{user:foundUser});
        }
    })
})

app.get("/login",function(req,res){
    
res.render("login");
})

app.get("/signup",function(req,res){
    res.render("signup");
})

app.post("/signup",function(req,res){
   

   User.create(req.body.user,function(err,newlyCreated){
       if(err){
        console.log(err);
       } else{
        res.redirect("/index");
       }
   })
})
//Account

app.get("/profile",function(req,res){
    User.find({}).populate("account").exec(function(err,foundUser){
        if(err){
            console.log(err)
        } else{
            res.render("accounts/profile",{user:foundUser});

    }
    
})
})
app.get("/profile/new",function(req,res){
    res.render("accounts/new")
})
app.post("/profile",function(req,res){
   
    User.find({}).populate("account").exec(function(err,foundUser){
        if(err){
            console.log(err)
        } else{
           
            Account.create(req.body.account,function(err,newlyCreated){
                if(err){
                 console.log(err);
                } else{
                    foundUser[0].account.push(newlyCreated);
                    newlyCreated.save();
                    foundUser[0].save();
                    res.redirect("/profile");
                }
            })
            
        }
    })
   
 })
app.listen(3000,function(req,res){
    console.log("Hey!!, This website is working at port 3000");
})