const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;
  if (!url) {
    return res.status(400).json({ error: "缺少视频链接" });
  }

  const qualityMap = {
    mp3: "bestaudio",
    "360p": "18",
    "720p": "22",
    "1080p": "137+140",
    "2160p": "313+140",
    best: "best"
  };

  const selectedFormat = qualityMap[format] || "best";
  const command = `yt-dlp -f ${selectedFormat} -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ 下载出错：", stderr);
      return res.status(500).json({ error: "无法获取下载链接。" });
    }

    const links = stdout.trim().split("\n").filter(l => l.startsWith("http"));
    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
