var moment = require('moment');
const Sequelize = require('sequelize');
var projectBugModel=require('../model/project_bug')
var projectBugRecordModel=require('../model/project_bug_record')
var userModel=require('../model/user')
var bugCreator={association: projectBugModel.belongsTo(userModel, { foreignKey: 'bug_creator',as:'bugCreator'})}
var bugHandler={association: projectBugModel.belongsTo(userModel, { foreignKey: 'bug_handler',as:'bugHandler'})}
var bugRecordCreator={association: projectBugRecordModel.belongsTo(userModel, { foreignKey: 'bug_record_creator',as:'bugRecordCreator'})}
var bugRecordReceiver={association: projectBugRecordModel.belongsTo(userModel, { foreignKey: 'bug_record_receiver',as:'bugRecordReceiver'})}
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


/**
 * 新增项目
 * @param req
 * @param res
 * @param next
 */
exports.insertProjectBug=function (req, res, next) {
    var bugData=req.body;
    bugData.bug_creator=req.session.user.user_id;
    bugData.bug_create_time=moment().format('YYYY-MM-DD HH:mm:ss');
    var resultData=undefined;
    projectBugModel.create(bugData)
        .then(function (result) {

            if(result!=null){
                resultData= {
                    projectBug:result
                }
                projectBugRecordModel.create({
                    bug_record_creator:result.bug_creator,
                    bug_record_create_time:result.bug_create_time,
                    bug_record_status:'新建',
                    bug_id:result.bug_id
                })
            }

        }).then(function (resultRecord) {
        if(resultRecord!=null){
            resultData={
                projectList:result.rows,
                count:result.count
            }
        }
        jsonWrite(res, resultData);
    }).catch(function (err) {
        console.log('project/insertProjectBug error:' + err)
    })

}
exports.getProjectBugList=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){

    projectBugModel.findAndCountAll({include: [bugCreator,bugHandler],order: [[Sequelize.fn('FIELD', Sequelize.col('bug_status'),'待修复','已驳回','已修复','已验证','已关闭')],['bug_id','DESC']],where:{project_id:projectId},offset:(req.query.currentPage-1)*10,limit:10}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectBugList:result.rows,
                count:result.count
            }
        }
        jsonWrite(res, resultData);
    })}else {
        res.json({
            code:'1',
            msg: '参数project_id不能为空！！'
        });
    }
}

/**
 * 修改项目基本信息
 * @param req
 * @param res
 * @param next
 */
exports.updateProjectBug=function (req, res, next) {
    var bugData=req.body;
    projectBugModel.update(bugData,{where:{bug_id:bugData.bug_id}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/updateProjectBug error:' + err)
    })

}
/**
 * 删除项目网址
 * @param req
 * @param res
 * @param next
 */
exports.deleteProjectBug=function (req, res, next) {
    var bugId=req.body.bug_id;
    projectBugModel.destroy({where:{bug_id:bugId}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/deleteProjectBug error:' + err)
    })

}
/**
 * 获取项目需求基本信息
 * @param req
 * @param res
 * @param next
 */
exports.getProjectBugInfo=function (req, res, next) {
    var bugId=req.query.bug_id;
    if(bugId!=null&&bugId.length>0){
        projectBugModel.findOne({include: [bugCreator,bugHandler],
            where:{bug_id:bugId}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectBugInfo:result
                }
            }
            jsonWrite(res, resultData);
        })
    }else {
        res.json({
            code:'1',
            msg: '参数bug_id不能为空！！'
        });
    }

}
/**
 * 新增bug处理记录
 * @param req
 * @param res
 * @param next
 */
exports.insertProjectBugRecord=function (req, res, next) {
    var bugRecordData=req.body;
    bugRecordData.bug_record_creator=req.session.user.user_id;
    bugRecordData.bug_record_create_time=moment().format('YYYY-MM-DD HH:mm:ss');;
    var resultData=undefined;
    projectBugRecordModel.create(bugRecordData)
        .then(function (result) {

            if(result!=null){
                resultData={
                    projectBug:result
                }
                var bugData={
                    bug_id:result.bug_id,
                    bug_status:result.bug_record_status
                }
                projectBugModel.update(bugData,{where:{bug_id:bugData.bug_id}})
            }

        }).then(function (result) {
        jsonWrite(res, resultData);
    }).catch(function (err) {
        console.log('project/insertProjectBugRecord error:' + err)
    })

}
/**
 * 获取bug记录列表
 * @param req
 * @param res
 * @param next
 */
exports.getProjectBugRecordList=function (req, res, next) {
    var bugId=req.query.bug_id;
    if(bugId!=null&&bugId.length>0){
        projectBugRecordModel.findAndCountAll({include:[bugRecordCreator,bugRecordReceiver],where:{bug_id:bugId},order: [['bug_record_id', 'DESC']]}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectBugRecordList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })}else {
        res.json({
            code:'1',
            msg: '参数bug_id不能为空！！'
        });
    }
}