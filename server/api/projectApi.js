var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sql');

//连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();
var jsonWrite = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        })
    } else {
        res.json(ret);
    }
}

//增加项目接口
router.post('/addProject', (req, res) => {
    var sql = $sql.projectSql.addnewProject;
    var params = req.body;
    console.log(params);
    conn.query(sql, [params.id, params.webName, params.age], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

//项目检索接口
router.post('/getLimitItem', (req, res) => {
    console.log(req.body);
    var sql = $sql.projectSql.getLimitItem;
    var params = req.body;
    conn.query(sql, [params.startIndex, params.offset], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//获取数据库表

module.exports = router;