var express = require('express');
var router = express.Router(),
Customer = require("../models/customer"),
Account = require("../models/account"),
User = require("../models/user"),
Employee = require("../models/employee");
router.get("/emp",isLoggedIn,function(req,res){
    
    res.redirect("/emp/index")
 });
router.get("/emp/index",isLoggedIn,function(req,res){
    User.find({},function(err,foundUser){
        if(err){
            console.log(err)
        } else{
            res.render("index",{user:foundUser});
        }
    })
})

router.get("/emp/customers",isLoggedIn,function(req,res){
    Customer.find({},function(err,foundCustomers){
        if(err){
            console.log(err);
        } else{
           res.render("employee/customers",{customers:foundCustomers});

        }
    })
})

router.get("/emp/customers/:id",isLoggedIn,function(req,res){
    Customer.findById(req.params.id).populate("account").exec(function(err,foundCustomer){
       if(err){
           console.log(err);
       } else{
           res.render("employee/view",{customer:foundCustomer})
       }
    })
})

router.get("/emp/customers/:id/:accid/edit",isLoggedIn,function(req,res){
   Account.findById(req.params.id).populate("account").exec(function(err,foundCustomer){
      if(err){
          console.log(err);
      } else{
       Account.findById(req.params.accid,function(err,foundAccount){
           if(err){
               console.log(err);
           } else{
               res.render("employee/edit",{account:foundAccount})
           }
        })
      }
   })
})

//Customer Req

router.get("/emp/requests",isLoggedIn,function(req,res){
   Account.find({isAccepted:false},function(err,foundAccounts){
       if(err){
           console.log(err)
       } else{
           console.log("found");
           console.log(foundAccounts);
           res.render("employee/request",{accounts:foundAccounts})
       }
   })
})


router.get("/emp/requests/:id",isLoggedIn,function(req,res){
   Account.findByIdAndUpdate(req.params.id,{isAccepted:true},function(err,foundAccount){
       if(err){
           console.log(err)
       } else{
           console.log(foundAccount)
           res.redirect("/emp/requests")
       }
   })
})

router.get("/emp/profile",isLoggedIn,function(req,res){
    if(req.user.usertype=="Customer"){
    Customer.findById(req.user.userid).populate("account").exec(function(err,foundCustomer){
        if(err){
            console.log(err)
        } else{

            res.render("accounts/profile",{user:foundCustomer});

    }
    
})
} else{
    Employee.findById(req.user.userid,function(err,foundEmployee){
        if(err){
            console.log(err)
        } else{
            console.log(foundEmployee)
            res.render("accounts/profile",{user:foundEmployee});
    }
    
})
}
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;