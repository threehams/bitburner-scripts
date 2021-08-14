import http from "http";
import { resolve, join, dirname } from "path";
import fs from "fs/promises";

const server = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.url === "/manifest.json") {
    const files = await fs.readdir("dist");
    const manifest = files.filter((file) => !file.startsWith("."));
    response.write(JSON.stringify(manifest));
    response.end();
    return;
  }
  const filename = request.url.replace(/^\//, "");
  try {
    const file = await fs.readFile(join("dist", request.url));
    response.write(file);
    response.end();
  } catch (err) {
    console.log(err);
    response.writeHead(404);
    response.end();
  }
});

server.listen(18718);
