
var User = require("./models/user"),
Customer = require("./models/customer"),
Account = require("./models/account"),
Employee = require("./models/employee"),
Transactions = require("./models/transactions"),
Checks = require("./models/checks"),
Benificiary = require("./models/benificiary");
module.exports = seedDB
function seedDB(){
    User.remove({},function(err){
        if(err){
            console.log(err);
        } else{
           
        }
    })
    Account.remove({},function(err){
        if(err){
            
        }
    })
    Customer.remove({},function(err){
        if(err){
            
        }
    })
    Employee.remove({},function(err){
        if(err){
            console.log(err);
        }
    })
    Transactions.remove({},function(err){
        if(err){
            console.log(err);
        }
    })
    Checks.remove({},function(err){
        if(err){
            console.log(err);
        }
    })
    Benificiary.remove({},function(err){
        if(err){
            console.log(err);
        }
    })
}
