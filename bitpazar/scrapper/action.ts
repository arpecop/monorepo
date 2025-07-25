import { parseProperties, parseAdDescription } from "./parser.ts";
import postgres from "postgres";
import { config } from "dotenv";
import { cats } from "./cats.ts";

// Load environment variables from .env file
config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

// Set up the database connection
const sql = postgres(DATABASE_URL, { max: 50 }); // Increased connection pool for parallel processing

console.log("Successfully connected to PostgreSQL!");

async function processCategory(category: (typeof cats)[0]) {
  try {
    if (category.children && category.children.length > 0) {
      return; // Skip parent categories in this flat processing model
    }

    if (!category.path) {
      console.error(
        `\n--- SKIPPING category because 'path' is missing. ID: ${category?.id}, Name: ${category?.name} ---`,
      );
      return;
    }

    const categorySlug = category.slug ?? `unknown-slug-${category.id}`;

    const existingBatch = await sql`
      SELECT 1 FROM products.products
      WHERE type = 'batch-marker'
        AND slug = ${categorySlug}
        AND created_at > NOW() - INTERVAL '1 hour'
      LIMIT 1
    `;

    if (existingBatch.count > 0) {
      return; // Silently skip for cleaner logs
    }

    console.log(
      `--- Scraping category: ${category.name || `(ID: ${category.id})`}`,
    );

    const html = await fetch(category.path, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    }).then((response) => response.text());

    const properties = parseProperties(
      html,
      category.name ?? "Unknown",
      category.id ?? 0,
      category.type ?? "unknown",
      categorySlug,
    );

    if (properties.length > 0) {
      const propertiesToInsert = properties.map((prop) => ({
        url_slug: prop.url_slug ?? null,
        title: prop.title ?? null,
        price: prop.price ?? null,
        currency: prop.currency ?? null,
        city: prop.city ?? null,
        district: prop.district ?? null,
        date: null,
        image_url: prop.imageUrl ?? null,
        details_url: prop.detailsUrl ?? null,
        category: prop.category ?? null,
        category_id: prop.categoryId ?? null,
        type: prop.type ?? null,
        slug: prop.slug ?? null,
      }));

      await sql`
        INSERT INTO products.products ${sql(propertiesToInsert, "url_slug", "title", "price", "currency", "city", "district", "date", "image_url", "details_url", "category", "category_id", "type", "slug")}
        ON CONFLICT (url_slug) DO NOTHING
      `;
    }

    const batchMarker = {
      url_slug: `delivered-batch-${categorySlug}-${new Date().getTime()}`,
      title: `Delivered batch for ${category.name || `(ID: ${category.id})`}`,
      price: null,
      currency: null,
      city: null,
      district: null,
      date: new Date(),
      image_url: null,
      details_url: null,
      category: category.name ?? "Unknown",
      category_id: category.id ?? 0,
      type: "batch-marker",
      slug: categorySlug,
    };

    await sql`INSERT INTO products.products ${sql([batchMarker])}`;
  } catch (error) {
    console.error(
      `\n--- FAILED to process category: "${category?.name}" (ID: ${category?.id}). Error: ${error.message} ---`,
    );
  }
}

async function processAdDetails(ad: { url_slug: string; details_url: string }) {
  try {
    if (!ad.details_url) {
      return;
    }

    const html = await fetch(ad.details_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    }).then((response) => response.text());

    const description = parseAdDescription(html);

    await sql`
      UPDATE products.products
      SET description = ${description}, processed = true
      WHERE url_slug = ${ad.url_slug}
    `;
  } catch (error) {
    console.error(`Failed to process ad ${ad.url_slug}: ${error.message}`);
    // Mark as processed even if it fails to avoid retrying a broken link
    await sql`UPDATE products.products SET processed = true WHERE url_slug = ${ad.url_slug}`;
  }
}

async function main() {
  try {
    // --- Phase 1: Scrape Categories for Ad Listings ---
    const leafCategories = cats.filter(
      (c) => !c.children || c.children.length === 0,
    );
    const categoryChunkSize = 50;
    console.log(`Found ${leafCategories.length} leaf categories to process.`);

    for (let i = 0; i < leafCategories.length; i += categoryChunkSize) {
      const chunk = leafCategories.slice(i, i + categoryChunkSize);
      await Promise.all(chunk.map((category) => processCategory(category)));
      console.log(
        `--- Finished category batch ${i / categoryChunkSize + 1} / ${Math.ceil(leafCategories.length / categoryChunkSize)} ---`,
      );
    }
    console.log("\n✅ Category scraping phase completed.\n");

    // --- Phase 2: Fetch Details for Unprocessed Ads ---
    console.log("Starting ad detail processing phase...");
    const adChunkSize = 250;

    while (true) {
      const adsToProcess = await sql`
        SELECT url_slug, details_url FROM products.products
        WHERE processed = false AND details_url IS NOT NULL AND type != 'batch-marker'
        LIMIT ${adChunkSize}
      `;

      if (adsToProcess.length === 0) {
        console.log("No more ads to process.");
        break;
      }

      console.log(
        `--- Processing a batch of ${adsToProcess.length} ads for details... ---`,
      );
      await Promise.all(adsToProcess.map((ad) => processAdDetails(ad)));
    }

    console.log("\n✅ Action completed successfully.");
  } catch (error) {
    console.error("An error occurred during the main execution:", error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log("Database connection closed.");
  }
}

main();
