const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/api/download", (req, res) => {
  const url = req.body.url;
  const format = req.body.format || "best";

  if (!url) {
    return res.status(400).json({ error: "缺少 URL 参数" });
  }

  console.log("🔥 收到请求，下载地址：", url, "格式：", format);

  // 映射格式名称到 yt-dlp 格式代码
  const formatMap = {
    "best": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best",
    "mp3": "bestaudio[ext=m4a]",
    "360p": "bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best",
    "720p": "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best",
    "1080p": "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best",
    "1440p": "bestvideo[height<=1440][ext=mp4]+bestaudio[ext=m4a]/best",
    "2160p": "bestvideo[height<=2160][ext=mp4]+bestaudio[ext=m4a]/best"
  };

  const ytdlpFormat = formatMap[format] || "best";

  const command = `yt-dlp -f "${ytdlpFormat}" -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err || !stdout) {
      console.error("❌ yt-dlp 错误：", stderr);
      return res.status(500).json({ error: "没有找到可用下载链接。" });
    }

    const links = stdout.trim().split("\n").filter(link => link.startsWith("http"));
    if (links.length === 0) {
      return res.status(404).json({ error: "没有找到可用下载链接。" });
    }

    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ Server 运行中： http://localhost:${port}`);
});
