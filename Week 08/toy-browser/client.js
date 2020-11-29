const net = require("net");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"])
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";

    if (this.headers["Content-Type"] === "application/json")
      this.bodyText = JSON.stringify(this.body);
    else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    )
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");

    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join("\r\n")}\r\n\r\n${this.bodyText}`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          { host: this.host, port: this.port },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on("data", (data) => {
        console.log(data.toString());
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}

class ResponseParser {
  constructor() {
    this.state = this.parserStatusLine;

    this.statusLine = "";

    this.headers = {};
    this.headerName = "";
    this.headerValue = "";

    this.WAIT_HEADER_NAME = 0;
    this.WAIT_HEADER_VALUE = 1;
    this.HEADER_LINE_END = 2;
    this.parserHeadersState = this.WAIT_HEADER_NAME;

    this.bodyParser = null;
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.state = this.state(string.charAt(i));
    }
  }

  parserStatusLine(char) {
    if (char === "\r") {
      //吃掉状态行末尾CR
      return this.parserStatusLine;
    }
    if (char === "\n") {
      //切到解析响应头，同时吃掉状态行末尾LF
      return this.parserHeaders;
    }
    this.statusLine += char;
    return this.parserStatusLine;
  }

  parserBlankLine(char) {
    if (char === "\r") return this.parserBlankLine;
    if (char === "\n") return this.parserBody;
  }

  parserHeaders(char) {
    if (this.parserHeadersState === this.WAIT_HEADER_NAME) {
      // 读取headerName
      if (char === ":") {
        //吃掉 ：
        return this.parserHeaders;
      } else if (char === " ") {
        //吃掉空格，同时切到读取headerValue
        this.parserHeadersState = this.WAIT_HEADER_VALUE;
        return this.parserHeaders;
      } else if (char === "\r") {
        //遇见 CR,切到 parserBlankLine
        if (this.headers["Transfer-Encoding"] === "chunked")
          // bodyParser 与 headers 相关，根据不同的 body 类型创建不同的 Parser
          this.bodyParser = new TrunkedBodyParser();
        return this.parserBlankLine(char);
      } else {
        this.headerName += char;
      }
      return this.parserHeaders;
    } else if (this.parserHeadersState === this.WAIT_HEADER_VALUE) {
      // 读取headerValue
      if (char === "\r") {
        // 遇到 CR 转入 HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
        this.parserHeadersState = this.HEADER_LINE_END;
      } else {
        this.headerValue += char;
      }
      return this.parserHeaders;
    }
    if (this.parserHeadersState === this.HEADER_LINE_END) {
      // 吃掉一个头行尾LF，转入等待读取 name
      this.parserHeadersState = this.WAIT_HEADER_NAME;
      return this.parserHeaders;
    }
  }

  parserBody(char) {
    if (this.isFinished) {
      return this.parserStatusLine;
    } else {
      this.bodyParser.receiveChar(char);
      return this.parserBody;
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      handers: this.handers,
      body: this.bodyParser.content.join(""),
    };
  }
}

class TrunkedBodyParser {
  constructor() {
    this.isFinished = false;

    this.length = 0;
    this.content = [];

    this.WAIT_LEGNTH = 0;
    this.WAIT_LEGNTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAIT_NEW_LINE = 3;
    this.WAIT_NEW_LINE_END = 4;

    this.state = this.WAIT_LEGNTH;
  }
  receiveChar(char) {
    if (this.state === this.WAIT_LEGNTH) {
      if (char === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.state = this.WAIT_LEGNTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.state === this.WAIT_LEGNTH_LINE_END) {
      if (char === "\n") {
        this.state = this.READING_TRUNK;
      }
    } else if (this.state === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.state = this.WAIT_NEW_LINE;
      }
    } else if (this.state === this.WAIT_NEW_LINE) {
      if (char === "\r") {
        this.state = this.WAIT_NEW_LINE_END;
      }
    } else if (this.state === this.WAIT_NEW_LINE_END) {
      if (char === "\n") {
        this.state = this.WAIT_LEGNTH;
      }
    }
  }
}

void (async function () {
  let request = new Request({
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    method: "POST",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "hejianqin",
    },
  });
  let response = await request.send();
  console.log(response);
})();
