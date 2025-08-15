// app/api/[...search]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Nano from "nano";

// Determine if in development mode for host configuration
const dev = process.env.NODE_ENV === "development";
const host = dev ? "192.168.100.102" : "host.docker.internal";

// Initialize NanoDB
const n = Nano(`http://1:1@${host}:5984`);

const db = n.db.use("images");

// HARDCODED TRANSPARENT PNG (Base64 encoded)
// REPLACE THIS WITH YOUR ACTUAL BASE64 STRING
const TRANSPARENT_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
// This is a 1x1 transparent PNG. If your original is different, use its Base64.
// To get the Base64 for a typical transparent PNG, follow Step 1 above.

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{ search: string }>;
  },
) {
  const slugArray = (await ctx.params).search as unknown as string[];

  const slug = slugArray.join("/");
  const slugt = slug.replace(".jpg", "").replace(/-/g, "%20").replace("q/", "");

  // Decode the Base64 string into a Buffer
  const transparentBuffer = Buffer.from(TRANSPARENT_PNG_BASE64, "base64");

  const cachedd = await db.get(slugt).catch(() => null);

  if (!cachedd) {
    const response = await fetch(
      "https://www.gettyimages.com/search/2/image-film?family=creative&phrase=" +
        slugt,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        },
      },
    );

    let src = await response.text();

    try {
      src = src
        .split("<script type=\"application/json\" data-component='Search'>")[1]
        .split("</script>")[0];
    } catch (error) {
      console.error("Failed to parse Getty Images response:", error);
      await db.multipart
        .insert(
          {},
          [
            {
              name: "image.jpg",
              data: transparentBuffer,
              content_type: "image/jpeg",
            },
          ],
          slugt,
        )
        .catch(() => null);

      return new NextResponse(transparentBuffer, {
        headers: { "Content-Type": "image/png" }, // Set content type to PNG as it's a PNG
      });
    }

    const jsonresp = JSON.parse(src);

    if (jsonresp.search?.gallery?.assets?.[0]) {
      const responsex = await fetch(jsonresp.search.gallery.assets[0].thumbUrl);

      const buffer = Buffer.from(await responsex.arrayBuffer());
      await db.multipart.insert(
        jsonresp.search.gallery.assets[0],
        [
          {
            name: "image.jpg",
            data: buffer,
            content_type: "image/jpeg",
          },
        ],
        slugt,
      );

      return new NextResponse(buffer, {
        headers: { "Content-Type": "image/jpeg" },
      });
    } else {
      await db.multipart
        .insert(
          {},
          [
            {
              name: "image.jpg",
              data: transparentBuffer,
              content_type: "image/jpeg", // Keep as jpeg for consistency, though it's a PNG
            },
          ],
          slugt,
        )
        .catch((e) =>
          console.error("Failed to insert transparent image into DB:", e),
        );
      return new NextResponse(transparentBuffer, {
        headers: { "Content-Type": "image/png" }, // Set content type to PNG as it's a PNG
      });
    }
  }

  const responsex = await db.attachment.get(slugt, "image.jpg");

  return new NextResponse(responsex, {
    headers: { "Content-Type": "image/jpeg" }, // This header might need dynamic adjustment
  });
}
