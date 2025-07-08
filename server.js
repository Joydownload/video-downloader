const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: "缺少链接 URL" });
  }

  // 格式映射（更稳定）
  const formatMap = {
    "best": "best",
    "mp3": "bestaudio",
    "360p": "18",
    "720p": "22",
    "1080p": "137+140",
    "1440p": "271+140",
    "2160p": "313+140"
  };

  const selectedFormat = formatMap[format] || "best";
  const command = `yt-dlp -f ${selectedFormat} -g "${url}"`;

  console.log("🎯 执行命令：", command);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 错误：", stderr);
      return res.status(500).json({ error: "下载失败，请检查链接或格式" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    console.log("✅ 返回链接：", links);
    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`🚀 后端启动成功：http://localhost:${port}`);
});
