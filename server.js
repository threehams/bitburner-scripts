import http from "http";
import { resolve, join, dirname } from "path";
import fs from "fs/promises";

const server = http.createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.url === "/manifest.json") {
    const files = (await fs.readdir("dist")).filter(
      (file) => !file.startsWith(".")
    );
    const manifest = await Promise.all(
      files.flatMap(async (filename) => {
        const stats = await fs.lstat(join("dist", filename));
        if (!stats.isDirectory()) {
          return [filename];
        }
        const nested = await fs.readdir(join("dist", filename));
        return nested.map((file) => {
          return [filename, file].join("_");
        });
      })
    );
    response.write(JSON.stringify(manifest.flat()));
    response.end();
    return;
  }
  const filename = join(...request.url.replace(/^\//, "").split("_"));
  try {
    const file = await fs.readFile(join("dist", filename));
    // have to add extensions to relative imports... boooooo
    const correctedImports = file
      .toString()
      .replace(/from "\.\/(.*)"/g, `from "./$1.js"`);
    response.write(correctedImports);
    response.end();
  } catch (err) {
    console.log(err);
    response.writeHead(404);
    response.end();
  }
});

server.listen(18718, () => {
  console.log(`server started at http://localhost:18718`);
});
