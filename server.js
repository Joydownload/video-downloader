const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/api/download", (req, res) => {
  const url = req.query.url;
  const format = req.query.format || "best";

  if (!url) {
    return res.status(400).json({ error: "缺少 URL 参数" });
  }

  console.log("🔥 收到请求，解析视频链接：", url);

  const command = `yt-dlp -f ${format} -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 出错：", stderr);
      return res.status(500).json({ error: "下载失败，请检查 URL 或网络" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

