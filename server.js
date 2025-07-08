const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // 提供前端页面

// 接收前端 POST 请求
app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: "缺少视频链接" });
  }

  // 自定义格式选择
  let ytFormat = "best";
  if (format === "360p") ytFormat = "18";
  else if (format === "720p") ytFormat = "22";
  else if (format === "1080p") ytFormat = "137+140";
  else if (format === "2160p") ytFormat = "313+140";
  else if (format === "mp3") ytFormat = "bestaudio";

  const cmd = `yt-dlp -f ${ytFormat} -g "${url}"`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 出错：", stderr);
      return res.status(500).json({ error: "下载失败，可能链接无效或格式不支持。" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    res.json({ links });
  });
});

// 默认首页
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`✅ 服务器已启动: http://localhost:${port}`);
});
