//sql语句 
var sqlMap = {
    projectSql: {
        addnewProject: 'insert into project(id,WebName,Section,Source,City,StartUrl,LastRunTime,LatestTime,Count,RowXPath,LinkXPath,DateXPath,Remark)values(?,?,?,?,?,?,?,?,?,?,?,?,?)',

        updateItem: 'update project set WebName=?,Section=?,Source=?,City=?,StartUrl=?,LastRunTime=?,LatestTime=?,Count=?,RowXPath=?,LinkXPath=?,DateXPath=? ,Remark =? where id=?',
        deleteItem: 'delete from project where id = ?',

        getLimitItem: 'select * from project limit ?,?',
        getCount: 'select count(*) from project',

        // searchItems1: 'select * from project where WebName = ? limit ?,?',
        // searchItems1Count: 'select count(*) from project where WebName = ? ',

        // searchItems2: 'select * from project where StartUrl = ? limit ?,?',
        // searchItems2Count: 'select count(*) from project where StartUrl = ? limit ?,?',

        // searchItems3: 'select * from project where City = ? limit ?,?',
        // searchItems3Count: 'select count(*) from project where City = ?',

        // searchItems4: 'select * from project where WebName = ? AND StartUrl = ? limit ?,?',
        // searchItems4Count: 'select count(*) from project  where WebName = ? AND StartUrl = ?',

        // searchItems5: 'select * from project where WebName = ? AND City = ? limit ?,?',
        // searchItems5Count: 'select count(*) from project where WebName = ? AND City = ?',

        // searchItems6: 'select * from project where StartUrl = ? AND City = ? limit ?,?',
        // searchItems6Count: 'select count(*) from project where StartUrl = ? AND City = ?',

        // searchItems7: 'select * from project where WebName = ? AND StartUrl = ? AND City = ? limit ?,?',
        // searchItems7Count: 'select count(*) from project where WebName = ? AND StartUrl = ? AND City = ? ',
        searchItems1A1B1C1DCount: 'select count(*) from project where WebName = ? AND StartUrl = ? AND City = ? AND LatestTime =?',
        searchItems1A1B1C1D: 'select * from project where WebName = ? AND StartUrl = ? AND City = ? AND LatestTime =? limit ?,?',

        searchItems2A1B1C1DCount: 'select count(*) from project where StartUrl = ? AND City = ? AND LatestTime =?',
        searchItems2A1B1C1D: 'select * from project where StartUrl = ? AND City = ? AND LatestTime =? limit ?,?',

        searchItems1A2B1C1DCount: 'select count(*) from project where WebName = ?  AND City = ? AND LatestTime =?',
        searchItems1A2B1C1D: 'select * from project where WebName = ?  AND City = ? AND LatestTime =? limit ?,?',

        searchItems1A1B2C1DCount: 'select count(*) from project where WebName = ? AND StartUrl = ? AND LatestTime =?',
        searchItems1A1B2C1D: 'select * from project where WebName = ? AND StartUrl = ?  AND LatestTime =? limit ?,?',

        searchItems1A1B1C2DCount: 'select count(*) from project where WebName = ? AND StartUrl = ? AND City = ? ',
        searchItems1A1B1C2D: 'select * from project where WebName = ? AND StartUrl = ? AND City = ? limit ?,?',

        searchItems2A2B1C1DCount: 'select count(*) from project where   City = ? AND LatestTime =?',
        searchItems2A2B1C1D: 'select * from project where   City = ? AND LatestTime =? limit ?,?',

        searchItems2A1B2C1DCount: 'select count(*) from project where  StartUrl = ? AND LatestTime =?',
        searchItems2A1B2C1D: 'select * from project where  StartUrl = ?  AND LatestTime =? limit ?,?',

        searchItems2A1B1C2DCount: 'select count(*) from project where  StartUrl = ? AND City = ? ',
        searchItems2A1B1C2D: 'select * from project where  StartUrl = ? AND City = ?  limit ?,?',

        searchItems1A2B2C1DCount: 'select count(*) from project where WebName = ?  AND LatestTime =?',
        searchItems1A2B2C1D: 'select * from project where WebName = ? AND LatestTime =? limit ?,?',

        searchItems1A2B1C2DCount: 'select count(*) from project where WebName = ?  AND City = ? ',
        searchItems1A2B1C2D: 'select * from project where WebName = ?  AND City = ?  limit ?,?',

        searchItems1A1B2C2DCount: 'select count(*) from project where WebName = ? AND StartUrl = ? ',
        searchItems1A1B2C2D: 'select * from project where WebName = ? AND StartUrl = ?  limit ?,?',

        searchItems2A2B2C1DCount: 'select count(*) from project where  LatestTime =?',
        searchItems2A2B2C1D: 'select * from project where  LatestTime =? limit ?,?',

        searchItems2A2B1C2DCount: 'select count(*) from project where  City = ? ',
        searchItems2A2B1C2D: 'select * from project where  City = ? limit ?,?',

        searchItems2A1B2C2DCount: 'select count(*) from project where  StartUrl = ? ',
        searchItems2A1B2C2D: 'select * from project where  StartUrl = ?  limit ?,?',

        searchItems1A2B2C2DCount: 'select count(*) from project where WebName = ? ',
        searchItems1A2B2C2D: 'select * from project where WebName = ? limit ?,?',
    }
}


module.exports = sqlMap;