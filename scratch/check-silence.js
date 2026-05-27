async function run() {
  const url = "https://4cwebabatgkwfmxs.public.blob.vercel-storage.com/testimonials-audio/40957341-e0de-434e-a5e9-29a94da8c28e.mp3";
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    console.log("Total bytes:", bytes.length);
    
    // Count non-zero bytes after the ID3 header
    let nonZeroCount = 0;
    for (let i = 2000; i < bytes.length; i++) {
      if (bytes[i] !== 0) {
        nonZeroCount++;
      }
    }
    console.log("Non-zero bytes after header:", nonZeroCount);
    console.log("Percentage of non-zero bytes:", (nonZeroCount / (bytes.length - 2000) * 100).toFixed(2) + "%");
  } catch (err) {
    console.error(err);
  }
}
run();
