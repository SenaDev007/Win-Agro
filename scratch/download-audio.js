const fs = require('fs');

async function run() {
  const url = "https://4cwebabatgkwfmxs.public.blob.vercel-storage.com/testimonials-audio/40957341-e0de-434e-a5e9-29a94da8c28e.mp3";
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync('public/test-sound.mp3', Buffer.from(buffer));
    console.log("Downloaded successfully! Size:", fs.statSync('public/test-sound.mp3').size);
  } catch (err) {
    console.error("Download failed:", err);
  }
}
run();
