const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url) {
    return res.status(400).json({ error: "缺少 URL 参数" });
  }

  console.log("📥 收到请求：", url, format);

  let formatCode = "best";

  // 转换常见的画质格式为 yt-dlp 可识别的格式代码
  if (format === "mp3") formatCode = "bestaudio";
  else if (format === "360p") formatCode = "18";
  else if (format === "720p") formatCode = "22";
  else if (format === "1080p") formatCode = "137+140";
  else if (format === "2160p") formatCode = "313+140";

  const command = `yt-dlp -f ${formatCode} -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 错误：", stderr);
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
  console.log(`✅ Server running on http://localhost:${port}`);
});
