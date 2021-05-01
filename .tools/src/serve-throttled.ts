import fs from "fs";
import http from "http";
import sysPath from "path";

const PORT: number = 3000;

const INDEX_HTML = `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>OpenFlashDB/AVM1</title>
</head>
<body>
<embed type="application/x-shockwave-flash" src="main.swf" width="640" height="480"/>
</body>
</html>
`;

const MOVIE_BYTES: Buffer = fs.readFileSync(sysPath.resolve(__dirname, "..", "wait-for-frame", "wff2-ready-increments", "main.swf"));

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case "/": {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(INDEX_HTML);
      break;
    }
    case "/main.swf": {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/x-shockwave-flash");
      for await (const chunk of throttle(MOVIE_BYTES)) {
        res.write(chunk);
      }
      res.end();
      break;
    }
    default: {
      res.statusCode = 404;
      res.end();
      break;
    }
  }
  console.log(`${req.url} - ${res.statusCode}`);
});

async function* throttle(movieBytes: Buffer): AsyncIterableIterator<Buffer> {
  const chunks: Buffer[] = [];
  for (let start: number = 0; start < movieBytes.length; start += 10) {
    const end = Math.min(start + 10, movieBytes.length);
    chunks.push(movieBytes.slice(start, end));
  }
  for (const [i, chunk] of chunks.entries()) {
    yield chunk;
    console.log(`Chunk ${i + 1} / ${chunks.length}`);
    await wait(1000);
  }
}

async function wait(delayMs: number): Promise<void> {
  return new Promise<void>((resolve, _reject): void => {
    setTimeout(resolve, delayMs);
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
