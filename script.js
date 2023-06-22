const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

const data = ``;

const lines = data.split("\n"); // split the string into lines
const urls = []; // this will hold the URLs

for (let i = 0; i < lines.length; i += 3) {
  const line = lines[i];
  if (line.startsWith("http")) {
    urls.push(line);
  }
}

urls.forEach((url, index) => {
  ytdl.getInfo(url).then((info) => {
    let title = info.videoDetails.title;
    title = title.replace(/[^a-zA-Z0-9 ]/g, ""); // removes characters that might be invalid for a file name

    let stream = ytdl.downloadFromInfo(info, { quality: "highestaudio" });

    ffmpeg(stream)
      .audioBitrate(128)
      .save(`${__dirname}/${title}.mp3`)
      .on("progress", (p) => {
        console.log(`${title}: ${p.targetSize}kb downloaded`);
      });
  });
});
