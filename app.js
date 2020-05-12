var express= require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
Customer = require("./models/customer"),
Account = require("./models/account"),
passport = require("passport"),
localStrategy = require("passport-local"),
seed = require("./seed"),
sequential = require("sequential-ids"),
seqid = require("./models/seqid"),
Employee = require("./models/employee"),
User = require("./models/user"),
Benificiary = require("./models/benificiary"),
Transactions = require("./models/transactions"),
Checks = require("./models/checks");


var employeeRoutes =require("./routes/employee"),
customerRoutes = require("./routes/customer"),
accountRoutes = require("./routes/account"),
authRoutes = require("./routes/auth"),
benificiaryRoutes = require("./routes/benificiary"),
transactionRoutes = require("./routes/transactions"),
accstatementRoutes = require("./routes/accountstats"),
checkRoutes = require("./routes/check");

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


// // REPLICA SET

mongoose.connect("mongodb://localhost/premierebank");
// const uri = 'mongodb://Sreemanth:27017,Sreemanth:27018,Sreemanth:27019/premierebank';

// (async () => {
//     try {
//         await mongoose.connect(uri, { replicaSet: 'rs' , useNewUrlParser: true });
//         // const session = await mongoose.startSession();
//         // session.startTransaction();
        // Account.find({},function(err,doc){
        //     console.log(doc);
        // })
        
//     } catch (err) {
//       console.log('error: ' + err)
//     }
//   })()
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
    console.log(req.user)
    // res.locals.error= req.flash("error");
    // res.locals.success= req.flash("success");
    next();
})  

app.use(employeeRoutes);
app.use(accountRoutes);
app.use(authRoutes);
app.use(customerRoutes);
app.use(benificiaryRoutes);
app.use(transactionRoutes);
app.use(accstatementRoutes);
app.use(checkRoutes);


app.get("/",isLoggedIn,function(req,res){
    res.render("home");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

 app.listen(3000,function(req,res){
    console.log("Hey!!, This website is working at port 3000");
})

// app.get("/index",isLoggedIn,function(req,res){
//     User.find({},function(err,foundUser){
//         if(err){
//             console.log(err)
//         } else{
//             res.render("index",{user:foundUser});
//         }
//     })
// })

// //Auth
// app.get("/logout",function(req,res){
//     req.logout();
//     res.redirect("/login");
// })
// app.get("/login",function(req,res){
// res.render("login");
// })

// app.post("/login",passport.authenticate("local",
// { successRedirect:"/index",failureRedirect:"/login"
// }),function(req,res){
// })

// app.get("/signup",function(req,res){
//     res.render("signup");
// })

// app.post("/signup",function(req,res){

//    var newUser = new User({username:req.body.username,email:req.body.email,usertype:req.body.usertype});
//     User.register(newUser,req.body.password,function(err,user){
//         if(err){
//             console.log(err)
//             return res.render("signup");
//         }
//         if(req.body.usertype === "Customer"){
//             Customer.create(req.body.user,function(err,newlyCreated){
//                 if(err){
//                  console.log(err);
//                 } else{
                   
//                 newlyCreated.userid = user._id;
//                 newlyCreated.username = req.body.username;
//                 newlyCreated.email = req.body.email;
//                 newlyCreated.save();
//                 user.userid= newlyCreated._id,
//                 user.save();
//                 console.log(newlyCreated);
//                 console.log(user);
//                 passport.authenticate("local")(req,res,function(){
//                     console.log("hello")
//                     res.redirect("/index");

//                 })
//                 }
//             })
//         } else{
//             Employee.create(req.body.user,function(err,newlyCreated){
//                 if(err){
//                  console.log(err);
//                 } else{
//                     newlyCreated.userid = user._id;
//                 newlyCreated.username = req.body.username;
//                 newlyCreated.email = req.body.email;
//                 newlyCreated.save();
//                 user.userid= newlyCreated._id,
//                 user.save();
//                 console.log(newlyCreated);
//                 console.log(user);
//                 passport.authenticate("local")(req,res,function(){
//                     console.log("hello")
//                     res.redirect("/index");

//                 })
//                 }
//             })
//         }
       
         
//     })

  
// })
// //Account

// app.get("/profile",isLoggedIn,function(req,res){
//     if(req.user.usertype=="Customer"){
//     Customer.findById(req.user.userid).populate("account").exec(function(err,foundCustomer){
//         if(err){
//             console.log(err)
//         } else{

//             res.render("accounts/profile",{user:foundCustomer});

//     }
    
// })
// } else{
//     Employee.findById(req.user.userid,function(err,foundEmployee){
//         if(err){
//             console.log(err)
//         } else{
//             console.log(foundEmployee)
//             res.render("accounts/profile",{user:foundEmployee});
//     }
    
// })
// }
// })
// app.get("/profile/new",isLoggedIn,function(req,res){
//     res.render("accounts/new")
// })
// app.post("/profile",isLoggedIn,function(req,res){
//     Customer.findById(req.user.userid,function(err,foundCustomer){
//         if(err){
//             console.log(err)
//         } else{
//            console.log(foundCustomer);
//             Account.create(req.body.account,function(err,newlyCreated){
//                 if(err){
//                  console.log(err);
//                 } else{
//                     Account.count(function(err,c){
//                         if(err){
//                             console.log(err)
//                         }   else{
//                             newlyCreated.accountno = genid(c+1);
//                             newlyCreated.save();
//                             foundCustomer.account.push(newlyCreated);
//                             foundCustomer.save();
//                             console.log(newlyCreated);
//                             res.redirect("/profile");
//                         }
//                     })

//                 }
//             })
            
//         }
//     })
   
//  })

// Employee

 //Customer add

//  app.get("/customers",isLoggedIn,function(req,res){
//      Customer.find({},function(err,foundCustomers){
//          if(err){
//              console.log(err);
//          } else{
//             res.render("employee/customers",{customers:foundCustomers});

//          }
//      })
//  })

//  app.get("/customers/:id",isLoggedIn,function(req,res){
//      Customer.findById(req.params.id).populate("account").exec(function(err,foundCustomer){
//         if(err){
//             console.log(err);
//         } else{
//             res.render("employee/view",{customer:foundCustomer})
//         }
//      })
//  })

//  app.get("/customers/:id/:accid/edit",isLoggedIn,function(req,res){
//     Account.findById(req.params.id).populate("account").exec(function(err,foundCustomer){
//        if(err){
//            console.log(err);
//        } else{
//         Account.findById(req.params.accid,function(err,foundAccount){
//             if(err){
//                 console.log(err);
//             } else{
//                 res.render("employee/edit",{account:foundAccount})
//             }
//          })
//        }
//     })
// })

// //Customer Req

// app.get("/requests",isLoggedIn,function(req,res){
//     Account.find({isAccepted:false},function(err,foundAccounts){
//         if(err){
//             console.log(err)
//         } else{
//             console.log("found");
//             console.log(foundAccounts);
//             res.render("employee/request",{accounts:foundAccounts})
//         }
//     })
// })


// app.get("/requests/:id",isLoggedIn,function(req,res){
//     Account.findByIdAndUpdate(req.params.id,{isAccepted:true},function(err,foundAccount){
//         if(err){
//             console.log(err)
//         } else{
//             console.log(foundAccount)
//             res.redirect("/requests")
//         }
//     })
// })
