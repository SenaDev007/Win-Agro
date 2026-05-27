async function audit() {
  const url = "https://4cwebabatgkwfmxs.public.blob.vercel-storage.com/testimonials-audio/40957341-e0de-434e-a5e9-29a94da8c28e.mp3";
  try {
    const res = await fetch(url, { headers: { Range: "bytes=0-63" } });
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    console.log("Hex signature:");
    console.log(Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.log("ASCII signature:");
    console.log(Array.from(bytes).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join(''));
  } catch (err) {
    console.error(err);
  }
}
audit();
