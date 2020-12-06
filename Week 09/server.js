const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request.on('error', err => {
        console.error('request error: ', err);
    }).on('data', chunk => {
        // 这里push不能将chunk toString ，会报错
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body: ', body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        // response.end('Hello World!!!');
        response.end(`<html>
<head>
    <meta charset="utf-8" />
    <style>
        #root {
            width: 200px;
            height: 200px;
            background-color: yellow;
        }
        .father .son {
            width: 50px;
            height: 50px;
            background-color: 'red';
        }
        body img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid #e6e6e6;
        }
    </style>
</head>
<body>
    <div id="root" class="root">hello world!!!</div>
    <div class="father">
        <div class="son">box</div>
    </div>
    <img src='a' alt="a" />
</body>
</html>`)
    })
}).listen(3001);

console.log('server started');
