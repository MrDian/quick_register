require('./db');
var request = require('request');
var cheerio = require('cheerio');
var Startup = require('./schemas/startup');
var Name = require('./schemas/name');
var startup;

var fetchData = function () {
	console.log('fetchData-------->');
	console.log('page:' + startup.page);
	request({
		url:'http://www.babynames.net/all/english?page=' + startup.page,
		gzip: true,
		timeout: 4000
	}, function (error, response, body) {
		if (error) {
			fetchData();
			return;
		}
		var $ = cheerio.load(body);
	  	var resultList = $('.names-results li');
	  	var dataArr = [];
	  	var count = 0;

	  	if (resultList.length === 0) {
	  		process.exit(0);
	  		return;
	  	}

	  	resultList.each((index, element) => {
		  	var $this = $(element);
		  	if (!$this.hasClass('list-ad') && $this.find('.result-name').length > 0) {
		  		dataArr.push({
		  			name: $this.find('.result-name').text().toLowerCase(),
		  			gender: $this.find('.result-gender').attr('class').replace('result-gender', '').replace(/\s/, ''),
		  			desc: $this.find('.result-desc').text()
		  		});
		  	}
	  	});

	  	dataArr.forEach(function (obj, index) {
	  		var item = new Name(obj);
	  		item.save(function (err, data) {
	  			count++;
	  			if (count === dataArr.length) {
					startup.save(err => {
						startup.page++;
						fetchData();
					});  				
	  			}
	  		});
	  	});
	  // 	Name.collection.insert(dataArr, err => {
	  // 		if (err) {
	  // 			console.log(err);
	  // 			startup.page++;
			// 	fetchData();
	  // 			return;
	  // 		}
			// startup.save(err => {
			// 	startup.page++;
			// 	fetchData();
			// });
	  // 	});
	});
};

var promise = new Promise((resolve, reject) => {
	Startup.find({}, (err, data) => {
		if (data.length === 0) {
			var obj = new Startup({
				page: 1
			});
			obj.save((err, data) => {
				startup = data;
				resolve();
			});
		} else {
			startup = data[0];
			resolve();
		}
	});
});

promise.then(result => {
	fetchData();
});