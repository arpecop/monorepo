// app/api/[...search]/route.ts
import { NextRequest, NextResponse } from "next/server";

// CouchDB configuration
const COUCHDB_URL = "https://1:1@db.rudixops.dev";
const DB_NAME = "images";

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
  try {
    const slugArray = (await ctx.params).search as unknown as string[];

    const slug = slugArray.join("/");
    const slugt = slug.replace(".jpg", "").replace(/-/g, "%20").replace("q/", "");

    // Decode the Base64 string into a Buffer
    const transparentBuffer = Buffer.from(TRANSPARENT_PNG_BASE64, "base64");

    // Check if document exists in CouchDB
    const docUrl = `${COUCHDB_URL}/${DB_NAME}/${encodeURIComponent(slugt)}`;
    const docResponse = await fetch(docUrl, { redirect: "follow" });
    const cachedd = docResponse.ok ? await docResponse.json() : null;

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
          redirect: "follow",
        },
      );

      let src = await response.text();

      try {
        src = src
          .split("<script type=\"application/json\" data-component='Search'>")[1]
          .split("</script>")[0];
      } catch (error) {
        console.error("Failed to parse Getty Images response:", error);
        
        // Store transparent image in CouchDB
        await fetch(docUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _attachments: {
              "image.jpg": {
                content_type: "image/jpeg",
                data: transparentBuffer.toString("base64"),
              },
            },
          }),
          redirect: "follow",
        }).catch(() => null);

        return new NextResponse(transparentBuffer, {
          headers: { "Content-Type": "image/png" },
        });
      }

      const jsonresp = JSON.parse(src);

      if (jsonresp.search?.gallery?.assets?.[0]) {
        const responsex = await fetch(jsonresp.search.gallery.assets[0].thumbUrl, {
          redirect: "follow",
        });

        const buffer = Buffer.from(await responsex.arrayBuffer());
        
        // Store image and metadata in CouchDB
        await fetch(docUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...jsonresp.search.gallery.assets[0],
            _attachments: {
              "image.jpg": {
                content_type: "image/jpeg",
                data: buffer.toString("base64"),
              },
            },
          }),
          redirect: "follow",
        });

        return new NextResponse(buffer, {
          headers: { "Content-Type": "image/jpeg" },
        });
      } else {
        // Store transparent image in CouchDB
        await fetch(docUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _attachments: {
              "image.jpg": {
                content_type: "image/jpeg",
                data: transparentBuffer.toString("base64"),
              },
            },
          }),
          redirect: "follow",
        }).catch((e) =>
          console.error("Failed to insert transparent image into DB:", e),
        );
        
        return new NextResponse(transparentBuffer, {
          headers: { "Content-Type": "image/png" },
        });
      }
    }

    // Get attachment from CouchDB
    const attachmentUrl = `${COUCHDB_URL}/${DB_NAME}/${encodeURIComponent(slugt)}/image.jpg`;
    const attachmentResponse = await fetch(attachmentUrl, { redirect: "follow" });
    const imageBuffer = Buffer.from(await attachmentResponse.arrayBuffer());

    return new NextResponse(imageBuffer, {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    // Return error as plain text for debugging in Cloudflare
    const errorMessage = error instanceof Error 
      ? `Error: ${error.message}\n\nStack: ${error.stack}\n\nName: ${error.name}`
      : `Unknown error: ${String(error)}`;
    
    return new NextResponse(errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
