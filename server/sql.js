//sql语句 
var sqlMap = {
    projectSql: {
        getProvince: "select * from province where `层级`='2'",

        addnewProject: 'insert into project(id,WebName,Section,Source,CityCode,Url,LastRunTime,LatestTime,Count,RowXPath,LinkXPath,TitleXPath,DateXPath,Remark)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',

        updateItem: 'update project set WebName=?,Section=?,Source=?,CityCode=?,Url=?,LastRunTime=?,LatestTime=?,Count=?,RowXPath=?,LinkXPath=?,TitleXPath=?,DateXPath=? ,Remark =? where id=?',
        deleteItem: 'delete from project where id = ?',

        getLimitItem: 'select * from project limit ?,?',
        getCount: 'select count(*) from project',

        // searchItems1: 'select * from project where WebName = ? limit ?,?',
        // searchItems1Count: 'select count(*) from project where WebName = ? ',

        // searchItems2: 'select * from project where Url = ? limit ?,?',
        // searchItems2Count: 'select count(*) from project where Url = ? limit ?,?',

        // searchItems3: 'select * from project where CityCode = ? limit ?,?',
        // searchItems3Count: 'select count(*) from project where CityCode = ?',

        // searchItems4: 'select * from project where WebName = ? AND Url = ? limit ?,?',
        // searchItems4Count: 'select count(*) from project  where WebName = ? AND Url = ?',

        // searchItems5: 'select * from project where WebName = ? AND CityCode = ? limit ?,?',
        // searchItems5Count: 'select count(*) from project where WebName = ? AND CityCode = ?',

        // searchItems6: 'select * from project where Url = ? AND CityCode = ? limit ?,?',
        // searchItems6Count: 'select count(*) from project where Url = ? AND CityCode = ?',

        // searchItems7: 'select * from project where WebName = ? AND Url = ? AND CityCode = ? limit ?,?',
        // searchItems7Count: 'select count(*) from project where WebName = ? AND Url = ? AND CityCode = ? ',
        searchItems1A1B1C1DCount: 'select count(*) from project where WebName = ? AND Url = ? AND CityCode = ? AND LatestTime =?',
        searchItems1A1B1C1D: 'select * from project where WebName = ? AND Url = ? AND CityCode = ? AND LatestTime =? limit ?,?',

        searchItems2A1B1C1DCount: 'select count(*) from project where Url = ? AND CityCode = ? AND LatestTime =?',
        searchItems2A1B1C1D: 'select * from project where Url = ? AND CityCode = ? AND LatestTime =? limit ?,?',

        searchItems1A2B1C1DCount: 'select count(*) from project where WebName = ?  AND CityCode = ? AND LatestTime =?',
        searchItems1A2B1C1D: 'select * from project where WebName = ?  AND CityCode = ? AND LatestTime =? limit ?,?',

        searchItems1A1B2C1DCount: 'select count(*) from project where WebName = ? AND Url = ? AND LatestTime =?',
        searchItems1A1B2C1D: 'select * from project where WebName = ? AND Url = ?  AND LatestTime =? limit ?,?',

        searchItems1A1B1C2DCount: 'select count(*) from project where WebName = ? AND Url = ? AND CityCode = ? ',
        searchItems1A1B1C2D: 'select * from project where WebName = ? AND Url = ? AND CityCode = ? limit ?,?',

        searchItems2A2B1C1DCount: 'select count(*) from project where   CityCode = ? AND LatestTime =?',
        searchItems2A2B1C1D: 'select * from project where   CityCode = ? AND LatestTime =? limit ?,?',

        searchItems2A1B2C1DCount: 'select count(*) from project where  Url = ? AND LatestTime =?',
        searchItems2A1B2C1D: 'select * from project where  Url = ?  AND LatestTime =? limit ?,?',

        searchItems2A1B1C2DCount: 'select count(*) from project where  Url = ? AND CityCode = ? ',
        searchItems2A1B1C2D: 'select * from project where  Url = ? AND CityCode = ?  limit ?,?',

        searchItems1A2B2C1DCount: 'select count(*) from project where WebName = ?  AND LatestTime =?',
        searchItems1A2B2C1D: 'select * from project where WebName = ? AND LatestTime =? limit ?,?',

        searchItems1A2B1C2DCount: 'select count(*) from project where WebName = ?  AND CityCode = ? ',
        searchItems1A2B1C2D: 'select * from project where WebName = ?  AND CityCode = ?  limit ?,?',

        searchItems1A1B2C2DCount: 'select count(*) from project where WebName = ? AND Url = ? ',
        searchItems1A1B2C2D: 'select * from project where WebName = ? AND Url = ?  limit ?,?',

        searchItems2A2B2C1DCount: 'select count(*) from project where  LatestTime =?',
        searchItems2A2B2C1D: 'select * from project where  LatestTime =? limit ?,?',

        searchItems2A2B1C2DCount: 'select count(*) from project where  CityCode = ? ',
        searchItems2A2B1C2D: 'select * from project where  CityCode = ? limit ?,?',

        searchItems2A1B2C2DCount: 'select count(*) from project where  Url = ? ',
        searchItems2A1B2C2D: 'select * from project where  Url = ?  limit ?,?',

        searchItems1A2B2C2DCount: 'select count(*) from project where WebName = ? ',
        searchItems1A2B2C2D: 'select * from project where WebName = ? limit ?,?',
    }
}


module.exports = sqlMap;