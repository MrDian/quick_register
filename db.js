var mongoose = require('mongoose');
var dbHost = '127.0.0.1';
mongoose.connect('mongodb://' + dbHost + '/quick_register');