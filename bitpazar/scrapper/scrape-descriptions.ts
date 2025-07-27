import postgres from "postgres";
import jsdom from "jsdom";
import "dotenv/config";

const { JSDOM } = jsdom;

const LEGIT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

async function scrapeDescription(
  sql: postgres.Sql,
  product: { title: string | null; details_url: string; url_slug: string },
) {
  if (!product.details_url) {
    console.log(`Skipping product with null URL (slug: ${product.url_slug})`);
    await sql`
      UPDATE products.products
      SET description_scraped_at = NOW()
      WHERE url_slug = ${product.url_slug}
    `;
    return;
  }

  try {
    const response = await fetch(product.details_url, {
      headers: { "User-Agent": LEGIT_USER_AGENT },
    });
    const html = await response.text();
    const dom = new JSDOM(html);
    const descriptionElement = dom.window.document.querySelector(
      '[data-cy="adPage-description-text"]',
    );

    const description = descriptionElement?.textContent?.trim() || null;

    await sql`
      UPDATE products.products
      SET
        description = ${description},
        description_scraped_at = NOW()
      WHERE
        url_slug = ${product.url_slug}
    `;

    console.log(`Processed: ${product.title || product.url_slug}`);
    if (description) {
      console.log(`  ✅ Description found: ${description.substring(0, 100)}...`);
    } else {
      console.log(`  ❌ Description not found.`);
    }
  } catch (error) {
    console.error(`Failed to process ${product.details_url}:`, error);
  }
}

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);

  const products = await sql`
    SELECT title, details_url, url_slug
    FROM products.products
    WHERE description IS NULL
    LIMIT 40
  `;

  if (products.length === 0) {
    console.log("All product descriptions scraped. Exiting.");
    await sql.end();
    return;
  }

  console.log(`Found ${products.length} products to scrape.`);

  const chunkSize = 20;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    console.log(`--- Processing chunk ${i / chunkSize + 1} ---`);
    const startTime = Date.now();
    await Promise.all(chunk.map((product) => scrapeDescription(sql, product)));
    const endTime = Date.now();
    console.log(
      `--- Chunk ${i / chunkSize + 1} processed in ${
        (endTime - startTime) / 1000
      } seconds ---`,
    );
  }

  console.log("Finished processing all chunks.");
  await sql.end();
}

main();
