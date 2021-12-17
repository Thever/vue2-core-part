const path = require('path');

module.exports = {
    //  入口
    entry: './src/index.js',
    //  输出
    output: {
        //  虚拟打包路径，也就是说文件夹不会真正生成，而是在8080端口虚拟生成
        publicPath: 'xuni',
        //  打包出来的文件名,只生成在端口中
        filename: 'bundle.js'
    },
    devServer:{
        //  端口号
        port:8080,
        //  静态资源文件夹
        contentBase:'www'
    }
};