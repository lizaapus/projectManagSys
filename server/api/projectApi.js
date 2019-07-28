var models = require('../db');
var express = require('express');
var moment = require('moment');
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

//获取指定数据库记录
router.post('/getLimitItem', (req, res) => {
    var params = req.body;
    var sql = $sql.projectSql.getLimitItem;
    console.log(params.startIndex, params.offsite);
    conn.query(sql, [params.startIndex, params.offsite], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })

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
        params.LastRunTime == '' ? null : moment(params.LastRunTime).format('YYYY-MM-DD HH:mm:ss'),
        params.LatestTime == '' ? null : moment(params.LatestTime).format('YYYY-MM-DD HH:mm:ss'),
        parseInt(params.Count),
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
        params.LastRunTime == '' ? null : moment(params.LastRunTime).format('YYYY-MM-DD HH:mm:ss'),
        params.LatestTime == '' ? null : moment(params.LatestTime).format('YYYY-MM-DD HH:mm:ss'),
        parseInt(params.Count),
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
    console.log('enter delete');
    console.log(req.query);
    var sql = $sql.projectSql.deleteItem;
    var params = req.query;
    conn.query(sql, [params.id], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});
//查询符合条件的item的总数
router.post('/searchItemsCount', (req, res) => {
        //console.log(req.body);
        var params = req.body;
        if (params.searchWebName != '' && params.searchCity != '' && params.searchStartUrl != '') {
            //console.log('enter1');
            var sql = $sql.projectSql.searchItems7Count;
            conn.query(sql, [params.searchWebName, params.searchCity, params.searchStartUrl], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName != '' && params.searchCity != '' && params.searchStartUrl == '') {
            //console.log('enter1');
            var sql = $sql.projectSql.searchItems5Count;
            conn.query(sql, [params.searchWebName, params.searchCity], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName != '' && params.searchCity == '' && params.searchStartUrl != '') {
            //console.log('enter1');
            var sql = $sql.projectSql.searchItems4Count;
            conn.query(sql, [params.searchWebName, params.searchStartUrl], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName == '' && params.searchCity != '' && params.searchStartUrl != '') {
            //console.log('enter1');
            var sql = $sql.projectSql.searchItems6Count;
            conn.query(sql, [params.searchStartUrl, params.searchCity], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName != '' && params.searchCity == '' && params.searchStartUrl == '') {
            console.log('enter1');
            var sql = $sql.projectSql.searchItems1Count;
            conn.query(sql, [params.searchWebName], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName == '' && params.searchCity != '' && params.searchStartUrl == '') {
            //console.log('enter1');
            var sql = $sql.projectSql.searchItems3Count;
            conn.query(sql, [params.searchCity, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName == '' && params.searchCity == '' && params.searchStartUrl != '') {
            var sql = $sql.projectSql.searchItems2Count;
            conn.query(sql, [params.searchStartUrl], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else {
            console.log('else');
            var sql = $sql.projectSql.getCount;
            conn.query(sql, function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        }
    }),
    router.post('/searchItems', (req, res) => {
        console.log(req.body);
        var params = req.body;

        if (params.searchWebName != '' && params.searchCity != '' && params.searchStartUrl != '') {
            var sql = $sql.projectSql.searchItems7;
            conn.query(sql, [params.searchWebName, params.searchCity, params.searchStartUrl, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName != '' && params.searchCity != '' && params.searchStartUrl == '') {
            var sql = $sql.projectSql.searchItems5;
            conn.query(sql, [params.searchWebName, params.searchCity, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName != '' && params.searchCity == '' && params.searchStartUrl != '') {
            var sql = $sql.projectSql.searchItems4;
            conn.query(sql, [params.searchWebName, params.searchStartUrl, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName == '' && params.searchCity != '' && params.searchStartUrl != '') {
            var sql = $sql.projectSql.searchItems6;
            conn.query(sql, [params.searchStartUrl, params.searchCity, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName != '' && params.searchCity == '' && params.searchStartUrl == '') {
            var sql = $sql.projectSql.searchItems1;
            conn.query(sql, [params.searchWebName, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName == '' && params.searchCity != '' && params.searchStartUrl == '') {
            var sql = $sql.projectSql.searchItems3;
            conn.query(sql, [params.searchCity, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else if (params.searchWebName == '' && params.searchCity == '' && params.searchStartUrl != '') {
            var sql = $sql.projectSql.searchItems2;
            conn.query(sql, [params.searchStartUrl, params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        } else {
            var sql = $sql.projectSql.getLimitItem;
            conn.query(sql, [params.startIndex, params.offsite], function(err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite(res, result);
                }
            })
        }
    })
module.exports = router