var Quandl = require("quandl");
var quandl = new Quandl();

var options = {
    auth_token: "t3kab3XsYYg6xiKTf1eT"
}
 
quandl.configure(options);

exports.getData = function(req, res){
    quandl.dataset({ source: "USDAERS", table: "USAGRIND" }, function(err, res2){
        if(err)
            throw err;
     
        console.log(res2);
        var response = JSON.parse(res2)        
        
        var column_names = response.dataset.column_names;
        var filteredData = [];
        
        for(var i=0; i<column_names.length; i++){
            column_names[i] = column_names[i].replace(/\s+/g, '');
        }
        
        for(var i=0; i<response.dataset.data.length; i++){
            var selection = column_names.indexOf(req.params.selection.replace(/\s+/g, ''));
            //console.log(selection);
            var date = response.dataset.data[i][0];
            var value = response.dataset.data[i][selection];
            filteredData.push({date: date, value: value});
        }
        
        console.log(filteredData);
        res.send(filteredData);
    });
};