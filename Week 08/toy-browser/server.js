const http = require("http");

const requestListener = (request, response) => {
  let body = [];
  request
    .on("error", (err) => {
      console.log(err);
    })
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      console.log("body:", body);
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(" Hello, World!\n");
    });
};

const server = http.createServer(requestListener);
server.listen(8088);
console.log(`server start on 8088`)
