const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: "❌ 缺少视频链接 URL" });
  }

  const ytFormat = {
    best: "best",
    mp3: "bestaudio",
    "360p": "18",
    "720p": "22",
    "1080p": "137+140",
    "2160p": "313+140",
  }[format] || "best";

  const command = `yt-dlp -f ${ytFormat} -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 出错：", stderr);
      return res.status(500).json({ error: "下载失败，可能是格式不支持或网络问题" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    if (links.length === 0) {
      return res.status(404).json({ error: "没有找到可用链接" });
    }

    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ 后端已启动：http://localhost:${port}`);
});
