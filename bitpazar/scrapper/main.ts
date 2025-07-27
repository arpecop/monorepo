import "dotenv/config";
import postgres from "postgres";
import { z } from "zod";
import { parseProperties, Property } from "./parser";
import { cats } from "./cats";

// Common constants
const LEGIT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// --- Category Scraping Logic (from action.ts) ---

type Category = (typeof cats)[number];

const productSchema = z.object({
  url_slug: z.string(),
  title: z.string().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  city: z.string().nullable(),
  district: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  details_url: z.string().nullable(),
  category: z.string(),
  category_id: z.number(),
  type: z.string(),
  slug: z.string(),
});

type Product = z.infer<typeof productSchema>;

const HOUR_IN_MS = 60 * 60 * 1000;

async function syncAndGetScrapeList(
  sql: postgres.Sql,
  allCategories: Category[],
): Promise<Category[]> {
  console.log("Syncing categories with cronlogic table...");

  const categoryInserts = allCategories.map((c) => ({
    category_id: c.id,
    category_name: c.name,
  }));

  await sql`
    INSERT INTO products.cronlogic ${sql(categoryInserts)}
    ON CONFLICT (category_id) DO NOTHING
  `;

  const oneHourAgo = new Date(Date.now() - HOUR_IN_MS);

  const categoriesToScrapeIds = await sql`
    SELECT category_id FROM products.cronlogic
    WHERE last_scraped_at IS NULL OR last_scraped_at < ${oneHourAgo}
  `;

  const idSet = new Set(categoriesToScrapeIds.map((row) => row.category_id));
  return allCategories.filter((c) => idSet.has(c.id));
}

async function processCategory(category: Category, sql: postgres.Sql) {
  console.log(`Processing category: ${category.name}`);
  const url = category.path;
  let productsFound = false;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": LEGIT_USER_AGENT },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch category ${category.name}: ${response.statusText}`,
      );
      return;
    }

    const content = await response.text();
    const parsedProducts: Property[] = parseProperties(
      content,
      category.name,
      category.id,
      category.type,
      category.label,
    );

    const relevantProducts = parsedProducts.filter(
      (p) => p.categoryId === category.id && p.url_slug !== null,
    );

    if (relevantProducts.length > 0) {
      productsFound = true;
      const products: Product[] = relevantProducts.map((p) => ({
        url_slug: p.url_slug!,
        title: p.title,
        price: p.price,
        currency: p.currency,
        city: p.city,
        district: p.district,
        image_url: p.imageUrl,
        details_url: p.detailsUrl,
        category: p.category,
        category_id: p.categoryId,
        type: p.type,
        slug: p.slug,
      }));

      const validatedProducts = products
        .map((p) => {
          const validation = productSchema.safeParse(p);
          if (!validation.success) return null;
          return validation.data;
        })
        .filter((p): p is Product => p !== null);

      if (validatedProducts.length > 0) {
        await sql`
          INSERT INTO products.products ${sql(validatedProducts)}
          ON CONFLICT (url_slug) DO UPDATE
            SET created_at = now()
        `;
      }
    }
  } catch (error) {
    console.error(
      `An error occurred while processing category ${category.name}:`,
      error,
    );
    return;
  } finally {
    console.log(
      `Finished processing ${category.name}. Found products: ${productsFound}`,
    );
    await sql`
      UPDATE products.cronlogic
      SET last_scraped_at = now()
      WHERE category_id = ${category.id}
    `;
  }
}

async function scrapeCategories(sql: postgres.Sql) {
  console.log("--- Starting Category Scraping ---");

  const leafCategories = cats.filter(
    (c) => !c.children || c.children.length === 0,
  );

  const categoriesToProcess = await syncAndGetScrapeList(sql, leafCategories);

  if (categoriesToProcess.length === 0) {
    console.log("No new categories to scrape.");
    return;
  }

  console.log(`Found ${categoriesToProcess.length} categories to process.`);
  const categoryChunkSize = 50;

  for (let i = 0; i < categoriesToProcess.length; i += categoryChunkSize) {
    const chunk = categoriesToProcess.slice(i, i + categoryChunkSize);
    await Promise.all(chunk.map((cat) => processCategory(cat, sql)));
    console.log(
      `--- Finished category batch ${
        i / categoryChunkSize + 1
      } / ${Math.ceil(categoriesToProcess.length / categoryChunkSize)} ---`,
    );
  }

  console.log("--- Category Scraping Finished ---");
}

// --- Description Scraping Logic (from scrape-descriptions.ts) ---

type ProductDescriptionInfo = {
  title: string | null;
  details_url: string;
  url_slug: string;
};

async function scrapeDescription(
  sql: postgres.Sql,
  product: ProductDescriptionInfo,
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
    const match = html.match(/window\.__PRERENDERED_STATE__\s*=\s*(".*");/);
    let description: string | null = null;

    if (match && match[1]) {
      const jsonString = JSON.parse(match[1]);
      const data = JSON.parse(jsonString);
      description = data.ad?.ad?.description || null;
    }

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
      console.log(`  ✅ Description found: ${description.replace(/\n/g, " ").substring(0, 100)}...`);
    } else {
      console.log(`  ❌ Description not found.`);
    }
  } catch (error) {
    console.error(`Failed to process ${product.details_url}:`, error);
  }
}

async function scrapeDescriptions(sql: postgres.Sql) {
  console.log("\n--- Starting Description Scraping ---");

  const products = await sql<ProductDescriptionInfo[]>`
    SELECT title, details_url, url_slug
    FROM products.products
    WHERE description_scraped_at IS NULL
    LIMIT 20
  `;

  if (products.length === 0) {
    console.log("No new descriptions to scrape.");
    return;
  }

  console.log(`Found ${products.length} products to scrape descriptions for.`);
  const chunkSize = 20;

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    console.log(`--- Processing description chunk ${i / chunkSize + 1} ---`);
    const startTime = Date.now();
    await Promise.all(chunk.map((product) => scrapeDescription(sql, product)));
    const endTime = Date.now();
    console.log(
      `--- Description chunk ${i / chunkSize + 1} processed in ${
        (endTime - startTime) / 1000
      } seconds ---`,
    );
  }

  console.log("--- Description Scraping Finished ---");
}

// --- Main Execution ---

async function main() {
  const databaseUrl = "postgres://rudix:maximus@130.204.65.82:5432/rudix";

  const sql = postgres(databaseUrl);

  try {
    await scrapeCategories(sql);
    await scrapeDescriptions(sql);
  } finally {
    await sql.end();
    console.log("\nScraping process complete. Database connection closed.");
  }
}

main().catch(console.error);