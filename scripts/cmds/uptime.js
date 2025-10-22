const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");

module.exports.config = {
  name: "uptime",
  version: "3.0",
  author: "Ahmed Tarif",
  role: 0,
  category: "system",
  description: {
    en: "Show bot uptime with a running image 🏃‍♂️"
  },
  guide: {
    en: "{pn} → Display bot uptime with running image"
  }
};

module.exports.onStart = async function ({ api, event }) {
  try {
    const totalSeconds = process.uptime();
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

    // 🖼️ Canvas setup
    const width = 950, height = 550;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // 🌈 Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#1e3c72");
    gradient.addColorStop(1, "#2a5298");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 🏃‍♂️ Load and draw running image
    const runningImg = await loadImage("https://i.ibb.co/fNN6MQ9/running-bot.gif").catch(() => null);
    if (runningImg) {
      ctx.drawImage(runningImg, width / 2 - 150, height / 2 - 200, 300, 300);
    } else {
      // fallback icon if image fails to load
      ctx.font = "bold 120px Sans-Serif";
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "center";
      ctx.fillText("🏃‍♂️", width / 2, height / 2 - 50);
    }

    // ✨ Title
    ctx.font = "bold 60px Sans-Serif";
    ctx.fillStyle = "#FFD700";
    ctx.textAlign = "center";
    ctx.fillText("BOT RUNNING", width / 2, 100);

    // ⏱️ Uptime text
    ctx.font = "bold 46px Sans-Serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Uptime: ${uptimeText}`, width / 2, height - 160);

    // 🕒 Current time
    ctx.font = "30px Sans-Serif";
    ctx.fillStyle = "#00FFFF";
    ctx.fillText(`⏰ ${currentTime}`, width / 2, height - 110);

    // 👨‍💻 Author credit
    ctx.font = "26px Sans-Serif";
    ctx.fillStyle = "#CCCCCC";
    ctx.fillText("👨‍💻 Author: Ahmed Tarif", width / 2, height - 60);

    // 💾 Save image
    const imgPath = __dirname + "/cache/uptime_running.png";
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imgPath, buffer);

    // 🚀 Send message with image
    api.sendMessage(
      {
        body: `⚡ 𝗕𝗼𝘁 𝗥𝘂𝗻𝗻𝗶𝗻𝗴 ⚡\n━━━━━━━━━━━━━━━\n✅ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeText}\n🕒 𝗧𝗶𝗺𝗲: ${currentTime}\n👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿: Ahmed Tarif`,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ | Failed to create running image uptime.", event.threadID, event.messageID);
  }
};
