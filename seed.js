
var User = require("./models/user"),
Account = require("./models/account"),
Employee = require("./models/employee"),
Customer = require("./models/customer");
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
}
