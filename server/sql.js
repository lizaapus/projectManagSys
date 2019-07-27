//sql语句 
var sqlMap = {
    projectSql: {
        addnewProject: 'insert into project(id,WebName,Section,Source,City,StartUrl,LastRunTime,LatestTime,Count,RowXPath,LinkXPath,DateXPath)values(?,?,?,?,?,?,?,?,?,?,?,?)',
        //limit 20,10检索第20条到第30条数据
        getLimitItem: 'select * from project limit ?,?',
        getCount: 'select count(*) from project',
        updateItem: 'update project WebName=?,Section=?,Source=?,City=?,StartUrl=?,LastRunTime=?,LatestTime=?,Count=?,RowXPath=?,LinkXPath=?,DateXPat=? where id=?',
        deleteItem: 'delete from project where id = ?',
    }
}


module.exports = sqlMap;