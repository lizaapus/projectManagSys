//模拟登录、获取数据
module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        devServer: {
            port: 7200,
            open: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                    changeOrigin: true,
                    ws: true,
                    pathRewrite: {
                        '^/api': '/api'
                    },
                    "secure": false
                }
            }
        }
    }
}