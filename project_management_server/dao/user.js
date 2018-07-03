var userModel=require('../model/user')

var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
    	ret.code=0;
        res.json(ret);
    }
};

exports.queryList=function (req, res, next) {
	userModel.findAndCountAll().then(function (result) {
        jsonWrite(res, result);
    })


}
