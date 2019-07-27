var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sql');

//连接数据库
// var conn = mysql.createConnection(models.mysql);
// conn.connect();
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

//获取指定数据库记录
router.post('/getLimitItem', (req, res) => {
    var params = req.body;
    var sql = $sql.projectSql.getCount;
    // conn.query(sql,[params.startIndex,params.offsite] ,function(err, result) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     if (result) {
    //         jsonWrite(res, result);
    //     }
    // })
    
});
//增加项目
router.post('/addProject', (req, res) => {
    var sql = $sql.projectSql.addnewProject;
    var params = req.body;
    conn.query(sql, [params.id,
        params.WebName,
        params.Section,
        params.Source,
        params.City,
        params.StartUrl,
        params.LastRunTime,
        params.LatestTime,
        params.Count,
        params.RowXPath,
        params.LinkXPath,
        params.DateXPath
    ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

//获取数据库表item总数
router.get('/getItemsNumb', (req, res) => {
    console.log(req.body);
    var sql = $sql.projectSql.getCount;
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//更新指定item
router.post('/updateItem', (req, res) => {
    console.log(req.body);
    var sql = $sql.projectSql.updateItem;
    var params = req.body;
    conn.query(sql, [
        params.WebName,
        params.Section,
        params.Source,
        params.City,
        params.StartUrl,
        params.LastRunTime,
        params.LatestTime,
        params.Count,
        params.RowXPath,
        params.LinkXPath,
        params.DateXPath,
        params.id,
    ], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//删除item
router.delete('/deleteItem', (req, res) => {
    var sql = $sql.projectSql.deleteItem;
    var params = req.body;
    conn.query(sql, [params.id], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//查找符合条件的item
router.post('/searchItems', (req, res) => {
    console.log(req.body);
    var params = req.body;
    var sql = 'search * from project where ';
    if (params.WebName != "") {
        sql = sql + 'WebName = `' + params.WebName + '`';
        if (params.StartUrl != '') {
            sql += 'AND StartUrl =  `' + params.StartUrl + '`'
        } else {
            if (params.City = '') {
                sql += 'AND City = `' + params.City + '`'
            }
        }
    } else {
        if (params.StartUrl != '') {
            sql += 'StartUrl =  `' + params.StartUrl + '`';
            if (params.City = '') {
                sql += 'AND City = `' + params.City + '`'
            }
        } else {
            if (params.City = '') {
                sql += 'City = `' + params.City + '`'
            } else {
                sql = 'search * from project';
            }
        }
    }
    conn.query(sql, [params.id], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })

})
module.exports = router;