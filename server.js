const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: "缺少 URL 参数" });
  }

  const formatMap = {
    best: "best",
    "720p": "22",
    "360p": "18",
    mp3: "bestaudio"
  };

  const selectedFormat = formatMap[format] || "best";
  const command = `yt-dlp -f ${selectedFormat} -g "${url}"`;

  console.log("🎯 正在下载格式：", selectedFormat);
  console.log("🌐 视频链接：", url);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 出错：", stderr);
      return res.status(500).json({ error: "下载失败，请检查链接或格式" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    if (links.length === 0) {
      return res.status(404).json({ error: "没有找到可用下载链接。" });
    }

    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
