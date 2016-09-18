var Quandl = require("quandl");
var quandl = new Quandl();

var options = {
    auth_token: "t3kab3XsYYg6xiKTf1eT"
}
 
quandl.configure(options);

exports.getData = function(req, res){
    quandl.dataset({ source: "USDANASS", table: "NASS_TAXESPROPERTYREALESTATEOTHEREXPENSEMEASUREDIN" }, function(err, response){
        if(err)
            throw err;
     
        console.log(response);
        res.send(response);
    });
};