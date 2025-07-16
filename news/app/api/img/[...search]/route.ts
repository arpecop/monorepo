// app/api/[...search]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Nano from "nano";

// Determine if in development mode for host configuration
const dev = process.env.NODE_ENV === "development";
const host = dev ? "192.168.0.102" : "couchdb";

// Initialize NanoDB
const n = Nano(`http://couch:${process.env.COUCHDB_PASSWORD}@${host}:5984`);

const db = n.db.use("images");

// HARDCODED TRANSPARENT PNG (Base64 encoded)
// REPLACE THIS WITH YOUR ACTUAL BASE64 STRING
const TRANSPARENT_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
// This is a 1x1 transparent PNG. If your original is different, use its Base64.
// To get the Base64 for a typical transparent PNG, follow Step 1 above.

export async function GET(
  req: NextRequest,
  { params }: { params: { search: string[] } },
) {
  const slugArray = params.search;
  const slug = slugArray.join("/");
  const slugt = slug.replace(".jpg", "").replace(/-/g, "%20").replace("q/", "");
  console.log({ slugArray, slugt });

  // Decode the Base64 string into a Buffer
  const transparentBuffer = Buffer.from(TRANSPARENT_PNG_BASE64, "base64");

  let cachedd = null;
  try {
    cachedd = await db.get(slugt);
  } catch (_e: unknown) {
    console.error("No cache found for", slugt, _e);
    cachedd = null;
  }

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

    let jsonresp;
    try {
      jsonresp = JSON.parse(src);
    } catch (error) {
      console.error("Failed to parse JSON from Getty Images response:", error);
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
      console.log(
        "No assets found in Getty Images response, using transparent image.",
      );
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
  // Note: If 'image.jpg' in CouchDB is actually a PNG (as we're storing the transparent one),
  // you might need to adjust the Content-Type header dynamically if you expect to retrieve
  // either JPEG or PNG from the DB depending on what was stored.
  // For now, assuming most cached items will be JPEGs unless it's the transparent fallback.
  // If the fetched image from DB is a transparent PNG, ensure the header is 'image/png'.
  // This might require storing the content_type in the CouchDB document itself.
  return new NextResponse(responsex, {
    headers: { "Content-Type": "image/jpeg" }, // This header might need dynamic adjustment
  });
}
