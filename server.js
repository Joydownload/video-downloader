const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;
  if (!url) return res.status(400).json({ error: "缺少视频链接" });

  const qualityMap = {
    best: "best",
    mp3: "bestaudio",
    "360p": "18",
    "720p": "22",
    "1080p": "137+140",
    "2160p": "313+140"
  };

  const formatCode = qualityMap[format] || "best";
  const command = `yt-dlp -f "${formatCode}" -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ 下载失败：", stderr);
      return res.status(500).json({ error: "解析失败" });
    }
    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ 本地后端启动成功：http://localhost:${port}`);
});
