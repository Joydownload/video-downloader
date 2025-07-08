// server.js
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/api/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    console.log("❌ 没有收到 URL");
    return res.status(400).json({ error: "No URL provided" });
  }

  console.log("🔥 收到下载请求：", url);

  // 暂时模拟返回链接（你后面可以换回 yt-dlp）
  return res.json({
    links: [
      "https://example.com/fake-download.mp4",
      "https://example.com/another-fake.mp4"
    ],
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
