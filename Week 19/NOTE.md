## overviewAA


### 流程：代码 ==发布工具 -> 发布系统 -> 线上服务系统 -> 展示给用户
### 1. 发布系统：接收发布工具发送上来的代码文件，放到指定目录 参考代码Week 19/task/publish-server
### 2. 发布工具： 程序开发人员需要发布的时候，在客户端使用它将本地代码发布到线上的发布服务器 参考代码Week 19\task\server
### 3. 线上服务系统：给用户提供线上服务访问的服务器 参考代码Week 19/task/publish-server

## 搭建服务器
### 使用虚拟机模拟服务器

工具：
>(镜像地址使用：http://mirrors.aliyun.com/ubuntu  
> 默认安装 openSSH)
1. Oracle VM VirtualBox download： https://www.virtualbox.org/
2. Ubuntu 20.04.1 LTS (Focal Fossa) download：https://releases.ubuntu.com/20.04/



### 服务器环境配置
安装 node：```sudo apt install nodejs```   
安装 npm：```sudo apt install npm```

## 线上服务系统
### 构建项目
使用 express-generator 快速生成一个简单前端项目(/server)
命令：
```bash
mkdir server
cd server
npx express-generator
npm install
npm start
scp -P 8022 -r ./* winter@127.0.0.1:home/winter/server
```

### 线上服务系统部署
1. 在服务器启动 ssh，默认在 22 端口监听
2. 虚拟机需要做 22 端口映射，示例映射为 8022
3. 在服务器创建 server 文件夹
4. 执行 scp 命令，将前端项目文件拷贝到服务器 server 文件夹下

命令：
```bash
# 启动 ssh
service ssh start

# 拷贝文件 ./* 到指定路径 /home/skye/server
# 127.0.0.1 表示服务器 ip 地址
scp -P 8022 -r ./* skye@127.0.0.1:/home/skye/server  
```

## 发布系统 (publish-server/server.js)
```javascript
let http = require("http");
let unzipper = require("unzipper");

// 发布系统
http.createServer(function(request, response) {
    // 接收 发布工具 传过来的压缩包文件，解压缩到服务器目标文件夹下：server/public/
    request.pipe(unzipper.Extract({path: '../server/public/'}));
}).listen(8082)

```
## 发布工具 (publish-tool/publish.js)
（流式处理、
压缩传递多个文件）
```javascript
let http = require("http");
let archiver = require("archiver");

// 发布工具
let request = http.request({
    hostname: "127.0.0.1",  // 发布系统 ip 地址
    port: 8082,  // 发布系统监听端口
    method: "POST",
    headers: {
        'Content-type': 'application/octet-stream'
        // 'Content-length': stat.size
    }
}, response => {
    console.log(response)
});
```
### archive压缩文件夹 简单demo
```javascript
// 创建压缩文件对象
const archive = archiver('zip', {
    zlib: { level: 9 }
});

// 压缩文件夹
archive.directory('./simple/', false);

// 表示压缩完成
archive.finalize();

// 传输压缩文件
archive.pipe(request);
```

## 用GitHub oAuth做一个登录实例
0. 注册github app，获取Client ID和Client secrets
https://docs.github.com/en/developers/apps/authorizing-oauth-apps
1. 打开 https://github.com/login/oauth/authorize  - publish-tool  【publish】
2. auth 路由：接收 code，用 code + client_id + client_secret 换 token  - publish-server 【server】
3. 创建 server，接受 token，后点击发布  - publish-tool【publish】
4. publish 路由：用 token 获取用户信息，检查权限，接受发布  - publish-server 【server】
