const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request
      .on('error', (err) => {
        console.error('request error: ', err);
      })
      .on('data', (chunk) => {
        console.log('chunk:', chunk.toString());
        // 这里push时chunk不能加toString, 会报错
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body: ', body);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        // response.end('i: hello world\n!!!');
        // 目前html解析无法解析中文
        response.end(`
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>hover</title>
    <style>
        #circle-btn {
            width: 800px;
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(255,0,0);
        }
        .btn-container {
            widht: 200px;
            background-color: rgb(0,255,0);
        }
        button {
            border: 0;
            border-radius: 50px;
            color: white;
            background-color: rgb(0,0,255);
            padding: 15px 20px 16px 60px;
            text-transform: uppercase;
            background: linear-gradient(to right, #f72585 50%, #5f55af 50%);
            background-size: 200% 100%;
            background-position: right bottom;
            transition: all 2s ease;
        }
        .c {
            flex: 1;
            height: 50px;
            background-color: rgb(123,123,123);
        }
    </style>
</head>
<body>
    <div id="circle-btn" class="circle-btn">
        <div class="btn-container">
            <button>Hover me123123</button>
        </div>
        <div class="c"></div>
    </div>
</body>
</html>
        `);
      });
  })
  .listen(8080, (err) => {
    if (err) {
      console.log('listen: ', err);
    }
  });

console.log('server starded');