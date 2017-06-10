// var fs = require('fs');

// var content = fs.read('./data.json');

// var page = require('webpage').create();
// page.open('https://www.safaribooksonline.com/register', function(status) {
//   	console.log("Status: " + status);
//   	if (status === "success") {

// 	page.includeJs(
// 	  	// Include the https version, you can change this to http if you like.
// 	 	'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js',
// 	 	function() {
// 		    (page.evaluate(function() {
// 		    	$('[name=register]').submit();
// 		    	console.log($('.js-inputstatus.error').length);
// 		    	console.log($('[name=register]').length);
// 		    }))
// 	  }
// 	);

//   	}
// 	page.onConsoleMessage = function(msg) {
// 	    console.log(msg);
// 	};
// });


require('./db');
var Register = require('./schemas/register');
var Name = require('./schemas/name');
var faker = require('faker');
var nodemailer = require('nodemailer');
var index = 0;
var driver;
var expireDate = 1000 * 60 * 60 * 24 * 10;
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wendian1989@gmail.com',
        pass: 'lovejiejie0511'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '<wendian1989@gmail.com>',
    to: 'wendian1989@126.com', // list of receivers
    subject: 'Safaribooksonline Account', // Subject line
    text: 'Hello world ?', // plain text body
};


var promise = new Promise((resolve, reject) => {
	var isOk = false;
	Register.find({status: 1}, (err, data1) => {
		if (data1.length === 0) {
			Name.find({status: 1}, (err, data2) => {
				nameData = data2;
				resolve();
			});
		} else {
			for (var i = 0; i < data1.length; i++) {
				if ((new Date()).getTime() - data1[i].createTime.getTime() >= expireDate) {
					data1[i].status++;
					data1[i].save(function () {
						if ((i + 1) === data1.length && !isOk) {
							Name.find({status: 1}, (err, data2) => {
								nameData = data2;
								resolve();
							});
						}
					});
				} else {
					console.log(data1[i]);
					isOk = true;
					mailOptions.text = JSON.stringify(data1[i]);
					transporter.sendMail(mailOptions, (error, info) => {
					    if (error) {
					        return console.log(error);
					    }
					    process.exit(0);
					    reject();
					});
					break;
				}
			}
		}
	});
});

// alcott
// ackerley
// 

// console.log(faker.name.findName());
// console.log(faker.name.lastName());
// console.log(faker.name.firstName());
// console.log(faker.internet.password());

promise.then(result => {
	driver = new webdriver.Builder()
	    // .forBrowser('chrome')
	    .forBrowser('firefox')
	    .build();
	doAuto();
});

var doAuto = function () {
	var register = new Register({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		username: nameData[index].name,
		email: nameData[index].name + '@gmail.com',
		password: faker.internet.password()
	});
	driver.get('https://www.safaribooksonline.com/register');
	console.log('--------------------->>>');
	console.log(By.name('first_name'));
	console.log(register.firstName);
	driver.findElement(By.name('first_name')).sendKeys(register.firstName);
	driver.findElement(By.name('last_name')).sendKeys(register.lastName);
	driver.findElement(By.name('email')).sendKeys(register.email);
	driver.findElement(By.name('username')).sendKeys(register.username);
	driver.findElement(By.name('password1')).sendKeys(register.password);
	driver.findElement(By.name('register')).click();
	driver.getCurrentUrl().then(function(url) {
		console.log(url);
    	if (/register-topics/.test(url)) {
    		console.log('if');
    		register.save(function (err) {

    		});
    	} else {
    		console.log('else');
    		nameData[index].status++;
    		nameData[index].save(function (err) {
	    		index++;
	    		doAuto();  			
    		});
    	}
   	});

	// if (driver.findElement(By.id().size()!== 0) {
	// driver.wait(function () {
 //   		return driver.getCurrentUrl().then(function(url) {
 //   	});
	// }, 2000);
	// driver.wait(until.elementLocated(By.name('q')));
};
















