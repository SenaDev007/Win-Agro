import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_BLOB_HOST = "public.blob.vercel-storage.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encodedSrc = searchParams.get("src");

  if (!encodedSrc) {
    return new NextResponse("Missing src parameter", { status: 400 });
  }

  let blobUrl: string;
  try {
    blobUrl = decodeURIComponent(encodedSrc);
  } catch {
    return new NextResponse("Invalid URL encoding", { status: 400 });
  }

  // Security: only proxy Vercel Blob URLs
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(blobUrl);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (!parsedUrl.hostname.endsWith(ALLOWED_BLOB_HOST)) {
    return new NextResponse("URL not allowed", { status: 403 });
  }

  // Forward the Range header so that audio seeking works in the browser
  const rangeHeader = request.headers.get("range");
  const fetchHeaders: Record<string, string> = {};
  if (rangeHeader) {
    fetchHeaders["Range"] = rangeHeader;
  }

  try {
    const upstream = await fetch(blobUrl, { headers: fetchHeaders });

    const responseHeaders = new Headers();

    const contentType = upstream.headers.get("content-type");
    responseHeaders.set("content-type", contentType || "audio/mpeg");

    const contentLength = upstream.headers.get("content-length");
    if (contentLength) responseHeaders.set("content-length", contentLength);

    const contentRange = upstream.headers.get("content-range");
    if (contentRange) responseHeaders.set("content-range", contentRange);

    responseHeaders.set("accept-ranges", "bytes");

    // Cache for 1 year (blob files are immutable — changing content means new URL)
    responseHeaders.set("cache-control", "public, max-age=31536000, immutable");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Audio proxy error:", error);
    return new NextResponse("Failed to fetch audio", { status: 502 });
  }
}
