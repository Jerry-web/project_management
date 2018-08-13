var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs=require('fs')
var projectDao=require('../dao/project')
var projectUrlDao=require('../dao/project_url')
var projectModuleDao = require('../dao/project_module')
var projectDemandDao=require('../dao/project_demand')
var projectBugDao=require('../dao/project_bug')
var systemCofig=require('../conf/config')

var uploadFolder=systemCofig.fileUploadUrl+"uploads/";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

createFolder(uploadFolder);

var upload = multer({ storage: storage });
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a project');
});

//获取项目列表
router.get('/getProjectList', function(req, res, next) {
    projectDao.queryList(req, res, next);
});
//新增项目
router.post('/addProject', function(req, res, next) {
    projectDao.insertProject(req, res, next);
});
//修改项目
router.post('/updateProject', function(req, res, next) {
    projectDao.updateProject(req, res, next);
});
//获取项目详情
router.get('/getProjectInfo', function(req, res, next) {
    projectDao.getProjectInfo(req, res, next);
});

//新增URL
router.post('/addProjectUrl', function(req, res, next) {
    projectUrlDao.insertProjectUrl(req, res, next);
});
//修改URL
router.post('/updateProjectUrl', function(req, res, next) {
    projectUrlDao.updateProjectUrl(req, res, next);
});
//删除URL
router.post('/deleteProjectUrl', function(req, res, next) {
    projectUrlDao.deleteProjectUrl(req, res, next);
});

//添加项目模块
router.post('/addProjectModuel', function(req, res, next) {
    projectModuleDao.insertModule(req, res, next);
});

router.get('/projectModuelList', function(req, res, next) {
    projectModuleDao.queryList(req, res, next);
});

router.post('/updateProjectModuel', function(req, res, next) {
    projectModuleDao.updateModel(req, res, next);
});

router.post('/deleteProjectModuel', function(req, res, next) {
    projectModuleDao.deleteModel(req, res, next);
});

router.get('/parentProjectList', function(req, res, next) {
    projectModuleDao.parentProjectList(req, res, next);
});

router.get('/treeProjectList', function(req, res, next) {
    projectModuleDao.treeProjectList(req, res, next);
});


//新增需求
router.post('/addProjectDemand',upload.array('demandFile', 10), function(req, res, next) {
    projectDemandDao.insertProjectDemand(req, res, next);
});
//查询需求列表
router.get('/getProjectDemandList', function(req, res, next) {
    projectDemandDao.getProjectDemandList(req, res, next);
});
router.post('/updateProjectDemand',upload.array('demandFile', 10), function(req, res, next) {
    projectDemandDao.updateProjectDemand(req, res, next);
});
//删除需求
router.post('/deleteProjectDemand', function(req, res, next) {
    projectDemandDao.deleteProjectDemand(req, res, next);
});
//获取需求详情
router.get('/getProjectDemandInfo', function(req, res, next) {
    projectDemandDao.getProjectDemandInfo(req, res, next);
});

//新增缺陷
router.post('/addProjectBug', function(req, res, next) {
    projectBugDao.insertProjectBug(req, res, next);
});
//查询缺陷列表
router.get('/getProjectBugList', function(req, res, next) {
    projectBugDao.getProjectBugList(req, res, next);
});
router.post('/updateProjectBug', function(req, res, next) {
    projectBugDao.updateProjectBug(req, res, next);
});
//删除缺陷
router.post('/deleteProjectBug', function(req, res, next) {
    projectBugDao.deleteProjectBug(req, res, next);
});
//获取缺陷详情
router.get('/getProjectBugInfo', function(req, res, next) {
    projectBugDao.getProjectBugInfo(req, res, next);
});
//新增缺陷处理记录
router.post('/addProjectBugRecord', function(req, res, next) {
    projectBugDao.insertProjectBugRecord(req, res, next);
});
//查询缺陷记录列表
router.get('/getProjectBugRecordList', function(req, res, next) {
    projectBugDao.getProjectBugRecordList(req, res, next);
});

module.exports = router;
