const express = require('express');
const app = express();
const request = require('request');

require('dotenv').config();
const tiingoAPIKey = process.env.TIINGO_API_KEY;
const newsAPIKey = process.env.NEWS_API_KEY;

app.get('/api/v1.0/company-outlook', function(req, res) {
	
	var stockTicker = req.query.stock_ticker;
	var tiingoAPIURL = 'https://api.tiingo.com/tiingo/daily/' + stockTicker + '?token=' + tiingoAPIKey;
	
	request(tiingoAPIURL, function(error, response, body) {
		console.error('error:', error);
		console.log('statusCode:', response && response.statusCode);
		console.log('body:', body);

		var jsonResponse = JSON.parse(body);
		var companyOutlook = '{ "companyName": "' + jsonResponse.name + '", "stockTickerSymbol": "' + jsonResponse.ticker + '", "stockExchangeCode": "' + jsonResponse.exchangeCode + '", "companyStartDate": "' + jsonResponse.startDate + '", "description": "' + jsonResponse.description + '" }';

		res.send(JSON.parse(companyOutlook));
	})
});

app.get('/api/v1.0/stock-information', function(req, res) {
	
	var stockTicker = req.query.stock_ticker;
	var tiingoAPIURL = 'https://api.tiingo.com/iex/' + stockTicker + '?token=' + tiingoAPIKey;
	
	request(tiingoAPIURL, function(error, response, body) {
		console.error('error:', error);
		console.log('statusCode:', response && response.statusCode);
		console.log('body:', body);

		var jsonResponse = JSON.parse(body);
		var stockInformation = '{"stockTickerSymbol": "' + jsonResponse[0]['ticker'] + '", "tradingDay": "' + jsonResponse[0]['timestamp'] + '", "previousClosingPrice": "' + jsonResponse[0]['prevClose'] + '", "openingPrice": "' + jsonResponse[0]['open'] + '", "highPrice": "' + jsonResponse[0]['high'] + '", "lowPrice": "' + jsonResponse[0]['low'] + '", "lastPrice": "' + jsonResponse[0]['last'] + '", "change": "' + (jsonResponse[0]['last'] - jsonResponse[0]['prevClose']) + '", "changePercent": "' + ((jsonResponse[0]['last'] - jsonResponse[0]['prevClose']) / jsonResponse[0]['prevClose']) * 100 + '", "numberSharesTraded": "' + jsonResponse[0]['volume'] + '"}';
		
		res.send(stockInformation);
	})
});

app.get('/api/v1.0/stock-prices', function(req, res) {
	
	var stockTicker = req.query.stock_ticker;
	var sixMonthsAgo = '2020-04-27';
	
	var tiingoAPIURL = 'https://api.tiingo.com/iex/' + stockTicker + '/prices?startDate=' + sixMonthsAgo + '&resampleFreq=12hour&columns=open,high,low,close,volume&token=' + tiingoAPIKey;
	
	request(tiingoAPIURL, function(error, response, body) {
		console.error('error:', error);
		console.log('statusCode:', response && response.statusCode);
		console.log('body:', body);

		var jsonResponse = JSON.parse(body);
		var stockPrices = '[';
		var data;
		
		for (data in jsonResponse) {
			console.log(data);
			stockPrices += '[' + data['close'] + ']';
		}
		
		stockPrices += ']';
		res.send(stockPrices);
	})
});

app.get('/api/v1.0/news-articles', function(req, res) {
	
	var stockTicker = req.query.stock_ticker;
	var tiingoAPIURL = 'https://newsapi.org/v2/everything?apiKey=' + newsAPIKey + '&q=' + stockTicker;
	
	request(tiingoAPIURL, function(error, response, body) {
		console.error('error:', error);
		console.log('statusCode:', response && response.statusCode);
		console.log('body:', body);

		var jsonResponse = JSON.parse(body);
		
		res.send(jsonResponse);
	})
});

module.exports = app.listen(8080, () => console.log('App is listening on port 8080.'))