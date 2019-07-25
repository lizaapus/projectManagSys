//模拟登录、获取数据
module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        devServer: {
            port: 7100,
            open: true,
            //mock数据
        }
    }
}