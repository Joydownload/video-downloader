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
    return res.status(400).json({ error: "缺少视频链接 URL" });
  }

  console.log("📥 请求链接：", url, "格式：", format);

  const command = `yt-dlp -f "${format}" -g "${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ yt-dlp 错误：", stderr);
      return res.status(500).json({ error: "下载失败，检查链接或格式" });
    }

    const links = stdout.trim().split("\n").filter(line => line.startsWith("http"));
    if (links.length === 0) {
      return res.status(404).json({ error: "未获取到下载链接" });
    }

    res.json({ links });
  });
});

app.listen(port, () => {
  console.log(`✅ 服务器已运行：http://localhost:${port}`);
});
