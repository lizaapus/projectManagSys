//需要连接的mysql的配置语句
module.exports = {
    mysql: {
        host: '192.168.106.60',
        user: 'root',
        password: 'cnkittod',
        database: 'test',
        port: '3306'
    },
    mongodb: {
        host: 'mongodb://192.168.106.56:27017/CPRO',
        mainColl: 'Parser',
        provinceCol: 'Province',
    }
}