var Quandl = require("quandl");
var quandl = new Quandl();

var options = {
    auth_token: "t3kab3XsYYg6xiKTf1eT"
}

quandl.configure(options);

exports.getData = function(req, res) {
    quandl.dataset({
        source: "ODA",
        table: "PORANG_USD"
    }, function(err, response) {
        if (err)
            throw err;

        console.log(response);
        res.send(response);
    });
};

 function findLineByLeastSquares(values_x, values_y) {
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var count = 0;

        /*
         * We'll use those variables for faster read/write access.
         */
        var x = 0;
        var y = 0;
        var values_length = values_x.length;

        if (values_length != values_y.length) {
            throw new Error('The parameters values_x and values_y need to have same size!');
        }

        /*
         * Nothing to do.
         */
        if (values_length === 0) {
            return [
                [],
                []
            ];
        }
        /*
         * Calculate the sum for each of the parts necessary.
         */
        for (var v = 0; v < values_length; v++) {
            x = values_x[v];
            y = values_y[v];
            sum_x += x;
            sum_y += y;
            sum_xx += x * x;
            sum_xy += x * y;
            count++;
        }

        /*
         * Calculate m and b for the formular:
         * y = x * m + b
         */
        var m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
        var b = (sum_y / count) - (m * sum_x) / count;

        /*
         * We will make the x and y result line now
         */
        var result_values_x = [];
        var result_values_y = [];
        values_x[values_x.length] = 1505730718000;
        values_x[values_x.length] = 1537266718000;
        values_x[values_x.length] = 1568802718000;
        values_x[values_x.length] = 1600425118000;

        for (var v = 0; v <values_length + 4; v++) {
            x = values_x[v];
            y = x * m + b;
            result_values_x.push(new Date(x));
            result_values_y.push(y);
            values_x[v] = new Date(values_x[v]);
        }
        values_y.push(result_values_y[result_values_x.length-1]);
        values_y.push(result_values_y[result_values_x.length-2]);
        values_y.push(result_values_y[result_values_x.length-3]);
        values_y.push(result_values_y[result_values_x.length-4]);
//for next monrth
//,[result_values_x[result_values_x.length-1],result_values_y[result_values_x.length-1]],[result_values_x[result_values_x.length-2],result_values_y[result_values_x.length-2]],[result_values_x[result_values_x.length-3],result_values_y[result_values_x.length-3]]
        return [values_x,values_y];
    }

exports.getFoodData = function(req, res) {
    var foods = {
        "Orange": "PORANG_USD",
        "Wheat": "PWHEAMT_USD",
        "Soybean": "PSOYB_USD",
        "Banana": "PBANSOP_USD",
        "Rice": "PRICENPQ_USD"
    };

    var selection = foods[req.params.food];

    quandl.dataset({
        source: "ODA",
        table: selection
    }, function(err, response) {
        if (err)
            throw err;

        var dataset = JSON.parse(response);
        //console.log(response.dataset);
        var values = dataset.dataset.data;
        var xVals = [];
        var yVals = [];
        console.log(values);
        for(var i = 0; i < values.length; i++){
            var myDate=values[i][0];
            var curDate = new Date(myDate).getTime();
            xVals.push(curDate);
            yVals.push(values[i][1]);
        }
        res.send(findLineByLeastSquares(xVals,yVals));
        /*var xVals = 0;
        var yVals = 0;
        var xSVals = 0;
        for(var i = 0; i < values.length; i++){
            var myDate=values[i][0];
            var curDate = new Date(myDate).getTime();
            xSVals += Math.pow(curDate,2);
            xVals += curDate;
            yVals += myDate;
        }
        
        res.send(((xVals*yVals) - (xVals*yVals))/(Math.pow(xVals,2) - xSVals));*/
        //res.send([xVals,yVals]);
    });

};
