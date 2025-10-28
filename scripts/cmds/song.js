const ytSearch = require("yt-search");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "http://65.109.80.126:20409/aryan/yx";

async function downloadStream(url) {
    const response = await axios({ url, responseType: "stream" });
    return response.data;
}

module.exports = {
    config: {
        name: "song",
        aliases: [],
        version: "1.2.1",
        usePrefix: false,
        author: "AHMED TARIF",
        description: { en: "Download YouTube song (audio) automatically" },
        category: "MUSIC",
        guide: { en: "{pn} <song name or URL>" }
    },

    onStart: async function ({ api, args, event }) {
        const query = args.join(" ");
        if (!query) {
            return api.sendMessage("❌ Please provide a song name or YouTube URL.", event.threadID, event.messageID);
        }

        let waitingMessage;
        try {
            let videoUrl = query;
            let songTitle = "";

            // 🔍 Search YouTube if it's not a direct link
            if (!query.startsWith("http")) {
                const searchResult = await ytSearch(query);
                const videos = searchResult.videos.slice(0, 1);
                if (!videos.length) {
                    return api.sendMessage("❌ No song found for your query.", event.threadID, event.messageID);
                }
                videoUrl = videos[0].url;
                songTitle = videos[0].title;
            } else {
                // 🎧 If URL given, get video info
                const videoId = videoUrl.split("v=")[1] || videoUrl.split("/").pop();
                const info = await ytSearch({ videoId });
                songTitle = info.videos[0]?.title || "Unknown Song";
            }

            // ⏳ Send temporary “downloading” message
            waitingMessage = await api.sendMessage("♲︎︎︎| 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐒𝐨𝐧𝐠...✘", event.threadID);

            // 🚀 Download and send song
            await downloadSong(videoUrl, api, event, songTitle);

        } catch (err) {
            console.error(err);
            api.sendMessage("❌ Failed to search or download the song.", event.threadID, event.messageID);
        } finally {
            // 🗑️ Remove the waiting message
            if (waitingMessage?.messageID) {
                await api.unsendMessage(waitingMessage.messageID);
            }
        }
    }
};

async function downloadSong(url, api, event, title) {
    try {
        // 🎶 Request audio (MP3) download link from your API
        const { data } = await axios.get(`${API_URL}?url=${encodeURIComponent(url)}&type=mp3`);
        const downloadUrl = data.download_url;
        if (!data.status || !downloadUrl) throw new Error("Audio API failed");

        const filePath = path.join(__dirname, `song_${Date.now()}.mp3`);
        const stream = fs.createWriteStream(filePath);
        const audioStream = await downloadStream(downloadUrl);
        audioStream.pipe(stream);

        await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });

        // 🎵 Send the downloaded song
        await api.sendMessage(
            { body: `♲︎︎︎| 𝐏𝐥𝐚𝐲𝐢𝐧𝐠...⌨︎\n𐙚━━━━━━━━━𐙚\n⧉| 𝐔𝐫𝐋..:${title}`, attachment: fs.createReadStream(filePath) },
            event.threadID,
            event.messageID
        );

        // Delete temporary file
        fs.unlinkSync(filePath);

    } catch (err) {
        console.error("Song download error:", err.message);
        api.sendMessage("❌ Failed to download song.", event.threadID, event.messageID);
    }
}
