const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const ytdlpPath = path.join(__dirname, "yt-dlp");

if (!fs.existsSync(ytdlpPath)) {
  console.log("📥 正在下载 yt-dlp...");
  exec("curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp && chmod +x yt-dlp", (error) => {
    if (error) console.error("❌ yt-dlp 下载失败：", error);
    else console.log("✅ yt-dlp 下载完成");
  });
}

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;
  if (!url) return res.status(400).json({ error: "缺少 URL 参数" });

  const qualityMap = {
    best: "best",
    mp3: "bestaudio",
    "360p": "18",
    "720p": "22",
    "1080p": "137+140",
    "2160p": "313+140"
  };

  const formatCode = qualityMap[format] || "best";
  const command = `./yt-dlp -f "${formatCode}" -g "${url}"`;

  console.log("📥 收到请求：", url);
  console.log("🛠 执行命令：", command);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 执行失败：", err);
      console.error("📄 stderr 输出：", stderr);
      return res.status(500).json({ error: "下载失败，请检查链接或格式。" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    console.log("✅ 获取链接成功：", links);
    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
