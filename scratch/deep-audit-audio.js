async function audit() {
  const url = "https://4cwebabatgkwfmxs.public.blob.vercel-storage.com/testimonials-audio/a8ca2e5d-517d-4a8c-96cb-fca5c7b231b3.mp3";
  
  // 1. Fetch headers only
  const headRes = await fetch(url, { method: "HEAD" });
  console.log("=== HEADERS ===");
  console.log("Status:", headRes.status);
  console.log("Content-Type:", headRes.headers.get("content-type"));
  console.log("Content-Length:", headRes.headers.get("content-length"));
  console.log("Accept-Ranges:", headRes.headers.get("accept-ranges"));
  console.log("Access-Control-Allow-Origin:", headRes.headers.get("access-control-allow-origin"));

  // 2. Fetch first 128 bytes
  const res = await fetch(url, { headers: { Range: "bytes=0-127" } });
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  console.log("\n=== HEX (first 128 bytes) ===");
  console.log(Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '));

  console.log("\n=== ASCII ===");
  console.log(Array.from(bytes).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join(''));

  // 3. Identify format
  const magic = bytes.slice(0, 4);
  console.log("\n=== FORMAT DETECTION ===");
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    console.log("✅ ID3 header — MP3 file");
  } else if (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0) {
    console.log("✅ MPEG sync word — MP3 frame (no ID3 header)");
  } else if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    console.log("⚠️  ftyp box — MP4/M4A container (NOT raw MP3!)");
    const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    console.log("Brand:", brand);
  } else if (bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67) {
    console.log("⚠️  OGG container (Ogg Vorbis / Opus)");
  } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    console.log("⚠️  RIFF header — WAV file");
  } else {
    console.log("❓ Unknown format. First 4 bytes:", Array.from(magic).map(b => b.toString(16).padStart(2,'0')).join(' '));
  }
}

audit().catch(console.error);
