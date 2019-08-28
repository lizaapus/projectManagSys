const express = require('express')
var router = express.Router()
var moment = require('moment');
const model = require('../model/mongodbModel')
const mongoose = require('mongoose')

const ProvinceModel = model.ProvinceModel
const CPROModel = model.CPROModel
const DataModel = model.DataModel

var jsonWrite = function(res, ret) {
    if (typeof ret === 'error') {
        res.json({
            code: '1',
            msg: '操作失败：' + ret
        })
    } else {
        res.json(ret);
    }
};
//增加数据库记录
router.post('/addProject', (req, res) => {
    var params = req.body;
    var CPROEntity = new CPROModel({
        WebName: params.WebName,
        Section: params.Section,
        Source: params.Source,
        CityCode: params.CityCode,
        Url: params.Url,
        LastRunTime: params.LastRunTime == '' || params.LastRunTime == null ? null : moment(params.LastRunTime).format('YYYY-MM-DD HH:mm:ss'),
        LastDataTime: params.LastDataTime == '' || params.LastDataTime == null ? null : moment(params.LastDataTime).format('YYYY-MM-DD HH:mm:ss'),
        DataCount: parseInt(params.DataCount),
        RowXPath: params.RowXPath,
        LinkXPath: params.LinkXPath,
        TitleXPath: params.TitleXPath,
        DateXPath: params.DateXPath,
        Remark: params.Remark
    })
    CPROEntity.save(function(error, doc) {
        if (error) {
            console.log(error.errmsg);
            jsonWrite(res, error.errmsg)
        } else {
            console.log(doc);
            jsonWrite(res, doc);
        }
    });
});
//获取省市信息
router.get('/getProvince', (req, res) => {
    ProvinceModel.find({
        '层级': "2"
    }, (err, data) => {
        if (err) {
            return
        }
        if (data) {

            jsonWrite(res, data);
        }
    })
});

//获取无条件下数据库记录
router.post('/getLimitItem', (req, res) => {
    var params = req.body;
    var query = CPROModel.find({}, null, {
        limit: parseInt(params.offsite),
        skip: parseInt(params.startIndex)
    });
    query.exec(function(err, docs) {
        if (err) {
            console.log(err);
            return
        }
        if (docs) {
            jsonWrite(res, docs);
        }
    });
});



//获取无条件下数据库表item总数
router.get('/getItemsNumb', (req, res) => {
    CPROModel.countDocuments({}, function(err, count) {
        if (err) {
            console.log(err);
        }
        if (count) {
            jsonWrite(res, count);
        }
    })
});

//更新指定item
router.post('/updateItem', (req, res) => {
    var params = req.body;
    CPROModel.findByIdAndUpdate(params._id, {
        WebName: params.WebName,
        Section: params.Section,
        Source: params.Source,
        CityCode: params.CityCode,
        Url: params.Url,
        LastRunTime: params.LastRunTime == '' || params.LastRunTime == null || params.LastRunTime == '0000-00-00 00:00:00' ? '0000-00-00 00:00:00' : moment(params.LastRunTime).format('YYYY-MM-DD HH:mm:ss'),
        LastDataTime: params.LastDataTime == '' || params.LastDataTime == null || params.LastDataTime == '0000-00-00 00:00:00' ? '0000-00-00 00:00:00' : moment(params.LastDataTime).format('YYYY-MM-DD HH:mm:ss'),
        DataCount: parseInt(params.DataCount),
        RowXPath: params.RowXPath,
        LinkXPath: params.LinkXPath,
        TitleXPath: params.TitleXPath,
        DateXPath: params.DateXPath,
        Remark: params.Remark,
    }, function(err, data) {
        if (err) {
            console.log(err);
        }
        if (data) {
            jsonWrite(res, data);
        }
    })
});

//删除item
router.delete('/deleteItem', (req, res) => {
    var params = req.query;
    CPROModel.findByIdAndRemove(params._id, (error, data) => {
        if (error) {
            console.log(error);
            throw error;
        } else {
            jsonWrite(res, data);
        }
    });
});

//查询符合条件的item的总数
router.post('/searchItemsCount', (req, res) => {
    var params = req.body;
    if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })

    } //2A1B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A2B1C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,

            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A1B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,
            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A1B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,
            CityCode: params.searchCity,

        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //2A2B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({

            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //2A1B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({

            Url: params.searchStartUrl,

            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //2A1B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime !== '')) {
        CPROModel.countDocuments({
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A2B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,

            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A2B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,

            CityCode: params.searchCity,

        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A1B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //1A2B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        CPROModel.countDocuments({
            WebName: params.searchWebName,
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //2A1B2C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        CPROModel.countDocuments({

            Url: params.searchStartUrl,

        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //2A2B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        CPROModel.countDocuments({

            CityCode: params.searchCity,

        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } //2A2B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        CPROModel.countDocuments({
            LastDataTime: params.searchLatestTime
        }, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    } else {
        CPROModel.countDocuments({}, function(err, count) {
            if (err) {
                console.log(err);
            }
            if (count) {
                jsonWrite(res, count);
            }
        })
    }
});
//查询符合条件的指定item
router.post('/searchItems', (req, res) => {
    var params = req.body;
    if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A1B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A2B1C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,
            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A1B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,

            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A1B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,
            CityCode: params.searchCity,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A2B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({

            CityCode: params.searchCity,
            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A1B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({

            Url: params.searchStartUrl,

            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A1B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime !== '')) {
        var query = CPROModel.find({

            Url: params.searchStartUrl,
            CityCode: params.searchCity,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A2B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,

            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A2B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,

            CityCode: params.searchCity,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A1B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,
            Url: params.searchStartUrl,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //1A2B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        var query = CPROModel.find({
            WebName: params.searchWebName,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A1B2C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        var query = CPROModel.find({

            Url: params.searchStartUrl,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A2B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.searchLatestTime == null || params.searchLatestTime == '')) {
        var query = CPROModel.find({

            CityCode: params.searchCity,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } //2A2B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity == '' && (params.searchLatestTime != null && params.searchLatestTime != '')) {
        var query = CPROModel.find({

            LastDataTime: params.searchLatestTime
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    } else {
        var query = CPROModel.find({}, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex)
        });
        query.exec(function(err, docs) {
            if (err) {
                console.log(err);
                return
            }
            if (docs) {
                jsonWrite(res, docs);
            }
        });
    }
});

//从data表中获取符合id的总数
router.post('/getDataItemsNumb', (req, res) => {
    var params = req.body;
    DataModel.countDocuments({
        ParserId: mongoose.Types.ObjectId(params.ParseId)
    }, function(err, count) {
        if (err) {
            console.log(err);
        }
        if (count) {
            jsonWrite(res, count);
        }
    })
});
//getDataList
router.post('/getDataList', (req, res) => {
    var params = req.body;
    var query = DataModel.find({
        ParserId: mongoose.Types.ObjectId(params.ParseId)
    }, null, {
        limit: parseInt(params.offsite),
        skip: parseInt(params.startIndex),
        sort: {
            PublishDate: -1
        }
    });
    query.exec(function(err, docs) {
        if (err) {
            console.log(err);
            return
        }
        if (docs) {
            jsonWrite(res, docs);
        }
    });
});
module.exports = router