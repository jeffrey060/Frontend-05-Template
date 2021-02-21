let http = require("http");
let unzipper = require("unzipper");

// 发布系统
http.createServer(function(request, response) {
    // 接收 发布工具 传过来的压缩包文件，解压缩到服务器目标文件夹下：server/public/
    request.pipe(unzipper.Extract({path: '../server/public/'}));
}).listen(8082)