const express = require('express')
var router = express.Router()
var moment = require('moment');
const model = require('../model/mongodbModel')
const mongoose = require('mongoose')

const ProvinceModel = model.ProvinceModel
const CPROModel = model.CPROModel
const DataModel = model.DataModel
const FundModel = model.FundModel
const ProjectModel = model.ProjectModel

var jsonWrite = function(res, ret, returntype) {
    if (returntype) {
        res.json({
            code: 0,
            msg: 'success',
            data: ret
        })
    } else {
        res.json({
            code: ret.code,
            msg: ret.name + '：' + ret.errmsg,
            err: ret
        })
    }
};
//单个增加数据库记录
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
        IsParsed: Boolean(params.IsParsed),
        NeedRender: Boolean(params.NeedRender),
        RowXPath: params.RowXPath,
        LinkXPath: params.LinkXPath,
        TitleXPath: params.TitleXPath,
        DateXPath: params.DateXPath,
        Remark: params.Remark
    })
    CPROEntity.save(function(error, doc) {
        if (error) {
            jsonWrite(res, error, false)
        } else {
            jsonWrite(res, doc, true);
        }
    });
});
//批量增加数据
router.post('/insertManyProject', (req, res) => {
    var params = req.body;
    //console.log(params);
    CPROModel.insertMany(params, {
        ordered: false
    }, function(error, docs) {
        if (error) {
            //console.log(error);
            jsonWrite(res, error, false)
        } else {
            //console.log(docs)
            jsonWrite(res, docs, true);
        }
    })
})

//获取省市信息
router.get('/getProvince', (req, res) => {
    ProvinceModel.find({}, (err, data) => {
        if (err) {
            jsonWrite(res, err, false)
        } else {

            jsonWrite(res, data, true);
        }
    })
});

//获取无条件下数据库记录
router.post('/getLimitItem', (req, res) => {
    var params = req.body;
    var query = CPROModel.find({}, null, {
        limit: parseInt(params.offsite),
        skip: parseInt(params.startIndex),
        sort: (params.sortParams)
    });
    query.exec(function(err, docs) {
        if (err) {
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, docs, true);
        }
    });
});
//获取无条件下数据库表item总数
router.get('/getItemsNumb', (req, res) => {
    CPROModel.countDocuments({}, function(err, count) {
        if (err) {
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, count, true);
        }
    })
});
//更新指定item
router.post('/updateItem', (req, res) => {
    var params = req.body;
    //console.log(params);
    CPROModel.findByIdAndUpdate(params._id, {
        WebName: params.WebName,
        Section: params.Section,
        Source: params.Source,
        CityCode: params.CityCode,
        Url: params.Url,
        IsParsed: Boolean(params.IsParsed),
        NeedRender: Boolean(params.NeedRender),
        RowXPath: params.RowXPath,
        LinkXPath: params.LinkXPath,
        TitleXPath: params.TitleXPath,
        DateXPath: params.DateXPath,
        Remark: params.Remark,
        LastEditTime: params.LastEditTime
    }, function(err, data) {
        if (err) {
            //console.log(err);
            jsonWrite(res, err, false)
        } else {
            //console.log(data)
            jsonWrite(res, data, true);
        }
    })
});

//更新插入失败的item
router.post('/updateInsertItem', (req, res) => {
    var params = req.body;
    CPROModel.findOneAndUpdate({
        Url: params.Url
    }, {
        WebName: params.WebName,
        Section: params.Section,
        Source: params.Source,
        CityCode: params.CityCode,
        Url: params.Url,
        LastEditTime: params.LastEditTime,
        Remark: params.Remark,
    }, function(err, data) {
        if (err) {
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, data, true);
        }
    })
});
//删除item
router.delete('/deleteItem', (req, res) => {
    var params = req.query;
    CPROModel.findByIdAndRemove(params._id, (error, data) => {
        if (error) {
            jsonWrite(res, error, false)
        } else {
            jsonWrite(res, data, true);
        }
    });
});

