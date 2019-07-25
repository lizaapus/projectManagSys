//sql语句 
var sqlMap = {
    projectSql: {
        addnewProject: 'insert into project(id,name ,url)values(?,?,?)',
        //limit 20,10检索第20条到第30条数据
        getLimitItem: 'select * from project limit ? , ?',
        getCount: 'select count(*) from project',
        updateProject: 'update film set name=?,url=? where id=?',
        deletePorject: 'delete from user where id = ?',
    }
}


module.exports = sqlMap;