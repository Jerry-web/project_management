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

/*exports.queryList=function (req, res, next) {
	userModel.findAndCountAll().then(function (result) {
		var resultData=undefined;
		if(result!=null){
            resultData={
            	userList:result.rows,
				count:result.count
			}
		}
        jsonWrite(res, resultData);
    })
}*/

module.exports = {
    queryList:function (req, res, next) {
        var params = req.query;
        console.log(params.currentPage);
        var pageParams={}
        if(params!=null&&params.currentPage!=null){
            pageParams={offset:(params.currentPage-1)*10,limit:10}
        }
        userModel.findAndCountAll(pageParams).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    login:function(req, res, next){
        var params = req.body;
        userModel.findOne({where:{user_name:params.user_name,user_password:params.user_password}}).then(function(result){
            var resultData=undefined;
            if(result!=null){
                // req.session.userObj = result.dataValues;
                resultData= {
                    user: result
                }
                req.session.user =result;
            }
            jsonWrite(res, resultData);
        })
    },
    register:function(req, res, next){
        var params = req.body;
        userModel.create(params).then(function(result){
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }

            }
            jsonWrite(res, resultData);
        })
    },
    updateUser:function (req, res, next) {
        var params = req.body;
        userModel.update(params,{where:{user_id:params.user_id}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    deleteUser:function (req, res, next) {
        var params = req.body;
        userModel.destroy({where:{user_id:params.user_id}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    logOut:function (req, res, next) {
        // delete req.session.userObj;
        req.session.user =null;
        jsonWrite(res, {code:0});
    }
}





