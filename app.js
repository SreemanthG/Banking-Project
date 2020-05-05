var express= require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
Customer = require("./models/customer"),
Account = require("./models/account"),
passport = require("passport");
localStrategy = require("passport-local");
seed = require("./seed"),
sequential = require("sequential-ids"),
seqid = require("./models/seqid"),
Employee = require("./models/employee"),
User = require("./models/user");
function preceedzero(n){
    var s = n+"";
    while (s.length < 4) s = "0" + s;
    return s;
}
function genid(n){
    var s = "2020"+preceedzero(n);
    return s;
}

// seed()
var app = express();



mongoose.connect("mongodb://localhost/premierebank");
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.use(bodyParser.urlencoded({extended:true}));


app.use(require("express-session")({
    secret: "This is a secret code for bank",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    // console.log(req.user)
    // res.locals.error= req.flash("error");
    // res.locals.success= req.flash("success");
    next();
})  


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

//Auth
app.get("/login",function(req,res){
res.render("login");
})

app.post("/login",passport.authenticate("local",
{ successRedirect:"/index",failureRedirect:"/login"
}),function(req,res){
})

app.get("/signup",function(req,res){
    res.render("signup");
})

app.post("/signup",function(req,res){

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
                    res.redirect("/index");

                })
                }
            })
        } else{
            Employee.create(req.body.user,function(err,newlyCreated){
                if(err){
                 console.log(err);
                } else{
                    newlyCreated.userid = user._id;
                    newlyCreated.save();
                    passport.authenticate("local")(req,res,function(){
                        res.redirect("/index");
    
                    })
                }
            })
        }
       
         
    })

  
})
//Account

app.get("/profile",function(req,res){
    Customer.findById(req.user.userid).populate("account").exec(function(err,foundCustomer){
        if(err){
            console.log(err)
        } else{

            res.render("accounts/profile",{customer:foundCustomer});

    }
    
})
})
app.get("/profile/new",function(req,res){
    res.render("accounts/new")
})
app.post("/profile",function(req,res){
    Customer.findById(req.user.userid,function(err,foundCustomer){
        if(err){
            console.log(err)
        } else{
           console.log(foundCustomer);
            Account.create(req.body.account,function(err,newlyCreated){
                if(err){
                 console.log(err);
                } else{
                    Account.count(function(err,c){
                        if(err){
                            console.log(err)
                        }   else{
                            newlyCreated.accountno = genid(c+1);
                            newlyCreated.save();
                            foundCustomer.account.push(newlyCreated);
                            foundCustomer.save();
                            console.log(newlyCreated);
                            res.redirect("/profile");
                        }
                    })

                }
            })
            
        }
    })
   
 })
app.listen(3000,function(req,res){
    console.log("Hey!!, This website is working at port 3000");
})