var request = require('request');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var fs = require('fs');
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
		"passengers": { "adultCount": 2 },
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

	//get flight price via QPX API
	var p1 = function(){ 
		return new Promise(function(resolve, reject){
			qpx.getInfo(body, function(error, data) {
				if(error){
					reject(error);
				} else {
					var priceStr = data.trips.tripOption[0].saleTotal;
					priceStr = priceStr.slice(3, priceStr.length);
					priceStr = Number(priceStr);
					//add here, eg
					priceStr = priceStr.toFixed(2);
					context.flightPrice = priceStr;
					//console.log(data.trips.tripOption[0].saleTotal);
					resolve(priceStr);
				}
			});
		});
	};

	//get hotel price via scraping w/ cheerio
	var url = 'https://www.expedia.com/Hotel-Search-Data?responsive=true&destination=Sint+Maarten+(Dutch),+Sint+Maarten&startDate=02/12/2018&endDate=02/16/2018&adults=2&regionId=602298&sort=price&timezoneOffset=-14400000&siteid=1&langid=1033&hsrIdentifier=HSR&?1499891962553';
	var p2 = function(){
		return new Promise(function(resolve, reject){
			request(url, function(err, resp, bod){
				if(err){
					reject(err);
				} else {
					var $ = cheerio.load(bod);
					//var price = $('.price-breakdown-tooltip.actualPrice.price').text();
					var price = $('.guestRatingText.secondary').text();
					//var priceText = price.text();
					context.stuff = bod;
					console.log(price);
					resolve(price);
				}
			});
		});
	};


	Promise.all([p1(), p2()]).then(function(){
		res.render('home',context);
	});

});




app.listen(62672, function(){
	console.log('Server started on Port 62672...');
});




