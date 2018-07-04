var express = require('express');
var router = express.Router();
var projectDao=require('../dao/project')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a project');
});

//获取用户列表
router.get('/getProjectList', function(req, res, next) {
    projectDao.queryList(req, res, next);
});

module.exports = router;