//查询符合条件的item的总数
router.post('/searchItemsCount', (req, res) => {
    var params = req.body;
    if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: moment(params.sStarttime).format('YYYY-MM-DD HH:mm:ss'),
                $lte: moment(params.sStarttime).format('YYYY-MM-DD HH:mm:ss')
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                // console.log(count);
                jsonWrite(res, count, true);
            }
        })

    } //2A1B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //1A2B1C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                //    console.log(count);
                jsonWrite(res, count, true);
            }
        })
    } //1A1B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                //    console.log(count);
                jsonWrite(res, count, true);
            }
        })
    } //1A1B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime == '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
            CityCode: params.searchCity,

        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                //    console.log(count);
                jsonWrite(res, count, true);
            }
        })
    } //2A2B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //2A1B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            Url: params.searchStartUrl,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //2A1B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime == '')) {
        CPROModel.countDocuments({
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //1A2B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },

            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //1A2B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime == '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },

            CityCode: params.searchCity,

        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //1A1B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime == '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //1A2B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.sStarttime == '')) {
        CPROModel.countDocuments({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //2A1B2C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime == '')) {
        CPROModel.countDocuments({
            Url: params.searchStartUrl,
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //2A2B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime == '')) {

        CPROModel.countDocuments({
            CityCode: params.searchCity,
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } //2A2B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity == '' && (params.sStarttime != '')) {
        CPROModel.countDocuments({
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    } else {
        CPROModel.countDocuments({}, function(err, count) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, count, true);
            }
        })
    }
});
//查询符合条件的item
router.post('/searchItems', (req, res) => {
    var params = req.body;
    if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A1B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            Url: params.searchStartUrl,
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A2B1C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A1B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A1B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime == '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
            CityCode: params.searchCity,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A2B1C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            CityCode: params.searchCity,
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A1B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime != '')) {
        var query = CPROModel.find({

            Url: params.searchStartUrl,

            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A1B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity != '' && (params.sStarttime == '')) {
        var query = CPROModel.find({

            Url: params.searchStartUrl,
            CityCode: params.searchCity,

        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A2B2C1D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },

            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A2B1C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime == '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            CityCode: params.searchCity,
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {

            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A1B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime == '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
            Url: params.searchStartUrl,
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //1A2B2C2D
    else if (params.searchWebName != '' && params.searchStartUrl == '' && params.searchCity == '' && (params.sStarttime == '')) {
        var query = CPROModel.find({
            WebName: {
                $regex: params.searchWebName,
                $options: '$i'
            },
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A1B2C2D
    else if (params.searchWebName == '' && params.searchStartUrl != '' && params.searchCity == '' && (params.sStarttime == '')) {
        var query = CPROModel.find({
            Url: params.searchStartUrl,
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A2B1C2D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity != '' && (params.sStarttime == '')) {
        var query = CPROModel.find({
            CityCode: params.searchCity,
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } //2A2B2C1D
    else if (params.searchWebName == '' && params.searchStartUrl == '' && params.searchCity == '' && (params.sStarttime != '')) {
        var query = CPROModel.find({
            LastDataTime: {
                $gte: params.sStarttime,
                $lte: params.sEndtime
            }
        }, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
            }
        });
    } else {
        var query = CPROModel.find({}, null, {
            limit: parseInt(params.offsite),
            skip: parseInt(params.startIndex),
            sort: (params.sortParams),
        });
        query.exec(function(err, docs) {
            if (err) {
                jsonWrite(res, err, false)
            } else {
                jsonWrite(res, docs, true);
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
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, count, true);
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
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, docs, true);
        }
    });
});
//SortByDataCount
router.post('/sortByCollumn', (req, res) => {
    var params = req.body;
    var query = CPROModel.find({}, null, {
        limit: parseInt(params.offsite),
        skip: parseInt(params.startIndex),
        sort: (params.sortParams)
    });

    query.exec(function(err, docs) {
        if (err) {
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, docs, true);
        }
    });
});

router.post('/getFundsList', (req, res) => {
    var params = req.body;

    var query = FundModel.find({
        FundName: {
            $regex: params.keywords,
            $options: '$i'
        }
    });

    query.exec(function(err, docs) {
        if (err) {
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, docs, true);
        }
    });
});
//批量添加基金数据
router.post('/insertManyFundProject', (req, res) => {
        var params = req.body;
        ProjectModel.insertMany(params, {
            ordered: false
        }, function(error, docs) {
            if (error) {
                //console.log(error);
                jsonWrite(res, error, false)
            } else {
                //console.log(docs)
                jsonWrite(res, docs, true);
            }
        })
    })
    //批量添加基金数据
router.post('/insertManyFundProject', (req, res) => {
        var params = req.body;
        ProjectModel.insertMany(params, {
            ordered: false
        }, function(error, docs) {
            if (error) {
                //console.log(error);
                jsonWrite(res, error, false)
            } else {
                //console.log(docs)
                jsonWrite(res, docs, true);
            }
        })
    })
    //单个添加基金数据
router.post('/inserSingleFundProject', (req, res) => {
        var params = req.body;
        ProjectModel.insertMany(params, {
            ordered: false
        }, function(error, docs) {
            if (error) {
                jsonWrite(res, error, false)
            } else {
                jsonWrite(res, docs, true);
            }
        })
    })
    //获取指定projectid的所有数据
router.post('/getProjectListById', (req, res) => {
    let params = req.body;
    console.log(params.pid);
    var query = ProjectModel.find({
        ProjectID: params.pid
    });
    query.exec(function(err, docs) {
        if (err) {
            jsonWrite(res, err, false)
        } else {
            jsonWrite(res, docs, true);
        }
    });
})
module.exports = router