var mongoose = require('mongoose');
var moment = require('moment');

// 启动项
var StartupSchema = new mongoose.Schema({
    page: {type: Number, default: 1},
    createTime: {type: Date, default: Date.now},
    modifyTime: {type: Date, default: Date.now},
    formatCreateTime: {type: String},
    formatModifyTime: {type: String}
});

// 保存之前所执行的方法 
StartupSchema.pre('save', function (next) {
	if (this.isNew) {
		this.createTime = this.modifyTime = Date.now();
		this.formatCreateTime = this.formatModifyTime = moment().format('YYYY-MM-DD HH:mm:ss');
	} else {
		this.modifyTime = Date.now();
		this.formatModifyTime = moment().format('YYYY-MM-DD HH:mm:ss');
	}
	next();
});

var Startup = mongoose.model('Startup', StartupSchema);

module.exports = Startup;