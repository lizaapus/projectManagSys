//sql语句 
var sqlMap = {
    projectSql: {
        addnewProject: 'insert into project(id,WebName,Section,Source,City,StartUrl,LastRunTime,LatestTime,Count,RowXPath,LinkXPath,DateXPath)values(?,?,?,?,?,?,?,?,?,?,?,?)',
        //limit 20,10检索第20条到第30条数据


        updateItem: 'update project WebName=?,Section=?,Source=?,City=?,StartUrl=?,LastRunTime=?,LatestTime=?,Count=?,RowXPath=?,LinkXPath=?,DateXPat=? where id=?',
        deleteItem: 'delete from project where id = ?',

        getLimitItem: 'select * from project limit ?,?',
        getCount: 'select count(*) from project',

        searchItems1: 'select * from project where WebName = ? limit ?,?',
        searchItems1Count: 'select count(*) from project where WebName = ? ',

        searchItems2: 'select * from project where StartUrl = ? limit ?,?',
        searchItems2Count: 'select count(*) from project where StartUrl = ? limit ?,?',

        searchItems3: 'select * from project where City = ? limit ?,?',
        searchItems3Count: 'select count(*) from project where City = ?',

        searchItems4: 'select * from project where WebName = ? AND StartUrl = ? limit ?,?',
        searchItems4Count: 'select count(*) from project  where WebName = ? AND StartUrl = ?',

        searchItems5: 'select * from project where WebName = ? AND City = ? limit ?,?',
        searchItems5Count: 'select count(*) from project where WebName = ? AND City = ?',

        searchItems6: 'select * from project where StartUrl = ? AND City = ? limit ?,?',
        searchItems6Count: 'select count(*) from project where StartUrl = ? AND City = ?',

        searchItems7: 'select * from project where WebName = ? AND StartUrl = ? AND City = ? limit ?,?',
        searchItems7Count: 'select count(*) from project where WebName = ? AND StartUrl = ? AND City = ? ',

    }
}


module.exports = sqlMap;