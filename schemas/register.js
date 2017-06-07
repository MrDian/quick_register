var mongoose = require('mongoose');
var moment = require('moment');

var RegisterSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String},
    password: {type: String},
    email: {type: String, required: true, unique: true},
    status: {type: Number, default: 1},
    createTime: {type: Date, default: Date.now},
    modifyTime: {type: Date, default: Date.now},
    formatCreateTime: {type: String},
    formatModifyTime: {type: String}
});

// 保存之前所执行的方法 
RegisterSchema.pre('save', function (next) {
	if (this.isNew) {
		this.createTime = this.modifyTime = Date.now();
		this.formatCreateTime = this.formatModifyTime = moment().format('YYYY-MM-DD HH:mm:ss');
	} else {
		this.modifyTime = Date.now();
		this.formatModifyTime = moment().format('YYYY-MM-DD HH:mm:ss');
	}
	next();
});

var Register = mongoose.model('Register', RegisterSchema);

module.exports = Register; // 导出模式