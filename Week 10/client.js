const net = require('net');
var util = require('util');
var images = require('images');
const parser = require('./parser.js');
const render = require('./render.js');

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LEANGTH = 'WAITING_LEANGTH'; // chunk头部长度状态
    this.WAITING_LEANGTH_END = 'WAITING_LEANGTH_END'; // chunk头部长度结束状态
    this.READING_THUNK = 'READING_THUNK'; // chunk读取状态
    this.WAITING_NEW_LENGTH = 'WAITING_NEW_LENGTH'; // chunk底部长度状态
    this.WAITING_NEW_LENGTH_END = 'WAITING_NEW_LENGTH_END'; // chunk底部长度结束状态

    this.current = this.WAITING_LEANGTH;
    this.thunkLength = 0; // 记录chunk长度
    this.content = []; // 记录chunk
    this.finished = false; // 判断chunk是否接收完毕
  }

  // c\r\nhello world\n\r\n0\r\n\r\n
  receiveChar(chunkChar) {
    if (this.current === this.WAITING_LEANGTH) {
      if (chunkChar === '\r') {
        if (this.thunkLength === 0) {
          this.current = this.WAITING_NEW_LENGTH_END;
        } else {
          this.current = this.WAITING_LEANGTH_END;
        }
      } else {
        // 读取完长度，记录
        this.thunkLength *= 16; // 保证每条chunk长度为16
        this.thunkLength += Number.parseInt(chunkChar, 16);
      }
    } else if (this.current === this.WAITING_LEANGTH_END) {
      if (chunkChar === '\n') {
        this.current = this.READING_THUNK;
      }
    } else if (this.current === this.READING_THUNK) {
      if (chunkChar === '\r') {
        this.current = this.WAITING_NEW_LENGTH;
      } else {
        this.thunkLength -= 1;
        this.content.push(chunkChar);
      }
    } else if (this.current === this.WAITING_NEW_LENGTH) {
      if (chunkChar === '\n') {
        this.current = this.WAITING_LEANGTH;
      }
    } else if (this.current === this.WAITING_NEW_LENGTH_END) {
      this.finished = true;
    }
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0; // 行状态
    this.WAITING_STATUS_LINE_END = 1; // 行结尾状态
    this.WAITING_HEADER_NAME = 2; // 头键状态
    this.WAITING_HEADER_SPACE = 3; // 键值对中间空格状态
    this.WAITING_HEADER_VALUE = 4; // 头值状态
    this.WAITING_HEADER_LINE_END = 5; // 头结尾状态
    this.WAITING_HEADER_BLOCK_LINE = 6; // 空行状态
    this.WAITING_BODY = 7; // 数据体状态

    this.current = this.WAITING_STATUS_LINE; // 当前状态
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.finished;
  }

  get response() {
    return this.bodyParser && this.bodyParser.content.join('');
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiverChar(string.charAt(i));
    }
  }

  receiverChar(char) {
    /**
         * 按照这个响应报文字符来处理
         *  HTTP/1.1 200 OK
            Content-Type: text/html
            Date: Thu, 26 Nov 2020 08:57:18 GMT
            Connection: keep-alive
            Transfer-Encoding: chunked
            c
            hello world
            0
            实际处理的字符========================================>
            HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nDate: Thu, 26 Nov 2020 09:00:13 GMT\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked\r\n\r\nc\r\nhello world\n\r\n0\r\n\r\n
         */
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_LINE;
        // 根据头部字段 tansfer-encoding 判断body解析方式, 这里只做了chunked 解析
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          // chunked：分段请求，总长度未知
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_LINE) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      // console.log(char);
      this.bodyParser.receiveChar(char);
    }
  }
}

class Request {
  constructor(options) {
    this.host = options.host;
    this.port = options.port || 80;
    this.method = options.method || 'GET';
    this.path = options.path || '/';
    this.headers = options.headers || {};
    this.body = options.body || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      // TODO
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on('data', (data) => {
        console.log('====connention data: ====');
        // console.log(data.toString());
        /**
                 *  HTTP/1.1 200 OK
                    Content-Type: text/html
                    Date: Thu, 26 Nov 2020 07:55:57 GMT
                    Connection: keep-alive
                    Transfer-Encoding: chunked
                    c
                    hello world
                    0
                 */
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }

  toString() {
    // 注意这里报文格式, 特别是每行使用\r \n, 写错就会 400
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join('\r\n')}\r
\r
${this.bodyText}`;
  }
}

// const getCircularReplacer = () => {
//     const seen = new WeakSet();
//     return (key, value) => {
//       if (typeof value === "object" && value !== null) {
//         if (seen.has(value)) {
//           return;
//         }
//         seen.add(value);
//       }
//       return value;
//     };
//   };

void (async function () {
  const request = new Request({
    host: '127.0.0.1',
    port: 3001,
    method: 'POST',
    path: '/',
    headers: {
      ['X-Foo']: 'bar',
    },
    body: {
      name: 'dinggong',
    },
  });

  const response = await request.send();
  // console.log('response:', response);
  const dom = parser.parserHtml(response);
  // console.log(JSON.stringify(dom, getCircularReplacer(), 4)); // 报错
  // console.log(util.inspect(dom, { depth:null })); //depth:null 展开全部层级
  let viewport = images(800, 600);

  render(viewport, dom.children[1].children[5].children[5].children[19]);

  viewport.save('viewport.jpg');
})();