
User = require("./models/user"),
Account = require("./models/account");
module.exports = seedDB
function seedDB(){
    User.remove({},function(err){
        if(err){
            console.log(err);
        } else{
            Account.remove({},function(err){
                if(err){
                    console.log(err);
                }
            })
        }
    })
}
