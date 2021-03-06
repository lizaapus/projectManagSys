var mongodb = require('../db')

const mongoose = require('mongoose')
var Schema = mongoose.Schema;
mongoose.connect(mongodb.mongodb.host, {
    useNewUrlParser: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const ProvinceSchema = new Schema({
    '省份代码': {
        type: String
    },
    '省市名称': {
        type: String
    },
    '层级': {
        type: String
    },
    '是否有子节点': {
        type: String
    },
    '父节点代码': {
        type: String
    },
}, {
    collection: 'Province'
}, {
    versionKey: false
});

const CPROSchema = new Schema({
    WebName: {
        type: String,
    },
    Section: {
        type: String,
    },
    Source: {
        type: String,
    },
    CityCode: {
        type: String,
    },
    Url: {
        type: String,
        required: true
    },
    LastRunTime: {
        type: Date,
    },
    LastDataTime: {
        type: Date,
    },
    DataCount: {
        type: Number,
    },
    IsParsed: {
        type: Boolean,
    },
    NeedRender: {
        type: Boolean,
    },
    RowXPath: {
        type: String,
    },
    LinkXPath: {
        type: String,
    },
    TitleXPath: {
        type: String,
    },
    DateXPath: {
        type: String,
    },
    Remark: {
        type: String,
    },
    LastEditTime: {
        type: Date,
    },
}, {
    collection: 'Copy_of_Parser',
    //collection: 'Parser',
    versionKey: false
});

const DataSchema = new Schema({
    WebName: {
        type: String,
    },
    Section: {
        type: String,
    },
    Source: {
        type: String,
    },
    CityCode: {
        type: String,
    },
    Url: {
        type: String,
    },
    Title: {
        type: String,
    },
    PublishDate: {
        type: Date,
    },
    ParserId: {
        type: mongoose.Types.ObjectId,
    }
}, {
    collection: 'Data',
    versionKey: false
});

const FundSchema = new Schema({
    FundName: {
        type: String,
    },
    FundID: {
        type: String,
    },
    SourceType: {
        type: String,
    },
}, {
    collection: 'Fund',
    versionKey: false
});
const ProjectSchema = new Schema({
    ProjectID: {
        type: String,
    },
    ProjectName: {
        type: String,
    },
    FundID: {
        type: String,
    },
    StartTime: {
        type: String,
    },
    Leader: {
        type: String,
    },
    LeaderOrg: {
        type: String,
    },
    Remark: {
        type: String,
    }
}, {
    collection: 'Projects',
    versionKey: false
});




const ProvinceModel = mongoose.model('Province', ProvinceSchema)

const CPROModel = mongoose.model('Copy_of_Parser', CPROSchema)
    //const CPROModel = mongoose.model('Parser', CPROSchema)

const DataModel = mongoose.model('Data', DataSchema)

const FundModel = mongoose.model('Fund', FundSchema)

const ProjectModel = mongoose.model('Projects', ProjectSchema)

module.exports = {
    CPROModel: CPROModel,
    ProvinceModel: ProvinceModel,
    DataModel: DataModel,
    FundModel: FundModel,
    ProjectModel: ProjectModel
}