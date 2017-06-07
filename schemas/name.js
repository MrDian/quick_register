var mongoose = require('mongoose');

var NameSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    gender: {type: String},
    desc: {type: String},
    status: {type: Number, default: 1},
    createTime: {type: Date, default: Date.now}
});

var Name = mongoose.model('Name', NameSchema);

module.exports = Name; // 导出模式