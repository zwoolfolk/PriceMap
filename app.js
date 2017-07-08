var request = require('request');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var API = require('qpx-express');
var apiKey = 'AIzaSyDYJze67GhAHYU-f373MnZ0N1sCaDaNQHE';
var qpx = new API(apiKey);

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 62672);
app.use(express.static('public'));

//var url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key={' + key + '}';

var body = {
	"request": {
		"passengers": { "adultCount": 1 },
		"solutions": 1,
		"slice": [{
				"origin":"IND",
				"destination":"SJU",
				"date":"2018-05-01"
			},
			{
				"origin":"SJU",
				"destination":"IND",
				"date":"2018-05-07"
			}
		]
	}
};



app.get('/', function(req, res, next){
	var context = {};
	qpx.getInfo(body, function(error, data) {
		var priceStr = data.trips.tripOption[0].saleTotal;
		priceStr = priceStr.slice(3, priceStr.length);
		priceStr = Number(priceStr);
		//add here, eg
		priceStr = priceStr.toFixed(2);
		context.flightPrice = priceStr;
		console.log(data.trips.tripOption[0].saleTotal);
		res.render('home',context);
	});
});






app.listen(62672, function(){
	console.log('Server started on Port 62672...');
});





