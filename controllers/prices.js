var Quandl = require("quandl");
var quandl = new Quandl();
 
var options = {
    auth_token: "t3kab3XsYYg6xiKTf1eT"
}
 
quandl.configure(options);

exports.getData = function(req, res){
    quandl.dataset({ source: "ODA", table: "PORANG_USD" }, function(err, response){
        if(err)
            throw err;
     
        console.log(response);
        res.send(response);
    });
};

exports.getFoodData = function(req, res){
    var foods = {
        "Orange": "PORANG_USD",
        "Wheat": "PWHEAMT_USD",
        "Soybean": "PSOYB_USD",
        "Banana": "PBANSOP_USD",
        "Rice": "PRICENPQ_USD"
    };
    
    var selection = foods[req.params.food];
    
    quandl.dataset({source: "ODA", table: selection}, function(err, response){
        if(err)
            throw err;
        
        var dataset = JSON.parse(response);
        //console.log(response.dataset);
        var values = dataset.dataset.data;
        var xVals = 0;
        var yVals = 0;
        var xSVals = 0;
        for(var i = 0; i < values.length; i++){
            var myDate=values[i][0];
            var curDate = new Date(myDate).getTime();
            xSVals += Math.pow(curDate,2);
            xVals += curDate;
            yVals += myDate;
        }
        
        res.send(((xVals*yVals) - (xVals*yVals))/(Math.pow(xVals,2) - xSVals));
        //res.send([xVals,yVals]);
    }); 
};
