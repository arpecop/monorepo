import postgres from "postgres";
import jsdom from "jsdom";
import dotenv from "dotenv";

dotenv.config();

const { JSDOM } = jsdom;

const sql = postgres(process.env.DATABASE_URL!);

async function scrapeDescriptions() {
  const products = await sql`
    SELECT * FROM products.products WHERE processed IS NOT TRUE LIMIT 10
  `;

  if (products.length === 0) {
    console.log("All product descriptions scraped. Exiting.");
    await sql.end();
    return;
  }

  for (const product of products) {
    if (!product.details_url) {
      console.log(`Skipping product with null URL (slug: ${product.url_slug})`);
      await sql`UPDATE products.products SET processed = TRUE WHERE url_slug = ${product.url_slug}`;
      continue;
    }
    try {
      const response = await fetch(product.details_url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const descriptionElement = dom.window.document.querySelector(
        '[data-cy="ad_description"] .css-19duwlz'
      );

      let description = descriptionElement?.textContent?.trim() || null;

      await sql`
        UPDATE products.products
        SET
          description = ${description},
          processed = TRUE
        WHERE
          url_slug = ${product.url_slug}
      `;

      console.log(`Processed: ${product.details_url}`);
      if (description) {
        console.log(`  Description snippet: ${description.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error(`Failed to process ${product.details_url}:`, error);
    }
  }

  console.log("Finished processing batch of 10. Exiting.");
  await sql.end();
}

scrapeDescriptions();
